const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isAllowedImageHost(hostname: string) {
  const host = hostname.toLowerCase();
  return host === "i.imgur.com" || host === "imgur.com" || host === "www.imgur.com" || host === "zonafantasmanet.files.wordpress.com";
}

Deno.serve(async request => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "GET") return errorResponse("Método não permitido.", 405);

  try {
    const value = new URL(request.url).searchParams.get("url");
    if (!value) return errorResponse("Informe o parâmetro url.", 400);
    const source = new URL(value);
    if (source.protocol !== "https:" || !isAllowedImageHost(source.hostname)) return errorResponse("A URL precisa apontar para uma imagem autorizada.", 400);
    const upstream = await fetch(source, {
      headers: { Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8", Referer: "https://hqs-soquadrinhos.blogspot.com/" },
    });
    if (!upstream.ok || !upstream.body) return errorResponse(`Imgur respondeu HTTP ${upstream.status}.`, 502);
    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", upstream.headers.get("content-type") || "image/jpeg");
    headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400");
    return new Response(upstream.body, { status: 200, headers });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Falha ao acessar a imagem.", 502);
  }
});
