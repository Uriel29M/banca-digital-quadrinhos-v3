(() => {
  "use strict";

  // --- Inicialização de Bibliotecas ---
  // --- Fim da Inicialização ---
  const DB_KEY = "bancaDigitalDB_v1";

  const DataStore = {
    load() {
      try {
        const saved = JSON.parse(localStorage.getItem(DB_KEY));
        if (saved?.library && saved?.collections) return saved;
      } catch {}
      const fresh = {
        library: structuredClone(window.DEFAULT_LIBRARY),
        collections: structuredClone(window.DEFAULT_COLLECTIONS),
        submissions: []
      };
      this.save(fresh);
      return fresh;
    },
    save(db) {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
  };

  const state = {
    db: DataStore.load(),
    section: "home",
    search: "",
    entityFilter: null,
    editingId: null,
    // Reading mode for PDF, CBZ, and CBR readers
    readingMode: localStorage.getItem("readingMode") || "single-page", // 'single-page', 'double-page', or 'continuous-scroll'
    readingDirection: localStorage.getItem("readingDirection") || "western" // 'western' or 'eastern'
  };

  const coverMemoryCache = new Map();
  const coverLoading = new Map();
  const coverAbortControllers = new Map();

  function cancelCoverLoads() {
    for (const controller of coverAbortControllers.values()) controller.abort();
    coverAbortControllers.clear();
    coverLoading.clear();
    $$('[data-cover-id]').forEach(element => { if (!coverMemoryCache.has(element.dataset.coverId)) element.dataset.coverReady = ""; });
  }

  function setReadingMode(mode) {
    state.readingMode = mode;
    localStorage.setItem("readingMode", mode);
  };

  function setReadingDirection(direction) {
    state.readingDirection = direction;
    localStorage.setItem("readingDirection", direction);
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[c]));
  }

  function getSpreadIndexes(totalPages, spread) {
    const a = spread * 2;
    const b = a + 1;

    if (state.readingDirection === "eastern") {
      return [b, a].filter(i => i < totalPages);
    }
    return [a, b].filter(i => i < totalPages);
  }

  function getSpreadPages(totalPages, spread) {
    const first = spread * 2 + 1;
    const second = first + 1;

    if (state.readingDirection === "eastern") {
      return [second, first].filter(p => p <= totalPages);
    }
    return [first, second].filter(p => p <= totalPages);
  }

  function getReaderPages(totalPages, skipCover) {
    const firstPage = skipCover && totalPages > 1 ? 2 : 1;
    return Array.from({ length: totalPages - firstPage + 1 }, (_, index) => firstPage + index);
  }

  function getReaderSpreadPages(totalPages, spread, skipCover) {
    const pages = getReaderPages(totalPages, skipCover).slice(spread * 2, spread * 2 + 2);
    return state.readingDirection === "eastern" ? pages.reverse() : pages;
  }

  function getReaderSpreadIndexes(totalPages, spread, skipCover) {
    return getReaderSpreadPages(totalPages, spread, skipCover).map(page => page - 1);
  }


  function formatType(type) {
    return type === "manga" ? "Mangá" : "Quadrinho";
  }

  function save() {
    DataStore.save(state.db);
  }

  function toast(message) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    $("#toast-root").appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function weightedRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function seriesKey(value = "") {
    return String(value).trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function uniqueCatalogItems(items) {
    const seen = new Set();
    return items.filter(item => {
      const key = item.seriesId || item.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function openItem(item) {
    if (!item) return;
    if (!item.seriesId) return openReader(item);
    const editions = state.db.library.filter(x => x.seriesId === item.seriesId);
    if (editions.length < 2) return openReader(item);
    openSeriesSelection(item, editions);
  }

  function seriesEditions(item) {
    if (!item?.seriesId) return [];
    return state.db.library.filter(x => x.seriesId === item.seriesId)
      .sort((a, b) => (Number(String(a.issue || "").match(/\d+/)?.[0]) || 0) - (Number(String(b.issue || "").match(/\d+/)?.[0]) || 0));
  }

  function appendSeriesNavigation(item, controls, overlay) {
    const editions = seriesEditions(item);
    if (editions.length < 2 || controls.querySelector("[data-series-nav]")) return;
    const current = editions.findIndex(x => x.id === item.id);
    const nav = document.createElement("span");
    nav.dataset.seriesNav = "true";
    nav.className = "series-reader-nav";
    nav.innerHTML = `
      <button title="Primeira edição" data-series-target="0" ${current <= 0 ? "disabled" : ""}>«</button>
      <button title="Edição anterior" data-series-target="${Math.max(0, current - 1)}" ${current <= 0 ? "disabled" : ""}>‹ Série</button>
      <button title="Próxima edição" data-series-target="${Math.min(editions.length - 1, current + 1)}" ${current >= editions.length - 1 ? "disabled" : ""}>Série ›</button>
      <button title="Última edição" data-series-target="${editions.length - 1}" ${current >= editions.length - 1 ? "disabled" : ""}>»</button>`;
    controls.appendChild(nav);
    $$('[data-series-target]', nav).forEach(button => button.addEventListener("click", () => {
      const target = editions[Number(button.dataset.seriesTarget)];
      if (!target || target.id === item.id) return;
      overlay._seriesObserver?.disconnect();
      overlay.remove();
      openReader(target);
    }));
  }

  function openEntityPage(kind, value) {
    state.entityFilter = { kind, value };
    setSection("entity");
  }

  function openReader(item, options = {}) {
    if (!item) return;

    item.clicks = (Number(item.clicks) || 0) + 1;
    save();

    const isTelegramLink = (url) => /^https?:\/\/(www\.)?t(elegram)?\.me\//.test(url || "");

    // A URL direta (fileUrl) tem prioridade. Se não houver, usamos a 'telegramUrl'
    // somente se ela NÃO for um link real do Telegram (ou seja, é um caminho de arquivo).
    const resolvedUrl = item.fileUrl || (!isTelegramLink(item.telegramUrl) ? item.telegramUrl : "");

    if (!resolvedUrl) {
      toast(item.telegramUrl ? "Links do Telegram não são suportados sem um servidor de ponte." : "Esta edição não tem uma URL de arquivo direto.");
      return;
    }

    const format = (item.format || extension(resolvedUrl)).toLowerCase();
    const skipCover = options.skipCover === true;
    let readerGrayscale = options.grayscale === true;
    const overlay = document.createElement("div");
    overlay.className = "reader-overlay";
    const supportedFormatsForModes = ["pdf", "cbz", "cbr"];
    const showModeSelector = supportedFormatsForModes.includes(format);
    overlay.innerHTML = `
      <div class="reader-top">
        <button class="small-btn" data-close-reader>← Voltar</button>
        <div class="reader-title">${escapeHTML(item.title)} — ${escapeHTML(item.issue || "")}</div>
        ${showModeSelector ? `
          <select class="small-btn" id="reading-mode-select">
            <option value="single-page" ${state.readingMode === 'single-page' ? 'selected' : ''}>Página por página</option>
            <option value="double-page" ${state.readingMode === 'double-page' ? 'selected' : ''}>
              Duas páginas
            </option>
            <option value="continuous-scroll" ${state.readingMode === 'continuous-scroll' ? 'selected' : ''}>Rolagem contínua</option>
          </select>
        ` : ''}
        <button class="small-btn" id="reading-direction-btn" style="display: ${showModeSelector && state.readingMode === 'double-page' ? 'inline-block' : 'none'};">
          ${state.readingDirection === 'eastern' ? '↔ Oriental' : '↔ Ocidental'}
        </button>
        ${showModeSelector ? `<button class="small-btn" data-toggle-cover>${skipCover ? 'Incluir capa' : 'Ignorar capa'}</button>` : ''}
        <button class="small-btn" data-toggle-grayscale>${readerGrayscale ? 'Cor normal' : 'Preto e branco'}</button>
        ${item.character ? `<button class="small-btn" data-browse-character>Ver personagem</button>` : ''}
        ${item.publisher ? `<button class="small-btn" data-browse-publisher>Ver editora</button>` : ''}
        <button class="small-btn" data-open-external>Abrir arquivo</button>
      </div>
      <div class="reader-body" id="reader-body"></div>
      <div class="reader-controls" id="reader-controls"></div>
    `;
    document.body.appendChild(overlay);

    $("[data-close-reader]", overlay).onclick = () => overlay.remove();
    $("[data-open-external]", overlay).onclick = () => window.open(resolvedUrl, "_blank", "noopener");
    $("[data-toggle-cover]", overlay)?.addEventListener("click", () => {
      overlay.remove();
      openReader(item, { skipCover: !skipCover });
    });

    $("[data-toggle-grayscale]", overlay)?.addEventListener("click", event => {
      readerGrayscale = !readerGrayscale;
      body.classList.toggle("reader-grayscale", readerGrayscale);
      event.currentTarget.textContent = readerGrayscale ? "Cor normal" : "Preto e branco";
    });
    $("[data-browse-character]", overlay)?.addEventListener("click", () => { overlay.remove(); openEntityPage("character", item.character); });
    $("[data-browse-publisher]", overlay)?.addEventListener("click", () => { overlay.remove(); openEntityPage("publisher", item.publisher); });

    const body = $("#reader-body", overlay);
    const controls = $("#reader-controls", overlay);
    body.classList.toggle("reader-grayscale", readerGrayscale);
    const seriesObserver = new MutationObserver(() => appendSeriesNavigation(item, controls, overlay));
    overlay._seriesObserver = seriesObserver;
    seriesObserver.observe(controls, { childList: true });
    $("[data-close-reader]", overlay).addEventListener("click", () => seriesObserver.disconnect(), { once: true });

    const directionButton = $("#reading-direction-btn", overlay);
    if (directionButton) {
      directionButton.onclick = () => {
        const newDirection = state.readingDirection === "western" ? "eastern" : "western";
        setReadingDirection(newDirection);
        directionButton.textContent = newDirection === "eastern" ? "↔ Oriental" : "↔ Ocidental";

        // If in double-page mode, re-render to apply the change
        if (state.readingMode === "double-page") {
          overlay.remove();
          openReader(item, { skipCover });
        }
      };
    }


    if (format === "pdf" || resolvedUrl.toLowerCase().split("?")[0].endsWith(".pdf")) {
      renderPDFReader(item, resolvedUrl, body, controls, overlay, skipCover);
    } else if (format === "cbz" || resolvedUrl.toLowerCase().split("?")[0].endsWith(".cbz")) {
      renderCBZReader(item, resolvedUrl, body, controls, overlay, skipCover);
    } else if (format === "cbr" || resolvedUrl.toLowerCase().split("?")[0].endsWith(".cbr")) {
      renderCBRReader(item, resolvedUrl, body, controls, overlay, skipCover);
    } else if (["jpg","jpeg","png","webp","gif"].includes(format)) {
      body.innerHTML = `<img class="reader-image" src="${escapeHTML(resolvedUrl)}" alt="">`;
      controls.innerHTML = `<span class="reader-page">Imagem</span>`;
    } else {
      const title = "Formato não suportado no leitor";
      const message = `O formato "${escapeHTML(format.toUpperCase())}" não pode ser lido diretamente no navegador. Use o botão "Abrir arquivo" para abri-lo em uma nova aba.`;
      body.innerHTML = `
        <div class="empty" style="margin:auto;max-width:650px">
          <h3>${escapeHTML(title)}</h3>
          <p>${escapeHTML(message)}</p>
        </div>`;
      controls.innerHTML = `<span class="reader-page">${escapeHTML(format.toUpperCase())}</span>`;
    }
  }

  function extension(url) {
    const clean = String(url || "").split("?")[0].split("#")[0];
    return clean.includes(".") ? clean.split(".").pop().toLowerCase() : "";
  }

  async function renderPDFReader(item, url, body, controls, overlay, skipCover = false) {
    body.innerHTML = `<div class="empty" style="margin:auto">Carregando PDF…</div>`;
    try {
      const pdfjs = window.pdfjsLib;
      // PDF.js 4.x via module pode não expor global em alguns navegadores.
      if (!pdfjs?.getDocument) {
        throw Object.assign(new Error("PDF.js nÃ£o estÃ¡ disponÃ­vel nesta pÃ¡gina."), { name: "PDFJS_MISSING" });
      }

      // Fetch the PDF data manually to have better control over errors.
      // This helps distinguish between "file not found" and "invalid file".
      body.innerHTML = `<div class="empty" style="margin:auto">Baixando PDFâ€¦</div>`;
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        cache: "no-store"
      });
      if (!response.ok) {
        // Create an error object similar to what pdf.js might throw for a 404.
        const error = new Error(`Arquivo não encontrado (HTTP ${response.status})`);
        error.name = 'MissingPDFException'; // Mimic pdf.js error for our handler.
        throw error;
      }
      const pdfData = await response.arrayBuffer();
      if (!pdfData.byteLength) throw new Error("PDF vazio.");

      // Pass the data as a typed array.
      body.innerHTML = `<div class="empty" style="margin:auto">Abrindo PDFâ€¦</div>`;
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(pdfData) }).promise;

      const currentReadingMode = state.readingMode;

      if (currentReadingMode === 'single-page') {
        let page = skipCover && pdf.numPages > 1 ? 2 : 1;
        const canvas = document.createElement("canvas");
        canvas.className = "reader-canvas";
        body.replaceChildren(canvas);

        async function drawSinglePage() {
          const p = await pdf.getPage(page);
          const baseViewport = p.getViewport({ scale: 1 });
          const availableWidth = Math.max(240, body.clientWidth - 40);
          const availableHeight = Math.max(240, body.clientHeight - 40);
          const scale = Math.max(0.5, Math.min(2.2, availableWidth / baseViewport.width, availableHeight / baseViewport.height));
          const viewport = p.getViewport({ scale });
          const dpr = window.devicePixelRatio || 1;
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          const ctx = canvas.getContext("2d", { alpha: false });
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await p.render({ canvasContext: ctx, viewport }).promise;
          controls.innerHTML = `
            <button data-prev ${page <= 1 ? "disabled" : ""}>‹</button>
            <span class="reader-page">${page} / ${pdf.numPages}</span>
            <button data-next ${page >= pdf.numPages ? "disabled" : ""}>›</button>
          `;
          $("[data-prev]", controls)?.addEventListener("click", async () => { if(page > 1){page--; await drawSinglePage();} });
          $("[data-next]", controls)?.addEventListener("click", async () => { if(page < pdf.numPages){page++; await drawSinglePage();} });
        }
        await drawSinglePage();
      } else if (currentReadingMode === 'double-page') {
        let spread = 0;
        const spreadContainer = document.createElement("div");
        spreadContainer.className = "reader-double-page";
        body.replaceChildren(spreadContainer);

        async function drawSpread() {
          const pagesToRender = getReaderSpreadPages(pdf.numPages, spread, skipCover);
          const page2Number = pagesToRender[pagesToRender.length - 1];

          spreadContainer.innerHTML = "";
          const pages = [];

          for (const pageNumber of pagesToRender) {
            const page = await pdf.getPage(pageNumber);
            const baseViewport = page.getViewport({ scale: 1 });
            const availableWidth = Math.max(240, (body.clientWidth - 70) / pagesToRender.length);
            const availableHeight = Math.max(240, body.clientHeight - 40);
            const scale = Math.max(0.5, Math.min(1.5, availableWidth / baseViewport.width, availableHeight / baseViewport.height));
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            canvas.className = "reader-canvas";
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * dpr);
            canvas.height = Math.floor(viewport.height * dpr);
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;
            const ctx = canvas.getContext("2d", { alpha: false });
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            await page.render({ canvasContext: ctx, viewport }).promise;

            const wrapper = document.createElement("div");
            wrapper.className = "double-page";
            wrapper.appendChild(canvas);
            spreadContainer.appendChild(wrapper);
            pages.push(pageNumber);
          }

          const displayedPages = [...pages].sort((a, b) => a - b);

          controls.innerHTML = `
            <button data-prev ${spread === 0 ? "disabled" : ""}>‹</button>
            <span class="reader-page">
              ${displayedPages[0]}${displayedPages[1] ? `–${displayedPages[1]}` : ""} / ${pdf.numPages}
            </span>
            <button data-next ${page2Number >= pdf.numPages ? "disabled" : ""}>›</button>
          `;

          $("[data-prev]", controls)?.addEventListener("click", async () => {
            if (spread > 0) {
              spread--;
              await drawSpread();
            }
          });

          $("[data-next]", controls)?.addEventListener("click", async () => {
            if (page2Number < pdf.numPages) {
              spread++;
              await drawSpread();
            }
          });
        }

        await drawSpread();
      } else if (currentReadingMode === 'continuous-scroll') {
        const pageContainer = document.createElement("div");
        pageContainer.className = "pdf-continuous-scroll-container";
        body.replaceChildren(pageContainer);

        const pageElements = [];
        const renderedPages = new Set();
        const observer = new IntersectionObserver(async (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const pageNum = parseInt(entry.target.dataset.pageNum);
              if (!renderedPages.has(pageNum)) {
                renderedPages.add(pageNum);
                const canvas = entry.target.querySelector('canvas');
                const p = await pdf.getPage(pageNum);
                // Smaller scale for continuous scroll to fit more pages
                const baseViewport = p.getViewport({ scale: 1 });
                const scale = Math.max(0.5, Math.min(1.5, (pageContainer.clientWidth - 40) / baseViewport.width));
                const viewport = p.getViewport({ scale });
                const dpr = window.devicePixelRatio || 1;
                canvas.width = Math.floor(viewport.width * dpr);
                canvas.height = Math.floor(viewport.height * dpr);
                canvas.style.width = `${viewport.width}px`;
                canvas.style.height = `${viewport.height}px`;
                const ctx = canvas.getContext("2d", { alpha: false });
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                await p.render({ canvasContext: ctx, viewport }).promise;
              }
            }
          }
        }, { root: pageContainer, rootMargin: '200px' }); // Render pages when they are 200px near the viewport

        for (const i of getReaderPages(pdf.numPages, skipCover)) {
          const pageWrapper = document.createElement("div");
          pageWrapper.className = "pdf-page-wrapper";
          pageWrapper.dataset.pageNum = i;
          const canvas = document.createElement("canvas");
          canvas.className = "reader-canvas";
          pageWrapper.appendChild(canvas);
          pageContainer.appendChild(pageWrapper);
          pageElements.push(pageWrapper);
          observer.observe(pageWrapper);
        }

        let currentPageIndex = 0; // 0-indexed
        const updateControls = () => {
          const visiblePage = pageElements.find(el => {
            const rect = el.getBoundingClientRect();
            return rect.top >= 0 && rect.top < window.innerHeight / 2; // Check if top half of page is visible
          }) || pageElements[0]; // Default to first page if none are clearly visible

          currentPageIndex = pageElements.indexOf(visiblePage);

          controls.innerHTML = `
            <button data-prev ${currentPageIndex <= 0 ? "disabled" : ""}>↑</button>
            <span class="reader-page">${pageElements[currentPageIndex].dataset.pageNum} / ${pdf.numPages}</span>
            <button data-next ${currentPageIndex >= pageElements.length - 1 ? "disabled" : ""}>↓</button>
          `;
          $("[data-prev]", controls)?.addEventListener("click", () => {
            if (currentPageIndex > 0) {
              currentPageIndex--;
              pageElements[currentPageIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
          $("[data-next]", controls)?.addEventListener("click", () => {
            if (currentPageIndex < pageElements.length - 1) {
              currentPageIndex++;
              pageElements[currentPageIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        };

        pageContainer.addEventListener('scroll', updateControls);
        updateControls(); // Call once to set initial state

        // Clean up observer and event listener when overlay is removed
        if (overlay) {
          $("[data-close-reader]", overlay).addEventListener('click', () => {
            observer.disconnect();
            pageContainer.removeEventListener('scroll', updateControls);
          }, { once: true });
        }
      }

      const modeSelect = $("#reading-mode-select", overlay);
      if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
          setReadingMode(e.target.value);
          // Re-open the reader with the new mode
          overlay.remove(); // Close current reader
          openReader(item, { skipCover }); // Open again with new mode, using the passed item
        });
      }
    } catch (err) {
      console.error(err);
      let title = "Não foi possível renderizar este PDF.";
      let message = "Ocorreu um erro inesperado. Verifique o console do navegador para mais detalhes.";

      if (err.name === 'PDFJS_MISSING') {
        title = "PDF.js nÃ£o carregado.";
        message = "A biblioteca necessÃ¡ria para renderizar o PDF nÃ£o estÃ¡ disponÃ­vel nesta pÃ¡gina.";
      } else if (err.name === 'MissingPDFException') {
        title = "Arquivo PDF não encontrado.";
        message = `O navegador não conseguiu carregar o arquivo a partir do link fornecido. Verifique se o caminho no cadastro está correto.`;
      } else if (err.name === 'InvalidPDFException') {
        title = "Arquivo PDF inválido.";
        message = "O arquivo parece estar corrompido ou em um formato que não pode ser lido pelo leitor. Tente abrir o arquivo diretamente.";
      } else if (String(err.message).toLowerCase().includes("cors") || String(err.message).toLowerCase().includes("failed to fetch")) {
        title = "Erro de CORS";
        message = "O servidor que hospeda o PDF não permite que este site o acesse diretamente. Use o botão abaixo para abrir em uma nova aba.";
      }

      body.innerHTML = `
        <div class="empty" style="margin:auto;max-width:650px">
          <h3>${escapeHTML(title)}</h3>
          <p>${escapeHTML(message)}</p>
          <button class="btn btn-primary" data-open-anyway>Abrir PDF</button>
        </div>`;
      controls.innerHTML = `<span class="reader-page">PDF</span>`;
      $("[data-open-anyway]", body).onclick = () => {
        window.open(url, "_blank", "noopener");
      };
    }
  }

  async function renderCBZReader(item, url, body, controls, overlay, skipCover = false) {
    body.innerHTML = `<div class="empty" style="margin:auto">Baixando páginas do CBZ…</div>`;
    try {
      if (!window.JSZip) throw new Error("JSZip não carregou.");
      const response = await fetch(url);
      if (!response.ok) throw new Error("HTTP " + response.status);
      const buffer = await response.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);
      const names = Object.keys(zip.files)
        .filter(n => !zip.files[n].dir && /\.(jpg|jpeg|png|webp|gif)$/i.test(n))
        .sort((a,b) => a.localeCompare(b, undefined, {numeric:true}));
      if (!names.length) throw new Error("CBZ sem imagens.");

      const currentReadingMode = state.readingMode;

      if (currentReadingMode === 'single-page') {
        let page = skipCover && names.length > 1 ? 1 : 0;
        const img = document.createElement("img");
        img.className = "reader-image";
        body.replaceChildren(img);

        async function draw() {
          const blob = await zip.files[names[page]].async("blob");
          if (img.dataset.url) URL.revokeObjectURL(img.dataset.url);
          const objectUrl = URL.createObjectURL(blob);
          img.dataset.url = objectUrl;
          img.src = objectUrl;
          controls.innerHTML = `
            <button data-prev ${page === 0 ? "disabled" : ""}>‹</button>
            <span class="reader-page">${page + 1} / ${names.length}</span>
            <button data-next ${page === names.length - 1 ? "disabled" : ""}>›</button>
          `;
          $("[data-prev]", controls)?.addEventListener("click", async () => { if(page>0){page--;await draw();} });
          $("[data-next]", controls)?.addEventListener("click", async () => { if(page<names.length-1){page++;await draw();} });
        }
        await draw();
        $("[data-close-reader]", overlay).addEventListener('click', () => {
          if (img.dataset.url) URL.revokeObjectURL(img.dataset.url);
        }, { once: true });
      } else if (currentReadingMode === 'double-page') {

        let spread = 0;
        const spreadContainer = document.createElement("div");
        spreadContainer.className = "reader-double-page";
        body.replaceChildren(spreadContainer);
        const spreadUrls = [];

        async function drawSpread() {
          // Libera URLs anteriores
          for (const u of spreadUrls) {
            URL.revokeObjectURL(u);
          }
          spreadUrls.length = 0;
          spreadContainer.innerHTML = "";

          const indexesToRender = getReaderSpreadIndexes(names.length, spread, skipCover);
          const second = indexesToRender[indexesToRender.length - 1];

          for (const index of indexesToRender) {
            const blob = await zip.files[names[index]].async("blob");
            const objectUrl = URL.createObjectURL(blob);
            spreadUrls.push(objectUrl);

            const wrapper = document.createElement("div");
            wrapper.className = "double-page";

            const img = document.createElement("img");
            img.className = "reader-image";
            img.src = objectUrl;
            img.alt = `Página ${index + 1}`;

            wrapper.appendChild(img);
            spreadContainer.appendChild(wrapper);
          }

          const displayedPages = indexesToRender.map(p => p + 1).sort((a, b) => a - b);

          controls.innerHTML = `
            <button data-prev ${spread === 0 ? "disabled" : ""}>‹</button>
            <span class="reader-page">
              ${displayedPages[0]}${displayedPages[1] ? `–${displayedPages[1]}` : ""} / ${names.length}
            </span>
            <button data-next ${second >= names.length - 1 ? "disabled" : ""}>›</button>
          `;

          $("[data-prev]", controls)?.addEventListener("click", async () => {
            if (spread > 0) { spread--; await drawSpread(); }
          });

          $("[data-next]", controls)?.addEventListener("click", async () => {
            if (second < names.length - 1) { spread++; await drawSpread(); }
          });
        }

        await drawSpread();

        $("[data-close-reader]", overlay).addEventListener("click", () => {
          for (const u of spreadUrls) {
            URL.revokeObjectURL(u);
          }
        }, { once: true });
      } else if (currentReadingMode === 'continuous-scroll') {
        const pageContainer = document.createElement("div");
        pageContainer.className = "image-continuous-scroll-container"; // Note: class name was correct
        body.replaceChildren(pageContainer);
 
        const objectUrls = [];
        const pageElements = [];
 
        // Eagerly load all pages to prevent layout shift and simplify logic
        body.innerHTML = `<div class="empty" style="margin:auto">Extraindo todas as páginas...</div>`;
        const pageData = await Promise.all(names.map(async (name) => {
          const blob = await zip.files[name].async("blob");
          const url = URL.createObjectURL(blob);
          objectUrls.push(url);
          return { src: url };
        }));
 
        body.replaceChildren(pageContainer); // Clear status message
 
        pageData.forEach((data, index) => {
          if (skipCover && index === 0) return;
          const pageNum = index + 1;
          const pageWrapper = document.createElement("div");
          pageWrapper.className = "image-page-wrapper";
          pageWrapper.dataset.pageNum = pageNum;
          const img = document.createElement("img");
          img.className = "reader-image";
          img.alt = `Página ${pageNum}`;
          img.src = data.src;
          pageWrapper.appendChild(img);
          pageContainer.appendChild(pageWrapper);
          pageElements.push(pageWrapper);
        });
 
        let currentPageIndex = 0;
        const updateControls = () => {
          const visiblePage = pageElements.find(el => {
            const rect = el.getBoundingClientRect();
            return rect.top >= 0 && rect.top < window.innerHeight / 2;
          }) || pageElements.find(el => {
            const rect = el.getBoundingClientRect();
            // Check if any part of the element is visible in the viewport
            return rect.bottom > 0 && rect.top < window.innerHeight;
          }) || pageElements[0];
 
          if (!visiblePage) {
            // If no page is visible (e.g., during initial load or very fast scroll), default to the first page
            currentPageIndex = 0;
            return;
          }
 
          currentPageIndex = pageElements.indexOf(visiblePage);
          controls.innerHTML = `
            <button data-prev ${currentPageIndex <= 0 ? "disabled" : ""}>↑</button>
            <span class="reader-page">${visiblePage.dataset.pageNum} / ${names.length}</span>
            <button data-next ${currentPageIndex >= pageElements.length - 1 ? "disabled" : ""}>↓</button>
          `;
          $("[data-prev]", controls)?.addEventListener("click", () => pageElements[Math.max(0, currentPageIndex - 1)].scrollIntoView({ behavior: 'smooth', block: 'start' }));
          $("[data-next]", controls)?.addEventListener("click", () => pageElements[Math.min(pageElements.length - 1, currentPageIndex + 1)].scrollIntoView({ behavior: 'smooth', block: 'start' }));
        };

        pageContainer.addEventListener('scroll', updateControls, { passive: true });
        updateControls();

        $("[data-close-reader]", overlay).addEventListener('click', () => {
          pageContainer.removeEventListener('scroll', updateControls);
          for (const url of objectUrls) URL.revokeObjectURL(url);
        }, { once: true });
      }

      const modeSelect = $("#reading-mode-select", overlay);
      if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
          setReadingMode(e.target.value);
          overlay.remove();
          openReader(item, { skipCover });
        });
      }
    } catch (err) {
      // Local status helper for this function
      const status = (message) => body.innerHTML = `<div class="empty" style="margin:auto">${escapeHTML(message)}</div>`;


      console.error(err);
      body.innerHTML = `
        <div class="empty" style="margin:auto;max-width:650px">
          <h3>Não foi possível abrir o CBZ.</h3>
          <p>O servidor precisa permitir downloads CORS. Você também pode abrir o arquivo diretamente.</p>
          <button class="btn btn-primary" data-open-anyway>Abrir arquivo</button>
        </div>`;
      controls.innerHTML = `<span class="reader-page">CBZ</span>`;
      $("[data-open-anyway]", body).onclick = () => {
        window.open(url, "_blank", "noopener");
      };
    }
  }

  // ... (renderCBZReader and renderCBRReader remain the same)



  // Local status helper for CBR
  const cbrStatus = (body, message) => {
    body.innerHTML = `<div class="empty" style="margin:auto;max-width:650px">${escapeHTML(message)}</div>`;
    console.log("[CBR]", message);
  };
  async function renderCBRReader(item, url, body, controls, overlay, skipCover = false) {
    let objectUrl = null;
    let archive = null;
    let objectUrls = null; // For continuous scroll

    function status(message) {
      body.innerHTML = `
      <div class="empty" style="margin:auto;max-width:650px">
        ${escapeHTML(message)}
      </div>
    `;
    }

    function fail(title, message) {
      console.error("[CBR]", title, message);

      body.innerHTML = `
      <div class="empty" style="margin:auto;max-width:650px">
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(message)}</p>

        <button class="btn btn-primary" data-open-anyway>
          Abrir arquivo
        </button>
      </div>
    `;

      controls.innerHTML = `<span class="reader-page">CBR</span>`;

      $("[data-open-anyway]", body).onclick = () => {
        window.open(url, "_blank", "noopener");
      };
    }

    function timeoutPromise(ms, message) {
      return new Promise((_, reject) => {
        setTimeout(() => {
          const error = new Error(message);
          error.name = "TimeoutError";
          reject(error);
        }, ms);
      });
    }

    async function withTimeout(promise, ms, message) {
      return Promise.race([
        promise,
        timeoutPromise(ms, message)
      ]);
    }

    try {

      // =========================================================
      // 1. BAIXAR CBR
      // =========================================================

      status("Baixando CBR…");

      console.log("[CBR] URL:", url);

      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        cache: "no-store"
      });

      console.log("[CBR] HTTP:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // =========================================================
      // 2. LER ARQUIVO
      // =========================================================

      status("Lendo arquivo CBR…");

      const buffer = await response.arrayBuffer();

      console.log(
        "[CBR] Tamanho:",
        buffer.byteLength,
        "bytes"
      );

      if (buffer.byteLength < 8) {
        throw new Error("CBR_EMPTY");
      }

      const bytes = new Uint8Array(buffer);

      const isRAR5 =
        bytes[0] === 0x52 &&
        bytes[1] === 0x61 &&
        bytes[2] === 0x72 &&
        bytes[3] === 0x21 &&
        bytes[4] === 0x1A &&
        bytes[5] === 0x07 &&
        bytes[6] === 0x01 &&
        bytes[7] === 0x00;

      const isRAR4 =
        bytes[0] === 0x52 &&
        bytes[1] === 0x61 &&
        bytes[2] === 0x72 &&
        bytes[3] === 0x21 &&
        bytes[4] === 0x1A &&
        bytes[5] === 0x07 &&
        bytes[6] === 0x00;

      const rarVersion =
        isRAR5 ? "RAR5" :
        isRAR4 ? "RAR4" :
        "UNKNOWN";

      console.log(
        "[CBR] Formato detectado:",
        rarVersion
      );

      if (rarVersion === "RAR5") {
        status("RAR5 detectado. Preparando leitor…");
      } else if (rarVersion === "RAR4") {
        status("RAR4 detectado. Preparando leitor…");
      } else {
        throw new Error( // Use the fail function here
          "O arquivo não possui uma assinatura RAR válida."
        );
      }

      // =========================================================
      // 3. VERIFICAR LIBARCHIVE
      // =========================================================

      status("Verificando biblioteca CBR…");

      const LIBARCHIVE_MAIN =
        new URL(
          "/libarchive/libarchive.js",
          window.location.origin
        ).href;

      const LIBARCHIVE_WORKER =
        new URL(
          "/libarchive/worker-bundle.js",
          window.location.origin
        ).href;

      const LIBARCHIVE_WASM =
        new URL(
          "/libarchive/libarchive.wasm",
          window.location.origin
        ).href;

      console.log("[CBR] MAIN:", LIBARCHIVE_MAIN);
      console.log("[CBR] WORKER:", LIBARCHIVE_WORKER);
      console.log("[CBR] WASM:", LIBARCHIVE_WASM);

      const mainResponse = await fetch(LIBARCHIVE_MAIN, { cache: "no-store" });
      console.log("[CBR] MAIN HTTP:", mainResponse.status, mainResponse.headers.get("content-type"));
      if (!mainResponse.ok) {
        throw new Error(`LIBARCHIVE_MAIN_MISSING: HTTP ${mainResponse.status}`);
      }

      const workerResponse = await fetch(LIBARCHIVE_WORKER, { cache: "no-store" });
      console.log("[CBR] WORKER HTTP:", workerResponse.status, workerResponse.headers.get("content-type"));
      if (!workerResponse.ok) {
        throw new Error(`LIBARCHIVE_WORKER_MISSING: HTTP ${workerResponse.status}`);
      }

      const wasmResponse = await fetch(LIBARCHIVE_WASM, { method: "GET", cache: "no-store" });
      console.log("[CBR] WASM HTTP:", wasmResponse.status, wasmResponse.headers.get("content-type"));
      if (!wasmResponse.ok) {
        throw new Error(
          `LIBARCHIVE_WASM_MISSING: HTTP ${wasmResponse.status}`
        );
      }

      // =========================================================
      // 4. IMPORTAR LIBARCHIVE
      // =========================================================

      status("Carregando biblioteca CBR…");

      const module = await import(
        LIBARCHIVE_MAIN
      );

      console.log(
        "[CBR] módulo carregado:",
        module
      );

      const Archive = module.Archive;

      console.log("[CBR] Archive:", Archive);
      console.log("[CBR] Archive.init:", Archive?.init);
      console.log("[CBR] Archive.open:", Archive?.open);

      if (
        !Archive ||
        typeof Archive.open !== "function" ||
        typeof Archive.init !== "function"
      ) {
        throw new Error(
          "LIBARCHIVE_API_INVALID"
        );
      }

      // =========================================================
      // 5. INICIALIZAR WORKER
      // =========================================================

      status("Inicializando leitor CBR…");

      const workerUrl = new URL("/libarchive/worker-bundle.js", window.location.href).href;
      Archive.init({
        workerUrl
      });

      console.log(
        "[CBR] Worker configurado:",
        LIBARCHIVE_WORKER
      );

      // =========================================================
      // 6. CRIAR FILE
      // =========================================================

      status("Preparando arquivo RAR…");

      const file = new File(
        [buffer],
        "comic.cbr",
        {
          type: "application/vnd.rar"
        }
      );

      console.log(
        "[CBR] File criado:",
        file.size
      );

      // =========================================================
      // 7. ABRIR RAR
      // =========================================================

      status(
        rarVersion === "RAR5"
          ? "Abrindo RAR5…"
          : "Abrindo RAR…"
      );

      console.log(
        "[CBR] Chamando Archive.open()..."
      );

      archive = await withTimeout(
        Archive.open(file),
        120000,
        "O libarchive demorou mais de 120 segundos para abrir o RAR."
      );

      console.log(
        "[CBR] Arquivo aberto:",
        archive
      );

      // =========================================================
      // 8. LISTAR ARQUIVOS
      // =========================================================

      status("Localizando páginas…");

      const files = await withTimeout(
        archive.getFilesObject(),
        120000,
        "O RAR abriu, mas demorou mais de 120 segundos para listar os arquivos."
      );

      console.log(
        "[CBR] Arquivos encontrados:",
        files
      );

      // =========================================================
      // 9. ENCONTRAR IMAGENS
      // =========================================================
      
      
      function findArchiveImages(obj, path = "") {
        const images = [];
      
      
        if (!obj || typeof obj !== "object") {
          return images;
        }
      
      
        for (const [key, value] of Object.entries(obj)) {
      
      
          const currentPath = path
            ? `${path}/${key}`
            : key;
      
      
          // Arquivo do libarchive.js
          if (
            value &&
            typeof value === "object" &&
            typeof value.extract === "function"
          ) {
      
      
            const fileName =
              value.name ||
              key;
      
      
            if (
              /\.(jpg|jpeg|png|webp|gif)$/i.test(
                fileName
              )
            ) {
      
      
              images.push({
                name: fileName,
                path: currentPath,
                file: value
              });
      
      
            }
      
      
            continue;
          }
      
      
          // Pasta / diretório
          if (
            value &&
            typeof value === "object"
          ) {
      
      
            images.push(
              ...findArchiveImages(
                value,
                currentPath
              )
            );
      
      
          }
        }
      
      
        return images;
      }
      
      
      const imageEntries =
        findArchiveImages(files);
      
      
      console.log(
        "[CBR] Imagens encontradas:",
        imageEntries.length
      );
      
      
      console.log(
        "[CBR] Lista de imagens:",
        imageEntries.map(
          entry => entry.path
        )
      );
      
      
      if (!imageEntries.length) {
        throw new Error(
          "CBR_NO_IMAGES"
        );
      }
      
      
      // O restante do leitor trabalha diretamente
      // com os objetos do libarchive.js.
      const imageFiles =
        imageEntries.map(
          entry => entry.file
        );
      
      
      console.log(
        "[CBR] Páginas detectadas:",
        imageFiles.map(
          file => file.name
        )
      );

      const currentReadingMode = state.readingMode;

      if (currentReadingMode === 'single-page') {
        let page = skipCover && imageFiles.length > 1 ? 1 : 0;
        const img = document.createElement("img");
        img.className = "reader-image";
        img.alt = "Página do quadrinho";
        img.decoding = "async";
        body.replaceChildren(img);

        async function draw() {
          controls.innerHTML = `<span class="reader-page">Extraindo página ${page + 1}…</span>`;
          const current = imageFiles[page];
          const extracted = await withTimeout(current.extract(), 120000, "A página demorou mais de 120 segundos para ser extraída.");
          const blob = extracted instanceof Blob ? extracted : new Blob([extracted], { type: "image/jpeg" });
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          objectUrl = URL.createObjectURL(blob);
          img.src = objectUrl;
          controls.innerHTML = `
            <button data-prev ${page === 0 ? "disabled" : ""}>‹</button>
            <span class="reader-page">${page + 1} / ${imageFiles.length}</span>
            <button data-next ${page === imageFiles.length - 1 ? "disabled" : ""}>›</button>
          `;
          $("[data-prev]", controls)?.addEventListener("click", async () => { if (page > 0) { page--; await draw().catch(e => { page++; console.error(e); }); } });
          $("[data-next]", controls)?.addEventListener("click", async () => { if (page < imageFiles.length - 1) { page++; await draw().catch(e => { page--; console.error(e); }); } });
        }
        await draw();
        $("[data-close-reader]", overlay).addEventListener('click', () => {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        }, { once: true });
      } else if (currentReadingMode === 'double-page') {
        let spread = 0;
        const spreadContainer = document.createElement("div");
        spreadContainer.className = "reader-double-page";
        body.replaceChildren(spreadContainer);
        const spreadUrls = [];

        async function drawSpread() {
          // Libera URLs anteriores
          for (const u of spreadUrls) {
            URL.revokeObjectURL(u);
          }
          spreadUrls.length = 0;
          spreadContainer.innerHTML = "";

          const indexesToRender = getReaderSpreadIndexes(imageFiles.length, spread, skipCover);
          const second = indexesToRender[indexesToRender.length - 1];

          for (const index of indexesToRender) {
            const extracted = await withTimeout(
              imageFiles[index].extract(),
              120000,
              "A página demorou mais de 120 segundos para ser extraída."
            );

            const blob = extracted instanceof Blob ? extracted : new Blob([extracted], { type: "image/jpeg" });
            const objectUrl = URL.createObjectURL(blob);
            spreadUrls.push(objectUrl);

            const wrapper = document.createElement("div");
            wrapper.className = "double-page";

            const img = document.createElement("img");
            img.className = "reader-image";
            img.alt = `Página ${index + 1}`;
            img.src = objectUrl;

            wrapper.appendChild(img);
            spreadContainer.appendChild(wrapper);
          }

          const displayedPages = indexesToRender.map(p => p + 1).sort((a, b) => a - b);

          controls.innerHTML = `
            <button data-prev ${spread === 0 ? "disabled" : ""}>‹</button>
            <span class="reader-page">
              ${displayedPages[0]}${displayedPages[1] ? `–${displayedPages[1]}` : ""} / ${imageFiles.length}
            </span>
            <button data-next ${second >= imageFiles.length - 1 ? "disabled" : ""}>›</button>
          `;

          $("[data-prev]", controls)?.addEventListener("click", async () => {
            if (spread > 0) { spread--; await drawSpread(); }
          });

          $("[data-next]", controls)?.addEventListener("click", async () => {
            if (second < imageFiles.length - 1) { spread++; await drawSpread(); }
          });
        }

        await drawSpread();

        $("[data-close-reader]", overlay).addEventListener("click", () => {
          for (const u of spreadUrls) {
            URL.revokeObjectURL(u);
          }
        }, { once: true });
      } else if (currentReadingMode === 'continuous-scroll') {
        const pageContainer = document.createElement("div");
        pageContainer.className = "image-continuous-scroll-container";
        body.replaceChildren(pageContainer);

        objectUrls = []; // Use a simple array for cleanup
        const pageElements = [];

        status("Extraindo todas as páginas do CBR...");
        const pageData = await Promise.all(imageFiles.map(async (file) => {
          const extracted = await withTimeout(file.extract(), 120000, "A extração de uma página demorou demais.");
          const blob = extracted instanceof Blob ? extracted : new Blob([extracted], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          objectUrls.push(url);
          return { src: url };
        }));

        body.replaceChildren(pageContainer); // Clear status message

        pageData.forEach((data, index) => {
          if (skipCover && index === 0) return;
          const pageNum = index + 1;
          const pageWrapper = document.createElement("div");
          pageWrapper.className = "image-page-wrapper";
          pageWrapper.dataset.pageNum = pageNum;
          const img = document.createElement("img");
          img.className = "reader-image";
          img.alt = `Página ${pageNum}`;
          img.src = data.src;
          pageWrapper.appendChild(img);
          pageContainer.appendChild(pageWrapper);
          pageElements.push(pageWrapper);
        });

        let currentPageIndex = 0;
        const updateControls = () => {
          const visiblePage = pageElements.find(el => {
            const rect = el.getBoundingClientRect();
            return rect.top >= 0 && rect.top < window.innerHeight / 2;
          }) || pageElements.find(el => {
            const rect = el.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < window.innerHeight;
          }) || pageElements[0];

          if (!visiblePage) {
            currentPageIndex = 0;
            return;
          }

          currentPageIndex = pageElements.indexOf(visiblePage);
          controls.innerHTML = `
            <button data-prev ${currentPageIndex <= 0 ? "disabled" : ""}>↑</button>
            <span class="reader-page">${visiblePage.dataset.pageNum} / ${imageFiles.length}</span>
            <button data-next ${currentPageIndex >= imageFiles.length - 1 ? "disabled" : ""}>↓</button>
          `;
          const prevBtn = $("[data-prev]", controls);
          const nextBtn = $("[data-next]", controls);
          prevBtn?.addEventListener("click", () => pageElements[Math.max(0, currentPageIndex - 1)].scrollIntoView({ behavior: 'smooth', block: 'start' }));
          nextBtn?.addEventListener("click", () => pageElements[Math.min(pageElements.length - 1, currentPageIndex + 1)].scrollIntoView({ behavior: 'smooth', block: 'start' }));
        };

        pageContainer.addEventListener('scroll', updateControls, { passive: true });
        updateControls();

        $("[data-close-reader]", overlay).addEventListener('click', () => {
          pageContainer.removeEventListener('scroll', updateControls);
          if (objectUrls) for (const url of objectUrls) URL.revokeObjectURL(url);
        }, { once: true });
      }

      const modeSelect = $("#reading-mode-select", overlay);
      if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
          setReadingMode(e.target.value);
          overlay.remove();
          openReader(item, { skipCover });
        });
      }

      console.log(
        "[CBR] ================================="
      );

      console.log(
        "[CBR] LEITOR PRONTO"
      );

      console.log(
        "[CBR] Páginas:",
        imageFiles.length
      );

      console.log(
        "[CBR] ================================="
      );

    } catch (err) {

      console.error(
        "[CBR] ERRO NO LEITOR:",
        err
      );

      const errorText =
        String(
          err?.message || err
        );

      if (
        errorText.includes(
          "LIBARCHIVE_WASM_MISSING"
        )
      ) {

        fail(
          "Biblioteca CBR incompleta.",
          "O arquivo libarchive.wasm não foi encontrado em /libarchive/. Coloque o WASM junto de libarchive.js e worker-bundle.js."
        );

      } else if (
        errorText.includes("LIBARCHIVE_WORKER_MISSING")
      ) {

        fail(
          "Worker do CBR não encontrado.",
          "O arquivo worker-bundle.js não foi encontrado em /libarchive/."
        );

      } else if (
        errorText.includes("LIBARCHIVE_MAIN_MISSING")
      ) {

        fail(
          "Biblioteca CBR não encontrada.",
          "O arquivo libarchive.js não foi encontrado em /libarchive/."
        );

      } else if (
        errorText.includes(
          "LIBARCHIVE_API_INVALID"
        )
      ) {

        fail(
          "Biblioteca CBR incompatível.",
          "O libarchive.js foi carregado, mas sua API Archive não está disponível."
        );

      } else if (
        errorText.includes(
          "CBR_NO_IMAGES"
        )
      ) {

        fail(
          "Nenhuma página encontrada.",
          "O RAR foi aberto, mas nenhuma imagem JPG, PNG, WEBP ou GIF foi encontrada."
        );

      } else if (
        errorText.includes(
          "CBR_EMPTY"
        )
      ) {

        fail(
          "CBR vazio ou inválido.",
          "O arquivo baixado não contém dados suficientes."
        );

      } else if (
        errorText.includes(
          "Failed to fetch"
        )
      ) {

        fail(
          "Não foi possível acessar o arquivo.",
          "O servidor pode estar bloqueando o download por CORS."
        );

      } else if (
        errorText.includes(
          "TimeoutError"
        )
      ) {

        fail(
          "O leitor demorou demais.",
          errorText
        );

      } else if (
        /^HTTP \d+/.test(errorText)
      ) {

        fail(
          "Erro ao baixar o CBR.",
          errorText
        );

      } else {

        fail(
          "Não foi possível abrir o CBR.",
          errorText
        );
      }

    }
  }

  function coverFor(item) {
    // In production, /api/works/:id/cover should render the first page/image
    // from the Telegram-hosted file. No separate cover upload is necessary.
    if (!item) return "https://placehold.co/600x900/202025/fff?text=HQ";
    if (item.coverUrl) return item.coverUrl;
    if (item.cover) return item.cover; // backward compatibility
    return "https://placehold.co/600x900/202025/fff?text=" + encodeURIComponent(item.title || "HQ");
  }

  function coverCacheKey(item) {
    return `banca-cover:${item.id}:${item.fileUrl || item.telegramUrl || ""}`;
  }

  function directFileUrl(item) {
    const url = item?.fileUrl || "";
    return /^https?:\/\//i.test(url) || url ? url : "";
  }

  async function imageBlobToDataUrl(blob, maxWidth = 360) {
    if (!(blob instanceof Blob)) blob = new Blob([blob]);
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", 0.72);
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      if (!(blob instanceof Blob)) blob = new Blob([blob]);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function pdfCover(url, signal) {
    const response = await fetch(url, { mode: "cors", credentials: "omit", cache: "no-store", signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(await response.arrayBuffer()) }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: Math.min(1, 360 / page.getViewport({ scale: 1 }).width) });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    return canvas.toDataURL("image/jpeg", 0.72);
  }

  async function cbzCover(url, signal) {
    const response = await fetch(url, { mode: "cors", credentials: "omit", cache: "no-store", signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const zip = await JSZip.loadAsync(await response.arrayBuffer());
    const name = Object.keys(zip.files)
      .filter(n => !zip.files[n].dir && /\.(jpg|jpeg|png|webp|gif)$/i.test(n))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))[0];
    if (!name) throw new Error("CBZ sem imagens");
    return imageBlobToDataUrl(await zip.files[name].async("blob"));
  }

  async function cbrCover(url, signal) {
    const response = await fetch(url, { mode: "cors", credentials: "omit", cache: "no-store", signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const module = await import(new URL("/libarchive/libarchive.js", window.location.origin).href);
    const Archive = module.Archive;
    Archive.init({ workerUrl: new URL("/libarchive/worker-bundle.js", window.location.origin).href });
    const archive = await Archive.open(new File([await response.arrayBuffer()], "cover.cbr"));
    const files = await archive.getFilesObject();
    const images = [];
    const findImages = obj => {
      if (!obj || typeof obj !== "object") return;
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value.extract === "function") {
          const name = value.name || key;
          if (/\.(jpg|jpeg|png|webp|gif)$/i.test(name)) images.push(value);
        } else findImages(value);
      }
    };
    findImages(files);
    if (!images.length) throw new Error("CBR sem imagens");
    return imageBlobToDataUrl(await images[0].extract());
  }

  async function autoCover(item, signal) {
    if (!item || item.coverUrl || item.cover) return null;
    const url = directFileUrl(item);
    if (!url) return null;
    if (coverMemoryCache.has(item.id)) return coverMemoryCache.get(item.id);
    if (coverLoading.has(item.id)) return coverLoading.get(item.id);
    const cached = localStorage.getItem(coverCacheKey(item));
    if (cached && cached.length <= 220000) {
      coverMemoryCache.set(item.id, cached);
      return cached;
    }
    if (cached) localStorage.removeItem(coverCacheKey(item));
    const format = (item.format || extension(url)).toLowerCase();
    let cover;
    if (format === "pdf" || /\.pdf(?:[?#]|$)/i.test(url)) cover = await pdfCover(url, signal);
    else if (format === "cbz" || /\.cbz(?:[?#]|$)/i.test(url)) cover = await cbzCover(url, signal);
    else if (format === "cbr" || /\.cbr(?:[?#]|$)/i.test(url)) cover = await cbrCover(url, signal);
    else if (/^(jpg|jpeg|png|webp|gif)$/i.test(format)) cover = url;
    if (cover) {
      coverMemoryCache.set(item.id, cover);
      try { localStorage.setItem(coverCacheKey(item), cover); } catch {}
      return cover;
    }
    return null;
  }

  function hydrateHomeCovers() {
    const elements = $$('[data-cover-id]');
    if (!elements.length) return;
    const load = element => {
      const item = state.db.library.find(x => x.id === element.dataset.coverId);
      if (!item || element.dataset.coverReady === "true") return;
      element.dataset.coverReady = "true";
      const controller = new AbortController();
      coverAbortControllers.set(item.id, controller);
      const job = autoCover(item, controller.signal);
      coverLoading.set(item.id, job);
      job.then(cover => {
        if (!cover) return;
        $$('[data-cover-id]').filter(el => el.dataset.coverId === item.id).forEach(el => { el.style.backgroundImage = `url("${cover}")`; });
      }).catch(error => { element.dataset.coverReady = ""; console.warn("Não foi possível gerar a capa de", item.title, error); })
        .finally(() => coverLoading.delete(item.id));
    };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { load(entry.target); observer.unobserve(entry.target); } }), { rootMargin: "500px" }) : null;
    elements.forEach(element => {
      if (element.classList.contains("hero-bg")) load(element);
      else if (observer) observer.observe(element);
      else load(element);
    });
  }

  function card(item) {
    return `
      <article class="card" data-open="${escapeHTML(item.id)}">
        <div class="cover" data-cover-id="${escapeHTML(item.id)}" style="background-image:url('${escapeHTML(coverFor(item))}')">
          <span class="cover-number">${escapeHTML(item.issue || "")}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${escapeHTML(item.seriesTitle || item.title)}</div>
          <div class="card-meta">${formatType(item.type)} · ${escapeHTML(String(item.year || ""))}</div>
          <div class="card-stats">♥ ${Number(item.clicks || 0).toLocaleString("pt-BR")} leituras</div>
        </div>
      </article>`;
  }

  function rail(title, items, subtitle = "", actionText = "") {
    if (!items.length) return "";
    return `
      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">${escapeHTML(title)}</h2>
            ${subtitle ? `<div class="section-subtitle">${escapeHTML(subtitle)}</div>` : ""}
          </div>
          ${actionText ? `<button class="link-btn" data-section="search">${escapeHTML(actionText)} →</button>` : ""}
        </div>
        <div class="rail">${uniqueCatalogItems(items).map(card).join("")}</div>
      </section>`;
  }

  function renderHome() {
    const lib = state.db.library;
    const heroItem = weightedRandom(lib.filter(x => x.featured)) || lib[0];
    const mostClicked = uniqueCatalogItems([...lib].sort((a,b) => (b.clicks||0) - (a.clicks||0)).slice(0, 8));
    const randoms = uniqueCatalogItems([...lib].sort(() => Math.random() - .5).slice(0, 8));
    const comics = uniqueCatalogItems(lib.filter(x => x.type === "comic").slice(0, 8));
    const mangas = uniqueCatalogItems(lib.filter(x => x.type === "manga").slice(0, 8));

    return `
      <section class="hero">
        <div class="hero-bg" data-cover-id="${escapeHTML(heroItem?.id || "")}" style="background-image:url('${escapeHTML(coverFor(heroItem))}')"></div>
        <div class="hero-content">
          <div class="eyebrow">Destaque da banca</div>
          <h1>${escapeHTML(heroItem?.title || "Sua banca digital")}</h1>
          <div class="hero-meta">${escapeHTML(heroItem?.issue || "")} · ${formatType(heroItem?.type || "comic")} · ${escapeHTML(String(heroItem?.year || ""))}</div>
          <p>${escapeHTML(heroItem?.description || "Publique e descubra quadrinhos sem precisar armazenar os arquivos no servidor.")}</p>
          ${heroItem ? `<button class="btn btn-primary" data-open="${escapeHTML(heroItem.id)}">▶ Ler agora</button>` : ""}
          <button class="btn btn-secondary" data-action="random">🎲 Surpreenda-me</button>
        </div>
      </section>
      <div class="content">
        ${rail("Mais lidos", mostClicked, "As edições que mais receberam cliques.", "Ver catálogo")}
        ${rail("Escolha aleatória", randoms, "Como escolher uma revista numa banca: você nunca sabe o que vai encontrar.")}
        ${rail("Quadrinhos", comics)}
        ${rail("Mangás", mangas)}
        ${renderCollectionsPreview()}
      </div>`;
  }

  function renderCollectionsPreview() {
    if (!state.db.collections.length) return "";
    return `
      <section class="section">
        <div class="section-head">
          <h2 class="section-title">Coleções</h2>
          <button class="link-btn" data-section="collections">Ver todas →</button>
        </div>
        <div class="feature-grid">
          ${state.db.collections.slice(0,4).map(c => `
            <div class="feature-card" data-collection="${escapeHTML(c.id)}">
              <div class="cover" style="background-image:url('${escapeHTML(c.cover || "")}')"></div>
              <div class="gradient"></div>
              <div class="feature-info">
                <h3>${escapeHTML(c.title)}</h3>
                <p>${c.issueIds.length} edições</p>
              </div>
            </div>`).join("")}
        </div>
      </section>`;
  }

  function renderEntityPage() {
    const filter = state.entityFilter || { kind: "character", value: "" };
    const items = state.db.library.filter(item => String(item[filter.kind] || "").toLowerCase() === String(filter.value || "").toLowerCase());
    const title = filter.kind === "publisher" ? "Editora" : "Personagem";
    return `<div class="content"><div class="section-head"><div><div class="eyebrow">Explorar catálogo</div><h1 class="section-title">${escapeHTML(filter.value)}</h1><div class="section-subtitle">${items.length} edição(ões) relacionadas a ${title.toLowerCase()}</div></div><button class="small-btn" data-section="home">Voltar ao início</button></div><section class="section"><div class="results-grid">${uniqueCatalogItems(items).map(card).join("") || `<div class="empty">Nenhuma edição encontrada.</div>`}</div></section></div>`;
  }

  function renderCatalog(type = null) {
    const items = type ? state.db.library.filter(x => x.type === type) : state.db.library;
    return `
      <div class="content">
        <div class="section-head">
          <div>
            <h1 class="section-title">${type === "manga" ? "Mangás" : type === "comic" ? "Quadrinhos" : "Catálogo"}</h1>
            <div class="section-subtitle">${items.length} edição(ões)</div>
          </div>
        </div>
        <div class="results-grid">${uniqueCatalogItems(items).map(card).join("") || `<div class="empty">Nenhuma edição cadastrada.</div>`}</div>
      </div>`;
  }

  function renderSearch() {
    const q = state.search.trim().toLowerCase();
    const results = state.db.library.filter(x => {
      const hay = [x.title,x.seriesTitle,x.issue,x.author,x.publisher,x.character,x.description,...(x.tags||[])].join(" ").toLowerCase();
      return !q || hay.includes(q);
    });
    return `
      <div class="content">
        <div class="section">
          <h1 class="section-title">Pesquisar</h1>
          <div class="search-wrap">
            <input id="search-input" class="search-input" value="${escapeHTML(state.search)}" placeholder="Título, autor, personagem, gênero, edição…">
            <button class="btn btn-danger" data-action="do-search">Pesquisar</button>
          </div>
          <div class="section-subtitle">${results.length} resultado(s)</div>
          <div class="results-grid" style="margin-top:15px">${uniqueCatalogItems(results).map(card).join("") || `<div class="empty">Nada encontrado.</div>`}</div>
        </div>
      </div>`;
  }

  function renderCollections() {
    return `
      <div class="content">
        <div class="section-head">
          <div><h1 class="section-title">Coleções</h1><div class="section-subtitle">Coletâneas que juntam várias edições.</div></div>
        </div>
        ${state.db.collections.map(c => `
          <section class="section">
            <div class="collection-banner" style="--collection-bg:url('${escapeHTML(c.cover || "")}')">
              <div class="eyebrow">Coleção</div>
              <h2>${escapeHTML(c.title)}</h2>
              <p>${escapeHTML(c.description || "")}</p>
              <div><button class="btn btn-primary" data-collection="${escapeHTML(c.id)}">Abrir coleção</button></div>
            </div>
          </section>`).join("") || `<div class="empty">Nenhuma coleção cadastrada.</div>`}
      </div>`;
  }

  function render() {
    const main = $("#main");
    if (state.section === "home") main.innerHTML = renderHome();
    else if (state.section === "comic") main.innerHTML = renderCatalog("comic");
    else if (state.section === "manga") main.innerHTML = renderCatalog("manga");
    else if (state.section === "collections") main.innerHTML = renderCollections();
    else if (state.section === "search") main.innerHTML = renderSearch();
    else if (state.section === "entity") main.innerHTML = renderEntityPage();
    bind();
    hydrateHomeCovers();
  }

  function setSection(section) {
    state.section = section;
    $$(".nav-link").forEach(btn => btn.classList.toggle("active", btn.dataset.section === section || (section === "comic" && btn.dataset.section === "comics")));
    render();
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function bind() {
    $$("[data-open]").forEach(el => el.addEventListener("click", () => {
      const item = state.db.library.find(x => x.id === el.dataset.open);
      openItem(item);
    }));
    $$("[data-section]").forEach(el => el.addEventListener("click", () => {
      const s = el.dataset.section;
      setSection(s === "comics" ? "comic" : s);
    }));
    $$("[data-action]").forEach(el => el.addEventListener("click", () => {
      const a = el.dataset.action;
      if (a === "home") setSection("home");
      if (a === "random") openItem(weightedRandom(uniqueCatalogItems(state.db.library)));
      if (a === "focus-search") { setSection("search"); setTimeout(() => $("#search-input")?.focus(), 30); }
      if (a === "do-search") { state.search = $("#search-input")?.value || ""; render(); $("#search-input")?.focus(); }
      if (a === "open-admin") openAdmin();
      if (a === "submit") openSubmission();
    }));
    $$("[data-collection]").forEach(el => el.addEventListener("click", () => openCollection(el.dataset.collection)));
    $("#search-input")?.addEventListener("keydown", e => {
      if (e.key === "Enter") { state.search = e.target.value; render(); $("#search-input")?.focus(); }
    });
  }

  function openSeriesSelection(series, editions) {
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `
      <div class="modal series-modal">
        <div class="section-head">
          <div><div class="eyebrow">Série</div><h2>${escapeHTML(series.seriesTitle || series.title)}</h2><div class="section-subtitle">${editions.length} edições disponíveis</div></div>
          <button class="small-btn" data-close>Fechar</button>
        </div>
        <div class="results-grid">${editions.slice().sort((a,b) => String(a.issue || "").localeCompare(String(b.issue || ""), undefined, {numeric:true})).map(card).join("")}</div>
      </div>`;
    $("#modal-root").appendChild(overlay);
    hydrateHomeCovers();
    $("[data-close]", overlay).onclick = () => overlay.remove();
    $$('[data-open]', overlay).forEach(el => el.addEventListener("click", () => {
      overlay.remove();
      openReader(state.db.library.find(x => x.id === el.dataset.open));
    }));
  }

  function openCollection(id) {
    const c = state.db.collections.find(x => x.id === id);
    if (!c) return;
    const items = c.issueIds.map(i => state.db.library.find(x => x.id === i)).filter(Boolean);
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `
      <div class="modal">
        <div class="section-head"><div><h2>${escapeHTML(c.title)}</h2><div class="section-subtitle">${items.length} edições</div></div><button class="small-btn" data-close>Fechar</button></div>
        <p style="color:#aaa">${escapeHTML(c.description || "")}</p>
        <div class="results-grid">${items.map(card).join("") || `<div class="empty">Coleção vazia.</div>`}</div>
      </div>`;
    $("#modal-root").appendChild(overlay);
    hydrateHomeCovers();
    $("[data-close]", overlay).onclick = () => overlay.remove();
    $$("[data-open]", overlay).forEach(el => el.onclick = () => {
      overlay.remove();
      openItem(state.db.library.find(x => x.id === el.dataset.open));
    });
  }

  function detectFormat(url = "") {
    const clean = String(url).split("?")[0].split("#")[0].toLowerCase();
    return clean.match(/\.(pdf|cbz|cbr|jpg|jpeg|png|webp|gif)$/)?.[1] || "auto";
  }

  function openAdmin(editId = null) {
    const existing = editId ? state.db.library.find(x => x.id === editId) : null;
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `
      <div class="modal">
        <div class="section-head">
          <div><h2>Administração</h2><div class="section-subtitle">Catálogo e metadados</div></div>
          <button class="small-btn" data-close>Fechar</button>
        </div>

        <div class="notice">
          <b>Use URLs diretas para os arquivos.</b> Cadastre o link direto para o PDF, CBZ ou outro arquivo no campo "Link da fonte". O site não precisa guardar uma cópia do quadrinho. A funcionalidade de ler arquivos do Telegram foi removida.
        </div>

        <div class="admin-actions" style="margin-bottom:15px">
          <button class="btn btn-danger" data-new>+ Nova edição</button>
          <button class="small-btn" data-export>Exportar catálogo</button>
          <button class="small-btn" data-import>Importar catálogo</button>
          <button class="small-btn" data-reset>Restaurar exemplo</button>
        </div>

        <table class="admin-table">
          <thead><tr><th>Edição</th><th>Tipo</th><th>Leituras</th><th>Ações</th></tr></thead>
          <tbody>
            ${state.db.library.map(x => `
              <tr>
                <td><b>${escapeHTML(x.title)}</b><br><span style="color:#777">${escapeHTML(x.issue||"")}</span></td>
                <td>${formatType(x.type)}</td>
                <td>${Number(x.clicks||0).toLocaleString("pt-BR")}</td>
                <td><div class="admin-actions">
                  <button class="small-btn" data-edit="${escapeHTML(x.id)}">Editar</button>
                  <button class="small-btn danger" data-delete="${escapeHTML(x.id)}">Excluir</button>
                </div></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`;
    $("#modal-root").appendChild(overlay);

    $("[data-close]", overlay).onclick = () => overlay.remove();
    $("[data-new]", overlay).onclick = () => { overlay.remove(); openEditForm(); };
    $("[data-export]", overlay).onclick = exportDB;
    $("[data-import]", overlay).onclick = importDB;
    $("[data-reset]", overlay).onclick = () => {
      if (confirm("Restaurar os dados de exemplo? Isso apaga as edições locais.")) {
        state.db = {library:structuredClone(window.DEFAULT_LIBRARY), collections:structuredClone(window.DEFAULT_COLLECTIONS), submissions:[]};
        save(); overlay.remove(); render(); toast("Catálogo restaurado.");
      }
    };
    $$("[data-edit]", overlay).forEach(b => b.onclick = () => { overlay.remove(); openEditForm(b.dataset.edit); });
    $$("[data-delete]", overlay).forEach(b => b.onclick = () => {
      if (!confirm("Excluir esta edição?")) return;
      state.db.library = state.db.library.filter(x => x.id !== b.dataset.delete);
      state.db.collections.forEach(c => c.issueIds = c.issueIds.filter(i => i !== b.dataset.delete));
      save(); overlay.remove(); render(); openAdmin(); toast("Edição excluída.");
    });
  }

  function openEditForm(id = null) {
    const x = id ? state.db.library.find(i => i.id === id) : {
      id: "item-" + Date.now(), title:"", issue:"", type:"comic", author:"", year:new Date().getFullYear(),
      description:"", cover:"", fileUrl:"", telegramUrl:"", format:"pdf", clicks:0, featured:false, randomWeight:5, tags:[], collectionIds:[]
    };

    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `
      <div class="modal">
        <h2>${id ? "Editar edição" : "Nova edição"}</h2>
        <form id="edit-form">
          <div class="form-grid">
            <div class="field"><label>Título</label><input name="title" required value="${escapeHTML(x.title)}"></div>
            <div class="field"><label>Edição / capítulo</label><input name="issue" value="${escapeHTML(x.issue||"")}"></div>
            <div class="field"><label>Tipo</label><select name="type">
              <option value="comic" ${x.type==="comic"?"selected":""}>Quadrinho</option>
              <option value="manga" ${x.type==="manga"?"selected":""}>Mangá</option>
            </select></div>
            <div class="field"><label>Ano</label><input name="year" type="number" value="${escapeHTML(x.year||"")}"></div>
            <div class="field"><label>Autor</label><input name="author" value="${escapeHTML(x.author||"")}"></div>
            <div class="field"><label>Formato</label><select name="format">
              ${["pdf","cbz","cbr","jpg","jpeg","png","webp","gif"].map(f=>`<option ${x.format===f?"selected":""}>${f}</option>`).join("")}
            </select></div>
            <div class="field full"><label>Link da fonte</label><input name="sourceUrl" required placeholder="https://t.me/seucanal/123 ou URL direta" value="${escapeHTML(x.telegramUrl || x.fileUrl || "")}"></div>
            <div class="field full"><label>Capa</label><div style="color:#aaa;font-size:12px">Automática: será usada a primeira página/imagem do arquivo. Não é necessário enviar uma capa separada.</div></div>
            <div class="field full"><label>Descrição</label><textarea name="description">${escapeHTML(x.description||"")}</textarea></div>
            <div class="field"><label>Tags separadas por vírgula</label><input name="tags" value="${escapeHTML((x.tags||[]).join(", "))}"></div>
            <div class="field"><label>Peso do aleatório</label><input name="randomWeight" type="number" min="1" value="${escapeHTML(x.randomWeight||5)}"></div>
            <div class="field full">
              <label><input name="featured" type="checkbox" ${x.featured?"checked":""}> Mostrar como destaque</label>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="small-btn" data-close>Cancelar</button>
            <button class="btn btn-danger">Salvar</button>
          </div>
        </form>
      </div>`;
    $("#modal-root").appendChild(overlay);
    $("[data-close]", overlay).onclick = () => overlay.remove();
    $("#edit-form", overlay).onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const data = Object.fromEntries(fd.entries());

      const sourceUrl = (data.sourceUrl || "").trim();
      let telegramUrl = "";
      let fileUrl = "";
      if (/^https?:\/\/(www\.)?t(elegram)?\.me\//.test(sourceUrl)) {
        telegramUrl = sourceUrl;
      } else {
        fileUrl = sourceUrl;
      }

      const item = {
        ...x,
        title:data.title.trim(), issue:data.issue.trim(), type:data.type, year:Number(data.year)||new Date().getFullYear(),
        author:data.author.trim(), format:data.format, fileUrl, telegramUrl,
        coverUrl:x.coverUrl || "", description:data.description.trim(), tags:data.tags.split(",").map(s=>s.trim()).filter(Boolean),
        randomWeight:Math.max(1, Number(data.randomWeight)||1), featured:fd.get("featured")==="on"
      };
      const idx = state.db.library.findIndex(i => i.id === item.id);
      if (idx >= 0) state.db.library[idx] = item; else state.db.library.push(item);
      save(); overlay.remove(); render(); toast("Edição salva.");
    };
  }

  function openSubmission() {
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `
      <div class="modal">
        <h2>Enviar quadrinho</h2>
        <p style="color:#aaa">Envie os dados da obra e um link para o arquivo. O arquivo não é copiado para esta hospedagem.</p>
        <form id="submission-form">
          <div class="form-grid">
            <div class="field"><label>Seu nome</label><input name="author" required></div>
            <div class="field"><label>Título</label><input name="title" required></div>
            <div class="field"><label>Tipo</label><select name="type"><option value="comic">Quadrinho</option><option value="manga">Mangá</option></select></div>
            <div class="field"><label>Edição/capítulo</label><input name="issue"></div>
            <div class="field full"><label>Link da fonte</label><input name="sourceUrl" required placeholder="https://t.me/... ou https://..."></div>
            <div class="field full"><label>Mensagem</label><textarea name="message" placeholder="Conte um pouco sobre a obra."></textarea></div>
          </div>
          <div class="modal-actions">
            <button type="button" class="small-btn" data-close>Cancelar</button>
            <button class="btn btn-danger">Enviar</button>
          </div>
        </form>
      </div>`;
    $("#modal-root").appendChild(overlay);
    $("[data-close]", overlay).onclick = () => overlay.remove();
    $("#submission-form", overlay).onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const data = Object.fromEntries(fd.entries());

      const sourceUrl = (data.sourceUrl || "").trim();
      let telegramUrl = "";
      let fileUrl = "";
      if (/^https?:\/\/(www\.)?t(elegram)?\.me\//.test(sourceUrl)) {
        telegramUrl = sourceUrl;
      } else {
        fileUrl = sourceUrl;
      }
      delete data.sourceUrl;

      state.db.submissions.push({
        ...data,
        fileUrl, telegramUrl,
        createdAt:new Date().toISOString(), id:"sub-"+Date.now()});
      save(); overlay.remove(); toast("Envio registrado. No modo local, ele fica salvo neste navegador.");
    };
  }

  function exportDB() {
    const blob = new Blob([JSON.stringify(state.db, null, 2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "banca-digital-catalogo.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function importDB() {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json,application/json";
    input.onchange = async () => {
      try {
        const text = await input.files[0].text();
        const db = JSON.parse(text);
        if (!Array.isArray(db.library) || !Array.isArray(db.collections)) throw new Error("Formato inválido");
        state.db = db; save(); render(); toast("Catálogo importado.");
      } catch (e) { alert("Não foi possível importar: " + e.message); }
    };
    input.click();
  }

  // Inicialização
  function openCollectionForm() {
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `
      <div class="modal">
        <div class="section-head"><div><h2>Nova coleção</h2><div class="section-subtitle">Agrupe edições por tema, personagem ou universo</div></div><button class="small-btn" data-close>Fechar</button></div>
        <form id="collection-form">
          <div class="form-grid">
            <div class="field"><label>Nome da coleção</label><input name="title" required></div>
            <div class="field"><label>Capa da coleção (URL)</label><input name="cover" placeholder="https://.../imagem.jpg"></div>
            <div class="field full"><label>Descrição</label><textarea name="description"></textarea></div>
            <div class="field full"><label>Edições da coleção</label><div class="collection-picker">
              ${state.db.library.map(x => `<label><input type="checkbox" name="issueIds" value="${escapeHTML(x.id)}"> ${escapeHTML(x.seriesTitle || x.title)} — ${escapeHTML(x.issue || "Oneshot")}</label>`).join("") || "Nenhuma edição cadastrada."}
            </div></div>
          </div>
          <div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Criar coleção</button></div>
        </form>
      </div>`;
    $("#modal-root").appendChild(overlay);
    $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#collection-form", overlay).onsubmit = event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      state.db.collections.push({
        id: "collection-" + Date.now(),
        title: String(form.get("title") || "").trim(),
        description: String(form.get("description") || "").trim(),
        cover: String(form.get("cover") || "").trim(),
        issueIds: form.getAll("issueIds")
      });
      save(); overlay.remove(); render(); toast("Coleção criada.");
    };
  }

  // Nova versão do painel: mantém os dados antigos, mas cadastra séries e metadados novos.
  function openAdmin(editId = null) {
    cancelCoverLoads();
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `
      <div class="modal admin-modal">
        <div class="section-head"><div><h2>Administração</h2><div class="section-subtitle">Catálogo de obras, edições e coleções</div></div><button class="small-btn" data-close>Fechar</button></div>
        <div class="notice"><b>Oneshots e séries</b><br>Deixe o campo Série vazio para abrir uma edição diretamente. Use o mesmo nome de série em várias edições para criar a seleção de volumes.</div>
        <div class="admin-actions" style="margin-bottom:15px">
          <button class="btn btn-danger" data-new>+ Nova edição</button><button class="small-btn" data-new-collection>+ Criar coleção</button>
          <button class="small-btn" data-export>Exportar</button><button class="small-btn" data-import>Importar</button><button class="small-btn" data-reset>Restaurar exemplo</button>
        </div>
        <table class="admin-table"><thead><tr><th>Série / edição</th><th>Editora</th><th>Personagem</th><th>Ano</th><th>Ações</th></tr></thead><tbody>
          ${state.db.library.map(x => `<tr><td><b>${escapeHTML(x.seriesTitle || x.title)}</b><br><span style="color:#777">${escapeHTML(x.issue || (x.seriesId ? "Edição" : "Oneshot"))}</span></td><td>${escapeHTML(x.publisher || "—")}</td><td>${escapeHTML(x.character || "—")}</td><td>${escapeHTML(String(x.year || "—"))}</td><td><div class="admin-actions"><button class="small-btn" data-edit="${escapeHTML(x.id)}">Editar</button><button class="small-btn danger" data-delete="${escapeHTML(x.id)}">Excluir</button></div></td></tr>`).join("")}
        </tbody></table>
        <h3 style="margin-top:28px">Coleções</h3>
        <div class="admin-collection-list">${state.db.collections.map(c => `<div><b>${escapeHTML(c.title)}</b><span>${c.issueIds.length} edições</span><button class="small-btn danger" data-delete-collection="${escapeHTML(c.id)}">Excluir</button></div>`).join("") || "Nenhuma coleção criada."}</div>
      </div>`;
    $("#modal-root").appendChild(overlay);
    const closeAdmin = event => { event?.preventDefault(); event?.stopPropagation(); overlay.remove(); hydrateHomeCovers(); };
    $("[data-close]", overlay).onclick = closeAdmin;
    $("[data-new]", overlay).onclick = () => { overlay.remove(); openEditForm(); };
    $("[data-new-collection]", overlay).onclick = () => { overlay.remove(); openCollectionForm(); };
    $("[data-export]", overlay).onclick = exportDB; $("[data-import]", overlay).onclick = importDB;
    $("[data-reset]", overlay).onclick = () => { if (confirm("Restaurar o catálogo de exemplo?")) { state.db = { library: structuredClone(window.DEFAULT_LIBRARY), collections: structuredClone(window.DEFAULT_COLLECTIONS), submissions: [] }; save(); overlay.remove(); render(); } };
    $$('[data-edit]', overlay).forEach(button => button.onclick = () => { overlay.remove(); openEditForm(button.dataset.edit); });
    $$('[data-delete]', overlay).forEach(button => button.onclick = () => { if (!confirm("Excluir esta edição?")) return; state.db.library = state.db.library.filter(x => x.id !== button.dataset.delete); state.db.collections.forEach(c => c.issueIds = c.issueIds.filter(id => id !== button.dataset.delete)); save(); overlay.remove(); render(); openAdmin(); });
    $$('[data-delete-collection]', overlay).forEach(button => button.onclick = () => { if (!confirm("Excluir esta coleção?")) return; state.db.collections = state.db.collections.filter(c => c.id !== button.dataset.deleteCollection); save(); overlay.remove(); openAdmin(); });
  }

  function openEditForm(id = null) {
    const old = id ? state.db.library.find(x => x.id === id) : null;
    const x = old || { id: "item-" + Date.now(), title: "", seriesTitle: "", issue: "", type: "comic", author: "", publisher: "", character: "", year: new Date().getFullYear(), description: "", fileUrl: "", telegramUrl: "", format: "auto", clicks: 0, featured: false, tags: [], collectionIds: [] };
    const overlay = document.createElement("div"); overlay.className = "modal-backdrop";
    overlay.innerHTML = `
      <div class="modal"><div class="section-head"><div><h2>${id ? "Editar edição" : "Nova edição"}</h2><div class="section-subtitle">A capa será extraída da primeira página</div></div><button class="small-btn" data-close>Fechar</button></div>
        <form id="edit-form"><div class="form-grid">
          <div class="field"><label>Título da edição</label><input name="title" required value="${escapeHTML(x.title)}"></div>
          <div class="field full"><label>Série (deixe vazio para oneshot)</label><input name="seriesTitle" value="${escapeHTML(x.seriesTitle || "")}" placeholder="Ex.: Homem-Aranha, Universo Casulo"></div>
          <div class="field"><label>Número da edição / volume</label><input name="volume" type="number" min="1" step="1" inputmode="numeric" value="${escapeHTML(String(x.issue || "").match(/\d+/)?.[0] || "")}" placeholder="Ex.: 1"><label class="checkbox-inline"><input name="oneShot" type="checkbox" ${!x.seriesId && !x.issue ? "checked" : ""}> Volume único</label></div>
          <div class="field"><label>Tipo</label><select name="type"><option value="comic" ${x.type === "comic" ? "selected" : ""}>Quadrinho</option><option value="manga" ${x.type === "manga" ? "selected" : ""}>Mangá</option></select></div>
          <div class="field"><label>Ano</label><input name="year" type="number" value="${escapeHTML(x.year || "")}"></div><div class="field"><label>Editora</label><input name="publisher" value="${escapeHTML(x.publisher || "")}"></div><div class="field"><label>Personagem principal</label><input name="character" value="${escapeHTML(x.character || "")}"></div><div class="field"><label>Autor</label><input name="author" value="${escapeHTML(x.author || "")}"></div>
          <div class="field full"><label>Link direto do arquivo</label><input name="sourceUrl" required value="${escapeHTML(x.telegramUrl || x.fileUrl || "")}" placeholder="arquivo.pdf, arquivo.cbz, arquivo.cbr..."><small class="format-hint">Formato detectado: <b data-format-preview>${escapeHTML(x.format || "auto")}</b></small></div>
          <div class="field full"><label>Descrição</label><textarea name="description">${escapeHTML(x.description || "")}</textarea></div><div class="field full"><label>Tags</label><input name="tags" value="${escapeHTML((x.tags || []).join(", "))}"></div><div class="field full"><label><input name="featured" type="checkbox" ${x.featured ? "checked" : ""}> Mostrar como destaque</label></div>
        </div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Salvar edição</button></div></form>
      </div>`;
    $("#modal-root").appendChild(overlay); $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    const source = $("[name=sourceUrl]", overlay), preview = $("[data-format-preview]", overlay), volume = $("[name=volume]", overlay), oneShot = $("[name=oneShot]", overlay);
    const syncOneShot = () => { volume.disabled = oneShot.checked; if (oneShot.checked) volume.value = ""; };
    oneShot.addEventListener("change", syncOneShot); syncOneShot();
    source.addEventListener("input", () => preview.textContent = detectFormat(source.value));
    $("#edit-form", overlay).onsubmit = event => { event.preventDefault(); const fd = new FormData(event.currentTarget); const sourceUrl = String(fd.get("sourceUrl") || "").trim(); const seriesTitle = fd.get("oneShot") === "on" ? "" : String(fd.get("seriesTitle") || "").trim(); const volumeNumber = fd.get("oneShot") === "on" ? "" : String(fd.get("volume") || "").replace(/\D/g, ""); const item = { ...x, title: String(fd.get("title") || "").trim(), seriesTitle, seriesId: seriesTitle ? seriesKey(seriesTitle) : "", issue: volumeNumber, type: fd.get("type"), year: Number(fd.get("year")) || new Date().getFullYear(), publisher: String(fd.get("publisher") || "").trim(), character: String(fd.get("character") || "").trim(), author: String(fd.get("author") || "").trim(), format: detectFormat(sourceUrl), fileUrl: sourceUrl, telegramUrl: "", description: String(fd.get("description") || "").trim(), tags: String(fd.get("tags") || "").split(",").map(s => s.trim()).filter(Boolean), featured: fd.get("featured") === "on" }; delete item.randomWeight; const index = state.db.library.findIndex(i => i.id === item.id); if (index >= 0) state.db.library[index] = item; else state.db.library.push(item); save(); overlay.remove(); render(); toast("Edição salva."); };
  }

  function renderCatalog(type = null) {
    const items = type ? state.db.library.filter(x => x.type === type) : state.db.library;
    const series = uniqueCatalogItems(items.filter(x => x.seriesId));
    const oneshots = uniqueCatalogItems(items.filter(x => !x.seriesId));
    const heading = type === "manga" ? "Mangás" : type === "comic" ? "Quadrinhos" : "Catálogo";
    const group = (title, groupItems) => groupItems.length ? `<section class="section"><div class="section-head"><div><h2 class="section-title">${title}</h2><div class="section-subtitle">${groupItems.length} obra(s)</div></div></div><div class="results-grid">${groupItems.map(card).join("")}</div></section>` : "";
    return `<div class="content"><div class="section-head"><div><h1 class="section-title">${heading}</h1><div class="section-subtitle">${items.length} edição(ões)</div></div></div>${group("Séries", series)}${group("Oneshots", oneshots)}${!items.length ? `<div class="empty">Nenhuma edição cadastrada.</div>` : ""}</div>`;
  }

  function openSubmission() {
    const overlay = document.createElement("div"); overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal"><div class="section-head"><div><h2>Enviar uma edição</h2><div class="section-subtitle">Ajude a ampliar o catálogo da banca</div></div><button class="small-btn" data-close>Fechar</button></div><form id="submission-form"><div class="form-grid">
      <div class="field"><label>Seu nome</label><input name="author" required></div><div class="field"><label>Nome da série (opcional)</label><input name="seriesTitle" placeholder="Vazio = oneshot"></div><div class="field"><label>Título da edição</label><input name="title" required></div><div class="field"><label>Edição / volume</label><input name="issue"></div><div class="field"><label>Tipo</label><select name="type"><option value="comic">Quadrinho</option><option value="manga">Mangá</option></select></div><div class="field"><label>Ano</label><input name="year" type="number"></div><div class="field"><label>Editora</label><input name="publisher"></div><div class="field"><label>Personagem</label><input name="character"></div><div class="field full"><label>Link direto do arquivo</label><input name="sourceUrl" required placeholder="arquivo.pdf, arquivo.cbz ou arquivo.cbr"></div><div class="field full"><label>Mensagem</label><textarea name="message" placeholder="Observações sobre esta edição"></textarea></div>
    </div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Enviar para análise</button></div></form></div>`;
    $("#modal-root").appendChild(overlay); $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#submission-form", overlay).onsubmit = event => { event.preventDefault(); const fd = new FormData(event.currentTarget); const seriesTitle = String(fd.get("seriesTitle") || "").trim(); state.db.submissions.push({ id: "sub-" + Date.now(), author: String(fd.get("author") || "").trim(), seriesTitle, seriesId: seriesTitle ? seriesKey(seriesTitle) : "", title: String(fd.get("title") || "").trim(), issue: String(fd.get("issue") || "").trim(), type: fd.get("type"), year: Number(fd.get("year")) || "", publisher: String(fd.get("publisher") || "").trim(), character: String(fd.get("character") || "").trim(), fileUrl: String(fd.get("sourceUrl") || "").trim(), format: detectFormat(fd.get("sourceUrl") || ""), message: String(fd.get("message") || ""), createdAt: new Date().toISOString() }); save(); overlay.remove(); toast("Envio registrado para análise."); };
  }

  window.BancaDigital = { state, openReader, openAdmin };
  render();
})();
