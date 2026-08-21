import { File } from "npm:megajs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Expose-Headers": "Content-Range, Content-Length, Content-Type, Content-Disposition",
};

const MAX_FILE_BYTES = 512 * 1024 * 1024;

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parseMegaUrl(value: string) {
  const source = new URL(value);
  if (source.protocol !== "https:" || !["mega.nz", "www.mega.nz"].includes(source.hostname.toLowerCase())) {
    throw new Error("A URL precisa apontar para o Mega.");
  }
  if (!source.pathname.startsWith("/file/")) throw new Error("Use uma URL pública no formato mega.nz/file/...");
  if (!source.hash || source.hash.length < 2) throw new Error("A URL do Mega não contém a chave de descriptografia.");
  return source;
}

function loadFileAttributes(file: any) {
  return new Promise<void>((resolve, reject) => {
    file.loadAttributes((error: Error | null) => error ? reject(error) : resolve());
  });
}

function readMegaBlock(stream: any): Promise<Uint8Array> {
  if (!stream || typeof stream.on !== "function") return Promise.reject(new Error("O Mega não retornou um stream compatível."));
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    let total = 0;
    let finished = false;
    const cleanup = () => {
      stream.removeListener?.("data", onData);
      stream.removeListener?.("end", onEnd);
      stream.removeListener?.("close", onClose);
      stream.removeListener?.("error", onError);
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      cleanup();
      const result = new Uint8Array(total);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.byteLength;
      }
      resolve(result);
    };
    const onData = (chunk: Uint8Array | ArrayBuffer) => {
      if (finished) return;
      const value = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
      chunks.push(value);
      total += value.byteLength;
    };
    const onEnd = () => finish();
    // O megajs encerra alguns ranges emitindo close sem emitir end. Damos
    // um pequeno intervalo para que um erro HTTP do Mega seja recebido antes
    // de aceitar o bloco como concluído.
    const onClose = () => setTimeout(finish, 100);
    const onError = (error: Error) => {
      if (finished) return;
      finished = true;
      cleanup();
      reject(error);
    };
    stream.on("data", onData);
    stream.once("end", onEnd);
    stream.once("close", onClose);
    stream.once("error", onError);
  });
}

async function downloadMegaBlock(file: any, start: number, end: number): Promise<Uint8Array> {
  const expected = end - start + 1;
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const block = await readMegaBlock(file.download({ start, end, maxConnections: 1 }));
      if (block.byteLength === expected) return block;
      lastError = new Error(`O Mega encerrou o bloco em ${block.byteLength} de ${expected} bytes.`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Falha ao baixar um bloco do Mega.");
}

function chunkedMegaStream(file: any, size: number): ReadableStream<Uint8Array> {
  const chunkSize = 1 * 1024 * 1024;
  let position = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (position >= size) {
        controller.close();
        return;
      }
      const start = position;
      const end = Math.min(size - 1, start + chunkSize - 1);
      try {
        const chunk = await downloadMegaBlock(file, start, end);
        position += chunk.byteLength;
        controller.enqueue(chunk);
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      position = size;
    },
  });
}

Deno.serve(async request => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "GET") return errorResponse("Método não permitido.", 405);

  try {
    const input = new URL(request.url).searchParams.get("url");
    if (!input) return errorResponse("Informe o parâmetro url.", 400);
    const source = parseMegaUrl(input);
    const file: any = File.fromURL(source.toString());
    await loadFileAttributes(file);

    const size = Number(file.size || 0);
    if (size > MAX_FILE_BYTES) return errorResponse("Arquivo excede o limite permitido.", 413);
    if (!size) throw new Error("O Mega não informou o tamanho do arquivo.");

    const range = request.headers.get("range")?.match(/^bytes=(\d+)-(\d*)$/i);
    let responseStatus = 200;
    let stream: ReadableStream<Uint8Array>;
    let responseLength = size;
    let contentRange = "";
    if (range) {
      const start = Number(range[1]);
      const requestedEnd = range[2] ? Number(range[2]) : size - 1;
      if (start >= size || requestedEnd < start) return errorResponse("Faixa inválida.", 416);
      const end = Math.min(requestedEnd, size - 1);
      responseStatus = 206;
      responseLength = end - start + 1;
      contentRange = `bytes ${start}-${end}/${size}`;
      stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            controller.enqueue(await downloadMegaBlock(file, start, end));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });
    } else {
      stream = chunkedMegaStream(file, size);
    }
    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", "application/octet-stream");
    headers.set("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(file.name || "arquivo-mega")}`);
    headers.set("Content-Length", String(responseLength));
    if (contentRange) headers.set("Content-Range", contentRange);
    headers.set("Cache-Control", "public, max-age=300");
    return new Response(stream, { status: responseStatus, headers });
  } catch (error) {
    console.error("mega-proxy", error);
    return errorResponse(error instanceof Error ? error.message : "Falha ao acessar o Mega.", 502);
  }
});
