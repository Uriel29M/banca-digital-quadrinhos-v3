(() => {
  "use strict";

  // --- Inicialização de Bibliotecas ---
  // --- Fim da Inicialização ---
  const DB_KEY = `bancaDigitalDB_v1:${window.CATALOG_VERSION || "local"}`;
  const DEFAULT_AVATAR_URL = "https://i.pinimg.com/736x/be/17/10/be1710edaace144c17bdaf6deb2d2cc8.jpg";
  const SERIES_FIELDS = ["seriesTitle", "author", "publisher", "imprint", "year", "description", "coverUrl", "telegramUrl", "tags", "type", "publication", "status", "editions", "character"];
  const KNIGHT_TERRORS_VOLUME_GROUPS = [
    ["Principal", 7], ["Batman", 2], ["Devastadora", 2], ["Coringa", 2],
    ["Hera Venenosa", 2], ["Adão Negro", 2], ["Robin", 2], ["Flash", 2],
    ["Zatanna", 2], ["Shazam", 2], ["Lanterna Verde", 2], ["Mulher-Maravilha", 2],
    ["Superman", 2], ["Asa Noturna", 2], ["Mulher-Gato", 2], ["Anedota", 2],
    ["Titãs", 2], ["Action Comics", 2], ["Detective Comics", 2], ["Arlequina", 2],
    ["Algoz dos Anjos", 2]
  ];

  function knightTerrorsVolume(item) {
    if (item?.seriesId !== "series-knight-terrors-2023") return null;
    const issueIndex = Number(String(item.id || "").match(/-(\d+)$/)?.[1]) - 1;
    if (!Number.isInteger(issueIndex) || issueIndex < 0) return null;
    let offset = 0;
    for (const [name, size] of KNIGHT_TERRORS_VOLUME_GROUPS) {
      if (issueIndex < offset + size) return name;
      offset += size;
    }
    return null;
  }

  function materializeSeriesItems(items = []) {
    const series = new Map((window.DEFAULT_SERIES || []).map(entry => [entry.id, entry]));
    return items.map(item => {
      const inferredSeriesId = String(item.id || "").startsWith("harley-quinn-2021-")
        ? "series-harley-quinn-2021"
        : item.seriesId;
      const definition = series.get(inferredSeriesId);
      if (!definition) return item;
      const merged = { ...definition, ...item, seriesId: inferredSeriesId };
      SERIES_FIELDS.forEach(field => {
        if (item[field] === undefined || item[field] === null || item[field] === "") merged[field] = definition[field];
      });
      if (merged.id === "teen-titans-academy-anuario") {
        merged.issue = "Anuário";
        merged.sortOrder = 4.5;
      }
      if (merged.id === "harley-quinn-2021-annual") {
        merged.issue = "Anuário";
        merged.sortOrder = 6.5;
      }
      if (merged.id === "harley-quinn-2021-003") {
        merged.seriesId = "series-harley-quinn-2021";
        merged.issue = "3";
        merged.fileUrl = "https://www.mediafire.com/file/jixe3r7igaresw9/Arlequina_003_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr/file";
      }
      if (merged.id === "series-justice-godzilla-kong-2023-08") {
        merged.fileUrl = "https://mega.nz/file/XNISCRga#5NQNVbiHZER9AT6iE-8KG7nOEWBR3bpk2XxWKhFNO9s";
      }
      if (merged.seriesId === "series-batman-urban-legends-2021") {
        const defaultItem = (window.DEFAULT_LIBRARY || []).find(entry => entry.id === merged.id);
        if (defaultItem?.coverUrl) merged.coverUrl = defaultItem.coverUrl;
      }
      if (merged.seriesId === "series-absolute-power-2024") {
        const defaultItem = (window.DEFAULT_LIBRARY || []).find(entry => entry.id === merged.id);
        if (defaultItem?.coverUrl) merged.coverUrl = defaultItem.coverUrl;
      }
      if (String(merged.id || "").startsWith("fury-of-firestorm-2026-") && !String(merged.fileUrl || "").endsWith("/file")) {
        merged.fileUrl = `${merged.fileUrl}/file`;
      }
      const knightVolume = knightTerrorsVolume(merged);
      if (knightVolume) {
        merged.volume = knightVolume;
        merged.volumeTitle = knightVolume;
      }
      merged.seriesTitle = item.seriesTitle || definition.name || definition.seriesTitle;
      merged.title = item.title || merged.seriesTitle;
      return merged;
    });
  }

  function compactSeriesItems(items = []) {
    const series = new Map((window.DEFAULT_SERIES || []).map(entry => [entry.id, entry]));
    return items.map(item => {
      const definition = series.get(item.seriesId);
      if (!definition) return item;
      const compact = { ...item };
      SERIES_FIELDS.forEach(field => {
        if (field !== "type" && compact[field] === definition[field]) delete compact[field];
      });
      if (compact.seriesTitle === definition.name || compact.seriesTitle === definition.seriesTitle) delete compact.seriesTitle;
      if (compact.title === definition.name || compact.title === definition.seriesTitle) delete compact.title;
      return compact;
    });
  }

  function clearGeneratedCoverCache() {
    const keys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith("banca-cover:")) keys.push(key);
    }
    keys.forEach(key => localStorage.removeItem(key));
  }

  function storageSafeLibrary(items = []) {
    return compactSeriesItems(items).map(item => {
      const safe = { ...item };
      if (/^data:/i.test(String(safe.cover || ""))) delete safe.cover;
      if (/^data:/i.test(String(safe.coverUrl || ""))) delete safe.coverUrl;
      if (/^data:/i.test(String(safe.featuredCoverUrl || ""))) delete safe.featuredCoverUrl;
      return safe;
    });
  }

  function isLegacyRemovedCatalogItem(item) {
    const text = [item?.id, item?.seriesId, item?.title, item?.name, item?.seriesTitle, item?.originalTitle].join(" ");
    return /tomoki-kun|onnanoko/i.test(text);
  }

  const DataStore = {
    load() {
      try {
        const saved = JSON.parse(localStorage.getItem(DB_KEY));
        if (saved?.library && saved?.collections) {
          const removedItemIds = new Set([
            ...(window.REMOVED_DEFAULT_ITEM_IDS || []),
            ...(Array.isArray(saved.removedItemIds) ? saved.removedItemIds : [])
          ]);
          const legacyRemovedSeriesIds = new Set(saved.library.filter(isLegacyRemovedCatalogItem).map(item => item.seriesId || item.id));
          const isRemoved = item => removedItemIds.has(item.id) || isLegacyRemovedCatalogItem(item) || legacyRemovedSeriesIds.has(item.seriesId);
          const hadRemovedItems = saved.library.some(isRemoved);
          saved.library = saved.library.filter(item => !isRemoved(item));
          saved.collections = saved.collections.map(collection => ({
            ...collection,
            issueIds: (collection.issueIds || []).filter(id => !removedItemIds.has(id) && !legacyRemovedSeriesIds.has(id))
          }));
          const oldAbsolutePowerIds = new Map([
            ["series-absolute-power-2024-02", "series-absolute-power-2024-01"],
            ["series-absolute-power-2024-03", "series-absolute-power-2024-02"],
            ["series-absolute-power-2024-04", "series-absolute-power-2024-03"],
            ["series-absolute-power-2024-05", "series-absolute-power-2024-04"]
          ]);
          if (saved.library.some(item => item.id === "series-absolute-power-2024-05")) {
            saved.library = saved.library
              .filter(item => item.id !== "series-absolute-power-2024-01")
              .map(item => oldAbsolutePowerIds.has(item.id) ? { ...item, id: oldAbsolutePowerIds.get(item.id) } : item);
          }
          const defaultsById = new Map((window.DEFAULT_LIBRARY || []).map(item => [item.id, item]));
          const previousLibrary = saved.library;
          saved.library = materializeSeriesItems(saved.library.map(item => ({ ...(defaultsById.get(item.id) || {}), ...item })));
          const hadStargirlAdvertisement = saved.library.some(item => item.id === "series-stargirl-lost-children-2022-03");
          saved.library = saved.library.filter(item => item.id !== "series-stargirl-lost-children-2022-03");
          if (hadStargirlAdvertisement) {
            saved.collections = saved.collections.map(collection => ({
              ...collection,
              issueIds: (collection.issueIds || []).filter(id => id !== "series-stargirl-lost-children-2022-03")
            }));
          }
          const knightVolumesChanged = saved.library.some(item => {
            const previous = previousLibrary.find(entry => entry.id === item.id);
            return previous && (previous.volume !== item.volume || previous.volumeTitle !== item.volumeTitle);
          });
          if (knightVolumesChanged || hadStargirlAdvertisement) this.save(saved);
          if (saved.library.some(item => item.id === "series-justice-godzilla-kong-2023-08" && String(item.fileUrl || "").includes("bpk2XxWKhFNO9s"))) this.save(saved);
          const knownIds = new Set(saved.library.map(item => item.id));
          const newDefaults = materializeSeriesItems(structuredClone(window.DEFAULT_LIBRARY)).filter(item => !knownIds.has(item.id) && !removedItemIds.has(item.id) && !isLegacyRemovedCatalogItem(item));
          if (newDefaults.length) {
            const merged = { ...saved, library: [...saved.library, ...newDefaults] };
            this.save(merged);
            return merged;
          }
          if (hadRemovedItems) this.save(saved);
          return saved;
        }
      } catch {}
      const fresh = {
        library: structuredClone(window.DEFAULT_LIBRARY),
        collections: structuredClone(window.DEFAULT_COLLECTIONS),
        submissions: [],
        removedItemIds: []
      };
      const removedItemIds = new Set(window.REMOVED_DEFAULT_ITEM_IDS || []);
      fresh.library = fresh.library.filter(item => !removedItemIds.has(item.id) && !isLegacyRemovedCatalogItem(item));
      fresh.collections = fresh.collections.map(collection => ({
        ...collection,
        issueIds: (collection.issueIds || []).filter(id => !removedItemIds.has(id))
      }));
      fresh.library = materializeSeriesItems(fresh.library);
      this.save(fresh);
      return fresh;
    },
    save(db) {
      const payload = JSON.stringify({ ...db, library: storageSafeLibrary(db.library) });
      try {
        localStorage.setItem(DB_KEY, payload);
      } catch (error) {
        if (error?.name !== "QuotaExceededError") throw error;
        clearGeneratedCoverCache();
        try {
          localStorage.setItem(DB_KEY, payload);
        } catch (retryError) {
          console.warn("Catálogo local maior que a cota do navegador; alterações locais não foram persistidas.", retryError);
        }
      }
    }
  };

  const state = {
    db: DataStore.load(),
    section: "home",
    authMode: "login",
    publicProfile: null,
    search: "",
    entityFilter: null,
    collectionId: null,
    editingId: null,
    // Reading mode for PDF, CBZ, and CBR readers
    readingMode: localStorage.getItem("readingMode") || "single-page", // 'single-page', 'double-page', or 'continuous-scroll'
    readingDirection: localStorage.getItem("readingDirection") || "western" // 'western' or 'eastern'
    ,session: null,
    authReady: false,
    profile: null,
    favoriteIds: new Set(),
    coverVariants: new Map(),
    coverChoices: new Map(),
    readingProgress: new Map(),
    shelfSnapshot: null,
    shelfExpanded: { saved: false, read: false },
    shelfCategories: [],
    blogShelfCategories: [],
    shelfTab: "comics",
    publicShelfTab: "comics",
    blogSaveIds: new Set(),
    authoredBlogPosts: [],
    savedBlogPosts: [],
    collectionFilter: { field: "all", query: "" },
    comicLikeIds: new Set(),
    comicLikeCounts: new Map(),
    achievementChecks: new Set(),
    homeHeroId: null,
    homeRandomIds: [],
    achievements: [],
    followerCount: 0,
    followingCount: 0,
    chatContact: null,
    notifications: [],
    notificationUnreadCount: 0,
    notificationChannel: null,
    localBoxFiles: [],
    localBoxVisible: false,
    publisherSettings: new Map(),
    publisherSeriesExpanded: {},
    popularPublicCollections: [],
    featuredComicCollections: [],
    featuredBlogCollections: [],
    blogPosts: [],
    blogLoading: false,
    blogTab: "recentes",
    blogOpenId: null,
    blogLikeIds: new Set(),
    blogLikeCounts: new Map(),
    blogCommentCounts: new Map(),
    blogCommentThreads: new Map(),
    blogEditorRange: null
  };

  let activeReaderCleanup = null;
  let handlingRoute = false;

  const sectionRoutes = {
    home: "",
    comic: "quadrinhos",
    blog: "blogs",
    collections: "colecoes",
    search: "pesquisar",
    shelf: "estante",
    "local-box": "caixa",
    login: "entrar",
    signup: "cadastro",
    entity: "entidade"
  };

  function routeUrl(params = {}) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
    });
    return `${url.pathname}${url.search}`;
  }

  function navigate(params, replace = false) {
    const url = routeUrl(params);
    if (replace) window.history.replaceState({}, "", url);
    else window.history.pushState({}, "", url);
    applyRoute();
  }

  function setSectionRoute(section, replace = false) {
    const route = sectionRoutes[section];
    if (route === undefined) return setSection(section);
    navigate(route ? { pagina: route } : {}, replace);
  }

  function applyRoute() {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const params = new URLSearchParams(window.location.search);
    const readerId = params.get("ler");
    const page = params.get("pagina") || "";
    const section = params.get("colecao") ? "collection" : Object.keys(sectionRoutes).find(key => sectionRoutes[key] === page) || "home";
    const item = readerId ? state.db.library.find(entry => entry.id === readerId) : null;

    activeReaderCleanup?.();
    activeReaderCleanup = null;
    handlingRoute = true;
    if (readerId && item) {
      state.section = "reader";
      state.readerItemId = readerId;
      render();
      if (state.authReady) openReader(item, { routeSync: true });
    } else {
      state.section = section;
      state.collectionId = params.get("colecao") || null;
      if (section === "blog") state.blogOpenId = params.get("blog") || null;
      if (section === "search") state.search = params.get("q") || "";
      if (section === "entity") state.entityFilter = { kind: params.get("tipo") || "character", value: params.get("valor") || "" };
      render();
      if (section === "blog" && !state.blogPosts.length) loadBlogPosts();
    }
    handlingRoute = false;
  }

  const sb = window.supabase?.createClient && window.BANCA_SUPABASE_URL
    ? window.supabase.createClient(window.BANCA_SUPABASE_URL, window.BANCA_SUPABASE_KEY)
    : null;

  async function loadComicReadCounts() {
    if (!sb) return;
    const result = await sb.from("comic_read_counts").select("item_id, clicks");
    if (result.error) {
      console.warn("NÃ£o foi possÃ­vel carregar as quantidades de leitura:", result.error.message);
      return;
    }
    const counts = new Map((result.data || []).map(row => [String(row.item_id), Number(row.clicks) || 0]));
    state.db.library.forEach(item => {
      item.clicks = counts.get(String(item.id)) || 0;
    });
  }

  async function recordComicRead(item) {
    if (!item || item.local || !item.id) return;
    if (!sb) {
      item.clicks = (Number(item.clicks) || 0) + 1;
      save();
      return;
    }
    const result = await sb.rpc("increment_comic_read", { p_item_id: String(item.id) });
    if (result.error) {
      console.warn("NÃ£o foi possÃ­vel registrar a leitura:", result.error.message);
      return;
    }
    item.clicks = Number(result.data) || 0;
    $$('[data-open]').filter(element => element.dataset.open === item.id).forEach(cardElement => {
      const stats = $(".card-stats", cardElement);
      if (stats) stats.textContent = `♥ ${item.clicks.toLocaleString("pt-BR")} leituras`;
    });
  }

  async function publishCatalog() {
    if (!sb || state.profile?.plan !== "admin") return { skipped: true };
    const result = await sb.functions.invoke("github-catalog", {
      body: { library: compactSeriesItems(state.db.library), series: window.DEFAULT_SERIES || [], collections: state.db.collections },
    });
    if (result.error) {
      let detail = result.error.message || "Não foi possível publicar o catálogo.";
      try {
        const response = result.error.context;
        if (response?.clone) {
          const body = await response.clone().json();
          if (body?.error) detail = body.error;
        }
      } catch {}
      throw new Error(detail);
    }
    if (result.data?.error) throw new Error(result.data.error);
    return result.data;
  }

  function saveCatalog(message = "Catálogo salvo.") {
    save();
    publishCatalog()
      .then(result => {
        if (!result?.skipped) toast(`${message} GitHub atualizado.`);
      })
      .catch(error => {
        console.error("[CATALOG] Falha ao publicar no GitHub:", error);
        const detail = /failed to send a request to the edge function/i.test(error.message || "")
          ? "a Edge Function github-catalog não respondeu. Implante-a no projeto Supabase."
          : (error.message || "não foi possível publicar.");
        toast(`${message} GitHub: ${detail}`);
      });
  }

  function authEmail(username) {
    return `${String(username).replace(/^@/, '').toLowerCase()}@login.banca-digital.local`;
  }

  function cleanUsername(value) {
    return String(value || "").replace(/^@/, "").trim().toLowerCase();
  }

  function safeBlogHtml(value = "") {
    const template = document.createElement("template");
    template.innerHTML = String(value || "");
    const allowed = new Set(["B", "STRONG", "I", "EM", "U", "S", "H2", "H3", "P", "DIV", "BR", "BLOCKQUOTE", "UL", "OL", "LI", "A", "IMG"]);
    template.content.querySelectorAll("*").forEach(node => {
      if (!allowed.has(node.tagName)) {
        node.replaceWith(...Array.from(node.childNodes));
        return;
      }
      const href = node.tagName === "A" ? node.getAttribute("href") || "" : "";
      const src = node.tagName === "IMG" ? node.getAttribute("src") || "" : "";
      const style = node.getAttribute("style") || "";
      [...node.attributes].forEach(attribute => node.removeAttribute(attribute.name));
      if (node.tagName === "A") {
        if (!/^https?:\/\//i.test(href)) node.replaceWith(...Array.from(node.childNodes));
        else {
          node.setAttribute("href", href);
          node.setAttribute("target", "_blank");
          node.setAttribute("rel", "noopener noreferrer");
        }
      }
      if (node.tagName === "IMG") {
        if (!/^https?:\/\//i.test(src)) node.replaceWith(...Array.from(node.childNodes));
        else {
          node.setAttribute("src", src);
          node.setAttribute("alt", "Imagem inserida no artigo");
          node.setAttribute("loading", "lazy");
        }
      }
      if ((node.tagName === "P" || node.tagName === "DIV") && /^text-align\s*:\s*(left|center|right|justify)\s*;?$/i.test(style.trim())) {
        node.setAttribute("style", `text-align: ${style.split(":")[1].replace(";", "").trim()}`);
      }
    });
    return template.innerHTML.trim();
  }

  function openBlogLinkDialog() {
    const editor = $("#blog-editor");
    if (!editor) return;
    const selection = window.getSelection();
    const savedRange = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = '<div class="modal blog-link-modal"><div class="section-head"><div><h2>Adicionar link</h2><div class="section-subtitle">Cole o endereço do link:</div></div><button type="button" class="small-btn" data-close>Fechar</button></div><form id="blog-link-form"><div class="field"><label>Endereço</label><input name="url" type="url" required placeholder="https://exemplo.com"></div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button type="submit" class="btn btn-danger">Adicionar link</button></div></form></div>';
    $("#modal-root").appendChild(overlay);
    const close = () => overlay.remove();
    $$('[data-close]', overlay).forEach(button => button.addEventListener("click", close));
    overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
    $("#blog-link-form", overlay)?.addEventListener("submit", event => {
      event.preventDefault();
      const url = String(new FormData(event.currentTarget).get("url") || "").trim();
      if (!/^https?:\/\//i.test(url)) return toast("Use um endereço começando com http:// ou https://.");
      editor.focus();
      const currentSelection = window.getSelection();
      currentSelection?.removeAllRanges();
      if (savedRange) currentSelection?.addRange(savedRange);
      if (currentSelection?.toString().trim()) document.execCommand("createLink", false, url);
      else document.execCommand("insertHTML", false, `<a href="${escapeHTML(url)}">${escapeHTML(url)}</a>`);
      close();
    });
    $("input[name=url]", overlay)?.focus();
  }

  function blogDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
  }

  function blogImageStyle(url) {
    return url ? `style="background-image:url('${escapeHTML(url)}')"` : "";
  }

  async function loadBlogPosts() {
    if (!sb) {
      state.blogError = "A autenticação ainda não foi configurada.";
      render();
      return;
    }
    state.blogLoading = true;
    state.blogError = "";
    render();
    const result = await sb.from("blog_posts")
      .select("id, author_id, title, excerpt, content_html, cover_url, image_2_url, image_3_url, status, is_featured, created_at, updated_at, published_at")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("published_at", { ascending: false });
    state.blogLoading = false;
    if (result.error) {
      console.error("[BLOGS] Falha ao carregar blog_posts:", result.error);
      state.blogError = "Não foi possível carregar os blogs. Execute a atualização do schema no Supabase.";
      state.blogPosts = [];
    } else {
      const posts = result.data || [];
      const authorIds = [...new Set(posts.map(post => post.author_id).filter(Boolean))];
      const authors = authorIds.length ? await sb.from("profiles").select("id, username, avatar_url, title, title_color").in("id", authorIds) : { data: [] };
      const authorsById = new Map((authors.data || []).map(author => [author.id, author]));
      state.blogPosts = posts.map(post => ({ ...post, author: authorsById.get(post.author_id) || null }));
      const blogIds = state.blogPosts.map(post => post.id);
      const likes = blogIds.length ? await sb.from("blog_likes").select("blog_id, user_id").in("blog_id", blogIds) : { data: [] };
      const comments = blogIds.length ? await sb.from("blog_comments").select("blog_id").in("blog_id", blogIds) : { data: [] };
      const saves = blogIds.length && state.session?.user?.id ? await sb.from("blog_saves").select("blog_id").eq("user_id", state.session.user.id).in("blog_id", blogIds) : { data: [] };
      state.blogSaveIds = new Set((saves.data || []).map(row => String(row.blog_id)));
      state.blogLikeIds = new Set((likes.data || []).filter(row => row.user_id === state.session?.user?.id).map(row => String(row.blog_id)));
      state.blogLikeCounts = (likes.data || []).reduce((counts, row) => counts.set(String(row.blog_id), (counts.get(String(row.blog_id)) || 0) + 1), new Map());
      state.blogCommentCounts = (comments.data || []).reduce((counts, row) => counts.set(String(row.blog_id), (counts.get(String(row.blog_id)) || 0) + 1), new Map());
    }
    render();
  }

  async function uploadBlogImage(file, index) {
    if (!file?.size) return null;
    if (!/^image\/(png|jpe?g|webp|gif)$/i.test(file.type)) throw new Error("Use imagens PNG, JPG, WEBP ou GIF.");
    if (file.size > 8 * 1024 * 1024) throw new Error("Cada imagem pode ter no máximo 8 MB.");
    const extension = String(file.name || "jpg").split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${state.session.user.id}/${Date.now()}-${index}-${Math.random().toString(36).slice(2)}.${extension}`;
    const upload = await sb.storage.from("blog-images").upload(path, file, { upsert: false, contentType: file.type || "image/jpeg" });
    if (upload.error) throw new Error("Não foi possível enviar uma das imagens. Verifique o bucket blog-images no Supabase.");
    return sb.storage.from("blog-images").getPublicUrl(path).data.publicUrl;
  }

  async function publishBlogPost(form) {
    if (!state.session) return openAuthPage();
    const data = new FormData(form);
    const title = String(data.get("title") || "").trim();
    const excerpt = String(data.get("excerpt") || "").trim();
    const content = safeBlogHtml($("#blog-editor")?.innerHTML || "");
    const coverFile = data.get("cover");
    if (title.length < 3) return toast("Informe um título para o blog.");
    if (!coverFile?.size) return toast("Adicione uma capa para publicar o blog.");
    if (!content) return toast("Escreva o conteúdo do blog antes de publicar.");
    const button = $("button[type=submit]", form);
    if (button) button.disabled = true;
    try {
      const coverUrl = await uploadBlogImage(coverFile, 1);
      const image2Url = data.get("image2")?.size ? await uploadBlogImage(data.get("image2"), 2) : null;
      const image3Url = data.get("image3")?.size ? await uploadBlogImage(data.get("image3"), 3) : image2Url;
      const staff = ["moderator", "admin"].includes(state.profile?.plan);
      const result = await sb.from("blog_posts").insert({
        author_id: state.session.user.id,
        title,
        excerpt: excerpt.slice(0, 500),
        content_html: content,
        cover_url: coverUrl,
        image_2_url: image2Url,
        image_3_url: image3Url,
        status: "published",
        is_featured: staff && data.get("isFeatured") === "on",
        published_at: new Date().toISOString()
      });
      if (result.error) return toast(result.error.message || "Não foi possível publicar o blog.");
      state.blogTab = "recentes";
      state.blogOpenId = null;
      await loadBlogPosts();
      toast("Blog publicado.");
    } catch (error) {
      toast(error.message || "Não foi possível publicar o blog.");
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function toggleBlogFeatured(id, featured) {
    if (!["moderator", "admin"].includes(state.profile?.plan)) return;
    const result = await sb.from("blog_posts").update({ is_featured: !featured }).eq("id", id);
    if (result.error) return toast("Não foi possível atualizar o destaque.");
    await loadBlogPosts();
    toast(featured ? "Blog removido dos destaques." : "Blog destacado.");
  }

  function findBlogPost(id) {
    return [...state.blogPosts, ...state.authoredBlogPosts, ...state.savedBlogPosts].find(item => String(item.id) === String(id));
  }

  async function deleteBlogPost(id) {
    if (!state.session) return openAuthPage();
    const post = findBlogPost(id);
    if (!post) return;
    const staff = ["moderator", "admin"].includes(state.profile?.plan);
    const isAuthor = post.author_id === state.session.user.id;
    if (!staff && !isAuthor) return toast("Você não pode apagar este blog.");
    if (!window.confirm(`Apagar o blog "${post.title}"? Esta ação não pode ser desfeita.`)) return;
    const result = await sb.from("blog_posts").delete().eq("id", id);
    if (result.error) return toast(result.error.message || "Não foi possível apagar o blog.");
    state.blogOpenId = null;
    await loadBlogPosts();
    toast("Blog apagado.");
  }

  async function toggleBlogLike(id) {
    if (!state.session) return openAuthPage();
    const key = String(id);
    const liked = state.blogLikeIds.has(key);
    const query = sb.from("blog_likes");
    const result = liked
      ? await query.delete().eq("blog_id", id).eq("user_id", state.session.user.id)
      : await query.insert({ blog_id: id, user_id: state.session.user.id });
    if (result.error) return toast("Não foi possível atualizar a curtida.");
    if (liked) {
      state.blogLikeIds.delete(key);
      state.blogLikeCounts.set(key, Math.max(0, (state.blogLikeCounts.get(key) || 1) - 1));
    } else {
      state.blogLikeIds.add(key);
      state.blogLikeCounts.set(key, (state.blogLikeCounts.get(key) || 0) + 1);
    }
    render();
  }

  async function toggleBlogSave(id) {
    if (!state.session) return openAuthPage();
    const key = String(id);
    const saved = state.blogSaveIds.has(key);
    const result = saved
      ? await sb.from("blog_saves").delete().eq("blog_id", id).eq("user_id", state.session.user.id)
      : await sb.from("blog_saves").insert({ blog_id: id, user_id: state.session.user.id });
    if (result.error) return toast("Não foi possível atualizar os blogs salvos. Execute a atualização do schema no Supabase.");
    saved ? state.blogSaveIds.delete(key) : state.blogSaveIds.add(key);
    render();
  }

  async function shareBlog(id, title = "Blog") {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("pagina", "blogs");
    url.searchParams.set("blog", id);
    const shareData = { title, text: `Leia ${title} na Banca Digital`, url: url.toString() };
    if (navigator.share) await navigator.share(shareData).catch(() => {});
    else {
      await navigator.clipboard?.writeText(url.toString());
      toast("Link do blog copiado.");
    }
  }

  async function openBlogComments(post) {
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal blog-comments-modal"><div class="section-head"><div><h2>Comentários</h2><div class="section-subtitle">${escapeHTML(post.title)}</div></div><button class="small-btn" data-close>Fechar</button></div><div class="blog-comments-list"><span class="section-subtitle">Carregando...</span></div>${state.session ? '<form class="comment-form" id="blog-comment-form" data-blog-comment-form><textarea name="body" maxlength="1000" required placeholder="Escreva um comentário..."></textarea><button class="small-btn" type="submit">Comentar</button></form>' : '<p class="section-subtitle">Entre para comentar.</p>'}</div>`;
    $("#modal-root").appendChild(overlay);
    $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    const list = $(".blog-comments-list", overlay);
    const refresh = async () => {
      const thread = await loadBlogCommentThread(post);
      state.blogCommentThreads.set(String(post.id), thread);
      renderBlogCommentThread(list, thread);
      linkCommentMentions(list);
      state.blogCommentCounts.set(String(post.id), thread.comments?.length || 0);
    };
    await refresh();
    bindBlogCommentThread(overlay, post, list, refresh);
  }

  function blogEngagementMarkup(post) {
    const id = String(post.id);
    const liked = state.blogLikeIds.has(id);
    const likes = state.blogLikeCounts.get(id) || 0;
    const comments = state.blogCommentCounts.get(id) || 0;
    const saved = state.blogSaveIds.has(id);
    return `<div class="blog-engagement"><button class="small-btn ${liked ? "is-liked" : ""}" data-blog-like="${escapeHTML(id)}">${liked ? "♥" : "♡"} ${likes}</button><button class="small-btn ${saved ? "is-liked" : ""}" data-blog-save="${escapeHTML(id)}">${saved ? "★ Salvo" : "☆ Salvar"}</button><button class="small-btn" data-blog-comments="${escapeHTML(id)}">Comentários · ${comments}</button><button class="small-btn" data-blog-share="${escapeHTML(id)}">Compartilhar</button></div>`;
  }

  function blogCard(post, featured = false) {
    const author = post.author || {};
    const staff = ["moderator", "admin"].includes(state.profile?.plan);
    const canDelete = staff || state.session?.user?.id === post.author_id;
    const coverOnly = (!post.image_2_url && !post.image_3_url) || (post.cover_url && post.image_2_url === post.cover_url && post.image_3_url === post.cover_url);
    return `<article class="blog-card ${featured ? "is-featured" : ""}" data-blog-open="${escapeHTML(post.id)}"><div class="blog-card-images ${coverOnly ? "is-cover-only" : ""}"><div class="blog-card-cover ${post.cover_url ? "has-image" : ""}" ${blogImageStyle(post.cover_url)}></div><div class="blog-card-side"><div class="blog-card-side-image ${post.image_2_url ? "has-image" : ""}" ${blogImageStyle(post.image_2_url)}></div><div class="blog-card-side-image ${post.image_3_url ? "has-image" : ""}" ${blogImageStyle(post.image_3_url)}></div></div></div><div class="blog-card-body"><div class="eyebrow">${post.is_featured ? "Destaque" : "Blog"}</div><h3>${escapeHTML(post.title)}</h3><p>${escapeHTML(post.excerpt || "Confira esta publicação na Banca Digital.")}</p><div class="blog-card-meta">@${escapeHTML(author.username || "usuário")} · ${escapeHTML(blogDate(post.published_at || post.created_at))}</div><div class="blog-card-actions"><button class="small-btn" data-blog-read="${escapeHTML(post.id)}">Ler artigo</button>${staff ? `<button class="small-btn" data-blog-feature="${escapeHTML(post.id)}" data-blog-featured="${post.is_featured ? "true" : "false"}">${post.is_featured ? "Remover destaque" : "Destacar"}</button>` : ""}${canDelete ? `<button class="small-btn danger" data-blog-delete="${escapeHTML(post.id)}">Apagar</button>` : ""}</div>${blogEngagementMarkup(post)}</div></article>`;
  }

  function blogHighlightsSidebar() {
    const highlights = state.blogPosts.filter(post => post.is_featured).slice(0, 3);
    const recent = state.blogPosts.filter(post => !post.is_featured).slice(0, 3);
    if (!highlights.length && !recent.length) return "";
    const cards = posts => posts.map(post => `<article class="blog-highlight-item" data-blog-open="${escapeHTML(post.id)}"><div class="blog-highlight-cover ${post.cover_url ? "has-image" : ""}" ${blogImageStyle(post.cover_url)}></div><div class="blog-highlight-body"><h3>${escapeHTML(post.title)}</h3><p>${escapeHTML(post.excerpt || "Confira esta publicação.")}</p></div></article>`).join("");
    return `<aside class="blog-highlights-sidebar">${highlights.length ? `<div class="eyebrow">Em destaque</div><h2>Blogs em destaque</h2><div class="blog-highlights-list">${cards(highlights)}</div>` : ""}${recent.length ? `<div class="blog-sidebar-recent"><div class="eyebrow">Atualizações</div><h2>Recentes</h2><div class="blog-highlights-list">${cards(recent)}</div></div>` : ""}</aside>`;
  }

  function blogAuthorMarkup(post) {
    const author = post.author || {};
    const username = author.username || "usuário";
    const avatar = author.avatar_url || "https://i.pinimg.com/736x/be/17/10/be1710edaace144c17bdaf6deb2d2cc8.jpg";
    return `<a href="${escapeHTML(publicProfileHref(username))}" class="blog-author-card"><img src="${escapeHTML(avatar)}" alt="Foto de @${escapeHTML(username)}"><span><span class="eyebrow">Publicado por</span><span class="blog-author-name">@${escapeHTML(username)}</span>${author.title ? `<span class="blog-author-title" style="color:${escapeHTML(safeTitleColor(author.title_color))}">${escapeHTML(author.title)}</span>` : ""}</span></a>`;
  }

  function blogCommentsSection(post) {
    return `<section class="blog-inline-comments" data-blog-inline-comments="${escapeHTML(post.id)}"><div class="section-head"><div><h2>Comentários</h2><div class="section-subtitle">Converse sobre esta publicação.</div></div></div><div class="blog-inline-comments-list"><span class="section-subtitle">Carregando comentários...</span></div>${state.session ? '<form class="comment-form blog-inline-comment-form" data-blog-comment-form><textarea name="body" maxlength="1000" required placeholder="Escreva um comentário..."></textarea><button class="small-btn" type="submit">Comentar</button></form>' : '<p class="section-subtitle">Entre para comentar.</p>'}</section>`;
  }

  async function loadBlogCommentThread(post) {
    let result = await sb.from("blog_comments").select("id, parent_id, user_id, body, created_at").eq("blog_id", post.id).order("created_at", { ascending: true });
    if (result.error && /parent_id|schema cache|column/i.test(result.error.message || "")) {
      const legacyResult = await sb.from("blog_comments").select("id, user_id, body, created_at").eq("blog_id", post.id).order("created_at", { ascending: true });
      result = { ...legacyResult, data: (legacyResult.data || []).map(comment => ({ ...comment, parent_id: null })) };
    }
    if (result.error) return { error: result.error, comments: [] };
    const comments = result.data || [];
    const userIds = [...new Set(comments.map(comment => comment.user_id).filter(Boolean))];
    const profilesResult = userIds.length ? await sb.from("profiles").select("id, username, avatar_url, title, title_color, plan").in("id", userIds) : { data: [] };
    const profiles = new Map((profilesResult.data || []).map(profile => [profile.id, profile]));
    comments.forEach(comment => { comment.profiles = profiles.get(comment.user_id) || {}; });
    const likes = comments.length ? await sb.from("blog_comment_likes").select("blog_comment_id, user_id").in("blog_comment_id", comments.map(comment => comment.id)) : { data: [] };
    const likedIds = new Set((likes.data || []).filter(row => row.user_id === state.session?.user?.id).map(row => row.blog_comment_id));
    const counts = (likes.data || []).reduce((map, row) => map.set(row.blog_comment_id, (map.get(row.blog_comment_id) || 0) + 1), new Map());
    return { comments, likedIds, counts };
  }

  function blogCommentMarkup(comment, childrenByParent, likedIds, likeCounts) {
    const username = cleanUsername(comment.profiles?.username || "usuário");
    const profile = { ...(comment.profiles || {}), username };
    const children = childrenByParent.get(comment.id) || [];
    const replies = children.map(child => blogCommentMarkup(child, childrenByParent, likedIds, likeCounts)).join("");
    const canDelete = state.session?.user?.id === comment.user_id || ["moderator", "admin"].includes(state.profile?.plan);
    return `<article class="comment blog-comment" data-blog-comment-id="${comment.id}"><div class="comment-author-row">${avatarMarkup(profile, "comment-avatar")}<div class="comment-author-info"><a class="comment-author" href="${publicProfileHref(username)}" target="_blank" rel="noopener">@${escapeHTML(username)}</a>${profile.title ? `<span class="comment-title">${escapeHTML(profile.title)}</span>` : ""}</div></div><p>${escapeHTML(comment.body)}</p><div class="comment-actions"><button class="comment-action ${likedIds.has(comment.id) ? "is-liked" : ""}" data-blog-comment-like="${comment.id}">♥ ${likeCounts.get(comment.id) || 0}</button><button class="comment-action" data-blog-comment-reply="${comment.id}">Responder</button>${children.length ? `<button class="comment-action" data-blog-comment-toggle="${comment.id}">Ver ${children.length} resposta${children.length === 1 ? "" : "s"}</button>` : ""}${canDelete ? `<button class="comment-action comment-delete-action" data-blog-comment-delete="${comment.id}">Excluir</button>` : ""}<time class="comment-date" datetime="${escapeHTML(comment.created_at)}">${escapeHTML(formatCommentDate(comment.created_at))}</time></div><div class="comment-replies" data-blog-comment-replies="${comment.id}" hidden>${replies}</div></article>`;
  }

  function renderBlogCommentThread(list, thread) {
    if (thread.error) {
      list.innerHTML = '<span class="section-subtitle">Não foi possível carregar os comentários.</span>';
      return;
    }
    const childrenByParent = new Map();
    thread.comments.forEach(comment => {
      if (!childrenByParent.has(comment.parent_id)) childrenByParent.set(comment.parent_id, []);
      childrenByParent.get(comment.parent_id).push(comment);
    });
    list.innerHTML = (childrenByParent.get(null) || []).map(comment => blogCommentMarkup(comment, childrenByParent, thread.likedIds, thread.counts)).join("") || '<span class="section-subtitle">Nenhum comentário ainda.</span>';
  }

  function bindBlogCommentThread(root, post, list, refresh) {
    if (root.dataset.blogCommentBound) return;
    root.dataset.blogCommentBound = "true";
    root.addEventListener("click", async event => {
      const like = event.target.closest("[data-blog-comment-like]");
      if (like) {
        event.preventDefault();
        if (!state.session) return openAuthPage();
        const id = Number(like.dataset.blogCommentLike);
        const liked = like.classList.contains("is-liked");
        const result = liked ? await sb.from("blog_comment_likes").delete().eq("user_id", state.session.user.id).eq("blog_comment_id", id) : await sb.from("blog_comment_likes").insert({ user_id: state.session.user.id, blog_comment_id: id });
        if (result.error) return toast("Não foi possível atualizar a curtida.");
        await refresh();
        return;
      }
      const deleteButton = event.target.closest("[data-blog-comment-delete]");
      if (deleteButton) {
        event.preventDefault();
        if (!window.confirm("Excluir este comentário e suas respostas?")) return;
        const result = await sb.from("blog_comments").delete().eq("id", deleteButton.dataset.blogCommentDelete);
        if (result.error) return toast("Não foi possível excluir o comentário.");
        await refresh();
        return;
      }
      const toggle = event.target.closest("[data-blog-comment-toggle]");
      if (toggle) {
        const replies = $(`[data-blog-comment-replies="${toggle.dataset.blogCommentToggle}"]`, root);
        if (replies) { replies.hidden = !replies.hidden; toggle.textContent = replies.hidden ? "Ver respostas" : "Ocultar respostas"; }
        return;
      }
      const reply = event.target.closest("[data-blog-comment-reply]");
      if (reply) {
        const comment = $(`[data-blog-comment-id="${reply.dataset.blogCommentReply}"]`, root);
        if (!comment || $("[data-blog-reply-form]", comment)) return;
        comment.insertAdjacentHTML("beforeend", state.session ? '<form class="comment-form comment-reply-form" data-blog-reply-form><textarea name="body" maxlength="1000" required placeholder="Escreva uma resposta..."></textarea><button class="small-btn" type="submit">Responder</button></form>' : '<p class="section-subtitle">Entre para responder.</p>');
      }
    });
    root.addEventListener("submit", async event => {
      const form = event.target.closest("[data-blog-comment-form], [data-blog-reply-form]");
      if (!form) return;
      event.preventDefault();
      if (!state.session?.user?.id) return openAuthPage();
      const body = String(new FormData(form).get("body") || "").trim();
      if (!body) return;
      const parentId = Number(form.closest("[data-blog-comment-id]")?.dataset.blogCommentId) || null;
      const optimisticId = -Date.now();
      const currentThread = state.blogCommentThreads.get(String(post.id)) || { comments: [], likedIds: new Set(), counts: new Map() };
      currentThread.comments = [...currentThread.comments, { id: optimisticId, parent_id: parentId, user_id: state.session.user.id, body, created_at: new Date().toISOString(), profiles: { ...(state.profile || {}), username: state.profile?.username || state.session.user.user_metadata?.username || "usuário" } }];
      state.blogCommentThreads.set(String(post.id), currentThread);
      renderBlogCommentThread(list, currentThread);
      linkCommentMentions(list);
      state.blogCommentCounts.set(String(post.id), currentThread.comments.length);
      form.reset();
      if (parentId) form.remove();
      const button = $("button", form); if (button) button.disabled = true;
      const result = await sb.from("blog_comments").insert({ blog_id: post.id, user_id: state.session.user.id, parent_id: parentId, body });
      if (result.error) { toast(commentWriteError(result.error)); await refresh(); }
      else await refresh();
      if (button) button.disabled = false;
    });
  }

  async function loadBlogCommentsSection(post, section) {
    const list = $(".blog-inline-comments-list", section);
    if (!list) return;
    const thread = await loadBlogCommentThread(post);
    state.blogCommentThreads.set(String(post.id), thread);
    renderBlogCommentThread(list, thread);
    linkCommentMentions(list);
    state.blogCommentCounts.set(String(post.id), thread.comments?.length || 0);
    bindBlogCommentThread(section, post, list, () => loadBlogCommentsSection(post, section));
  }

  function renderBlogEditor() {
    if (!state.session) return `<div class="notice">Entre na sua conta para escrever e publicar um blog.</div><button class="btn btn-danger" data-action="open-auth">Entrar</button>`;
    const staff = ["moderator", "admin"].includes(state.profile?.plan);
    return `<form id="blog-form" class="blog-editor-form"><div class="field"><label>Título</label><input name="title" maxlength="140" required placeholder="Título da sua publicação"></div><div class="field"><label>Resumo</label><textarea name="excerpt" maxlength="500" rows="3" placeholder="Uma chamada curta para os cards da aba Blogs"></textarea></div><div class="blog-image-fields"><div class="field"><label>Capa principal</label><input name="cover" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></div><div class="field"><label>Imagem lateral 1</label><input name="image2" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></div><div class="field"><label>Imagem lateral 2</label><input name="image3" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></div></div><div class="field"><label>Conteúdo</label><div class="blog-toolbar"><button type="button" data-blog-command="bold"><b>B</b></button><button type="button" data-blog-command="italic"><i>I</i></button><button type="button" data-blog-command="underline"><u>U</u></button><button type="button" data-blog-command="formatBlock" data-blog-value="h2">Título</button><button type="button" data-blog-command="formatBlock" data-blog-value="blockquote">Citação</button><button type="button" data-blog-command="insertUnorderedList">Lista</button><button type="button" data-blog-command="createLink">Link</button></div><div id="blog-editor" class="blog-editor" contenteditable="true" data-placeholder="Escreva sua notícia, análise ou história..."></div></div>${staff ? `<label class="checkbox-inline"><input name="isFeatured" type="checkbox"> Destacar na aba Blogs</label>` : ""}<div class="modal-actions"><button type="submit" class="btn btn-danger">Publicar blog</button></div></form>`;
  }

  function renderBlogPostPage(post) {
    const author = post.author || {};
    const staff = ["moderator", "admin"].includes(state.profile?.plan);
    const canDelete = staff || state.session?.user?.id === post.author_id;
    return `<div class="content blog-post-page"><div class="section-head"><div><div class="eyebrow">${post.is_featured ? "Blog em destaque" : "Blog"}</div><h1 class="section-title">${escapeHTML(post.title)}</h1><div class="section-subtitle">@${escapeHTML(author.username || "usuário")} · ${escapeHTML(blogDate(post.published_at || post.created_at))}</div></div><button class="small-btn" data-blog-back>Voltar aos blogs</button></div><div class="blog-post-gallery"><div class="blog-post-cover ${post.cover_url ? "has-image" : ""}" ${blogImageStyle(post.cover_url)}></div><div class="blog-post-side"><div class="blog-post-side-image ${post.image_2_url ? "has-image" : ""}" ${blogImageStyle(post.image_2_url)}></div><div class="blog-post-side-image ${post.image_3_url ? "has-image" : ""}" ${blogImageStyle(post.image_3_url)}></div></div></div>${post.excerpt ? `<p class="blog-post-excerpt">${escapeHTML(post.excerpt)}</p>` : ""}<article class="blog-post-content">${safeBlogHtml(post.content_html)}</article>${blogEngagementMarkup(post)}${staff ? `<button class="small-btn" data-blog-feature="${escapeHTML(post.id)}" data-blog-featured="${post.is_featured ? "true" : "false"}">${post.is_featured ? "Remover destaque" : "Destacar blog"}</button>` : ""}${canDelete ? `<button class="small-btn danger blog-delete-button" data-blog-delete="${escapeHTML(post.id)}">Apagar blog</button>` : ""}${blogAuthorMarkup(post)}</div>`;
  }

  function renderBlogsPage() {
    if (state.blogOpenId) {
      const post = state.blogPosts.find(item => String(item.id) === String(state.blogOpenId));
      if (post) return renderBlogPostPage(post);
    }
    const featured = state.blogPosts.filter(post => post.is_featured);
    const recent = state.blogPosts.filter(post => !post.is_featured);
    return `<div class="content blogs-page"><div class="section-head"><div><div class="eyebrow">Comunidade</div><h1 class="section-title">Blogs</h1><div class="section-subtitle">Notícias, análises e histórias publicadas pelos leitores.</div></div><button class="btn btn-danger" data-blog-tab="escrever">Escrever blog</button></div><div class="blog-tabs"><button class="small-btn ${state.blogTab === "recentes" ? "is-active" : ""}" data-blog-tab="recentes">Recentes</button><button class="small-btn ${state.blogTab === "escrever" ? "is-active" : ""}" data-blog-tab="escrever">Escrever</button></div>${state.blogTab === "escrever" ? renderBlogEditor() : state.blogLoading ? '<div class="empty">Carregando blogs...</div>' : state.blogError ? `<div class="empty">${escapeHTML(state.blogError)}</div>` : `${featured.length ? `<section class="section"><div class="section-head"><div><h2 class="section-title">Em destaque</h2><div class="section-subtitle">Publicações selecionadas pela equipe.</div></div></div><div class="blog-grid blog-featured-grid">${featured.map(post => blogCard(post, true)).join("")}</div></section>` : ""}<section class="section"><div class="section-head"><div><h2 class="section-title">Recentes</h2><div class="section-subtitle">As últimas publicações da comunidade.</div></div></div><div class="blog-grid">${recent.map(post => blogCard(post)).join("") || '<div class="empty">Ainda não há blogs publicados.</div>'}</div></section>`}</div>`;
  }

  function publisherKey(value = "") {
    return String(value).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "sem-editora";
  }

  function skipCoverStorageKey(userId = state.session?.user?.id) {
    return userId ? `bancaDigitalSkipCover:${userId}` : "";
  }

  function shouldSkipCover() {
    const key = skipCoverStorageKey();
    return Boolean(key && localStorage.getItem(key) === "true");
  }

  function saveSkipCoverPreference(value) {
    const key = skipCoverStorageKey();
    if (!key) return;
    if (value) localStorage.setItem(key, "true");
    else localStorage.removeItem(key);
  }

  function avatarMarkup(profile, className = "profile-avatar") {
    const planClass = profile?.plan === "admin" ? "avatar-admin" : profile?.plan === "moderator" ? "avatar-moderator" : profile?.plan === "premium" ? "avatar-premium" : "";
    return `<img class="${className} ${planClass}" src="${escapeHTML(profile?.avatar_url || DEFAULT_AVATAR_URL)}" alt="Foto de ${escapeHTML(profile?.username || "usuário")}">`;
  }

  function syncTopAvatar() {
    const headerAvatar = $(".avatar");
    if (!headerAvatar) return;
    headerAvatar.innerHTML = avatarMarkup(state.profile, "top-avatar-img");
    headerAvatar.title = state.session ? "Abrir minha estante" : "Entrar ou abrir minha estante";
    headerAvatar.classList.toggle("avatar-admin", state.profile?.plan === "admin");
    headerAvatar.classList.toggle("avatar-moderator", state.profile?.plan === "moderator");
    headerAvatar.classList.toggle("avatar-premium", state.profile?.plan === "premium");
  }

  function appAssetUrl(path) {
    return new URL(String(path).replace(/^\/+/, ""), document.baseURI).href;
  }

  let libarchiveModulePromise = null;
  function loadLibarchiveModule() {
    if (!libarchiveModulePromise) {
      libarchiveModulePromise = import(appAssetUrl("libarchive/libarchive.js")).catch(error => {
        libarchiveModulePromise = null;
        throw error;
      });
    }
    return libarchiveModulePromise;
  }

  function publicProfileHref(username, collectionId = "") {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("perfil", cleanUsername(username));
    if (collectionId) url.searchParams.set("lista", collectionId);
    return `${url.pathname}?${url.searchParams.toString()}`;
  }

  async function loadCoverCatalog() {
    if (!sb) return;
    const result = await sb.from("comic_cover_variants").select("item_id, variant_key, label, cover_url, source_url").order("label", { ascending: true });
    if (result.error) {
      state.coverVariants = new Map();
      return;
    }
    state.coverVariants = (result.data || []).reduce((map, variant) => {
      if (!map.has(variant.item_id)) map.set(variant.item_id, []);
      map.get(variant.item_id).push(variant);
      return map;
    }, new Map());
  }

  async function loadCoverChoices(userId) {
    if (!sb || !userId) {
      state.coverChoices = new Map();
      return;
    }
    const result = await sb.from("user_cover_choices").select("item_id, variant_key, label, cover_url").eq("user_id", userId);
    state.coverChoices = result.error ? new Map() : new Map((result.data || []).map(choice => [choice.item_id, choice]));
  }

  async function loadAccount() {
    if (!sb) {
      state.authReady = true;
      render();
      return;
    }
    const { data: { session } } = await sb.auth.getSession();
    state.session = session;
    await loadCoverCatalog();
    await loadCoverChoices(session?.user?.id);
    const publisherSettings = await sb.from("publisher_settings").select("publisher_key, publisher_name, cover_url, is_pinned");
    state.publisherSettings = new Map((publisherSettings.data || []).map(setting => [setting.publisher_key, setting]));
    const publicCollectionsResult = await sb.from("shelf_collections").select("id, owner_id, name, cover_url, item_ids, blog_ids, collection_type, is_featured").eq("is_public", true).limit(50);
    const publicCollections = publicCollectionsResult.data || [];
    const collectionOwnerIds = [...new Set(publicCollections.map(collection => collection.owner_id).filter(Boolean))];
    const collectionOwnersResult = collectionOwnerIds.length ? await sb.from("profiles").select("id, username").in("id", collectionOwnerIds) : { data: [] };
    const collectionOwners = new Map((collectionOwnersResult.data || []).map(profile => [profile.id, profile.username]));
    const collectionLikesResult = await sb.from("shelf_collection_likes").select("owner_id, collection_id");
    const collectionLikeCounts = (collectionLikesResult.data || []).reduce((counts, like) => {
      const key = `${like.owner_id}:${like.collection_id}`;
      counts.set(key, (counts.get(key) || 0) + 1);
      return counts;
    }, new Map());
    state.popularPublicCollections = publicCollections
      .map(collection => ({ ...collection, username: collectionOwners.get(collection.owner_id) || "", likes: collectionLikeCounts.get(`${collection.owner_id}:${collection.id}`) || 0 }))
      .filter(collection => collection.username)
      .sort((a, b) => b.likes - a.likes || String(a.name).localeCompare(String(b.name), "pt-BR"))
      .slice(0, 8);
    const publicCollectionView = publicCollections.map(collection => ({ ...collection, username: collectionOwners.get(collection.owner_id) || "" })).filter(collection => collection.username);
    state.featuredComicCollections = publicCollectionView.filter(collection => collection.collection_type !== "blog" && collection.is_featured).slice(0, 8);
    state.featuredBlogCollections = publicCollectionView.filter(collection => collection.collection_type === "blog" && collection.is_featured).slice(0, 8);
    const comicLikes = await sb.from("comic_likes").select("item_id, user_id");
    state.comicLikeIds = new Set((comicLikes.data || []).filter(row => row.user_id === session?.user?.id).map(row => row.item_id));
    state.comicLikeCounts = (comicLikes.data || []).reduce((counts, row) => counts.set(row.item_id, (counts.get(row.item_id) || 0) + 1), new Map());
    if (session?.user) {
      const profile = await sb.from("profiles").select("*").eq("id", session.user.id).single();
      state.profile = profile.data;
      const ownFollowers = await sb.from("profile_follows").select("follower_id").eq("following_id", session.user.id);
      const ownFollowing = await sb.from("profile_follows").select("following_id").eq("follower_id", session.user.id);
      state.followerCount = (ownFollowers.data || []).length;
      state.followingCount = (ownFollowing.data || []).length;
      if (state.profile?.is_banned && !["moderator", "admin"].includes(state.profile.plan)) {
        await sb.auth.signOut();
        state.session = null;
        state.profile = null;
        render();
        return toast("Sua conta está banida.");
      }
      const collections = await sb.from("shelf_collections").select("id, name, cover_url, is_public, item_ids, collection_type, blog_ids, is_featured").eq("owner_id", session.user.id).order("created_at", { ascending: true });
      state.shelfCategories = (collections.data || []).filter(collection => collection.collection_type !== "blog").map(collection => ({ id: collection.id, name: collection.name, coverUrl: collection.cover_url || "", isPublic: collection.is_public !== false, is_featured: collection.is_featured === true, itemIds: Array.isArray(collection.item_ids) ? collection.item_ids : [] }));
      state.blogShelfCategories = (collections.data || []).filter(collection => collection.collection_type === "blog").map(collection => ({ id: collection.id, name: collection.name, coverUrl: collection.cover_url || "", isPublic: collection.is_public !== false, is_featured: collection.is_featured === true, blogIds: Array.isArray(collection.blog_ids) ? collection.blog_ids : [] }));
      const authoredBlogs = await sb.from("blog_posts").select("id, author_id, title, excerpt, cover_url, image_2_url, image_3_url, status, is_featured, created_at, published_at").eq("author_id", session.user.id).eq("status", "published").order("published_at", { ascending: false });
      state.authoredBlogPosts = authoredBlogs.data || [];
      const blogSaves = await sb.from("blog_saves").select("blog_id").eq("user_id", session.user.id);
      state.blogSaveIds = new Set((blogSaves.data || []).map(row => String(row.blog_id)));
      const savedBlogIds = [...state.blogSaveIds];
      const savedBlogs = savedBlogIds.length ? await sb.from("blog_posts").select("id, author_id, title, excerpt, cover_url, image_2_url, image_3_url, status, is_featured, created_at, published_at").in("id", savedBlogIds).eq("status", "published") : { data: [] };
      state.savedBlogPosts = savedBlogs.data || [];
      const favorites = await sb.from("favorites").select("item_id").eq("user_id", session.user.id);
      state.favoriteIds = new Set((favorites.data || []).map(row => row.item_id));
      const progress = await sb.from("reading_progress").select("item_id, page, total_pages, completed, updated_at").eq("user_id", session.user.id);
      state.readingProgress = new Map((progress.data || []).map(row => [row.item_id, row]));
      state.shelfSnapshot = { saved: new Set(state.favoriteIds), read: new Set([...state.readingProgress.entries()].filter(([, row]) => row.completed).map(([id]) => id)) };
      const achievements = await sb.from("user_achievements").select("achievements(name, description, icon)").eq("user_id", session.user.id);
      state.achievements = (achievements.data || []).map(row => row.achievements).filter(Boolean);
      await sb.rpc("touch_profile");
    }
    await loadNotifications();
    state.authReady = true;
    syncTopAvatar();
    render();
  }

  async function loadNotifications() {
    if (!sb || !state.session?.user?.id) {
      state.notificationChannel?.unsubscribe?.();
      state.notificationChannel = null;
      state.notifications = [];
      state.notificationUnreadCount = 0;
      return;
    }
    const result = await sb.from("notifications").select("id, actor_id, type, title, body, href, metadata, read_at, created_at").eq("user_id", state.session.user.id).order("created_at", { ascending: false }).limit(100);
    if (result.error) {
      state.notifications = [];
      state.notificationUnreadCount = 0;
      return;
    }
    const actorIds = [...new Set((result.data || []).map(notification => notification.actor_id).filter(Boolean))];
    const actorsResult = actorIds.length
      ? await sb.from("profiles").select("id, username, avatar_url, title, title_color, plan").in("id", actorIds)
      : { data: [] };
    const actors = new Map((actorsResult.data || []).map(actor => [actor.id, actor]));
    state.notifications = (result.data || [])
      .map(notification => ({ ...notification, actor: actors.get(notification.actor_id) || null }))
      .filter(notification => !isNotificationFromOpenChat(notification));
    state.notificationUnreadCount = state.notifications.filter(notification => !notification.read_at).length;
    if (!state.notificationChannel) {
      state.notificationChannel = sb.channel("notifications-" + state.session.user.id).on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: "user_id=eq." + state.session.user.id }, async payload => {
        if (isNotificationFromOpenChat(payload?.new || {})) {
          await markChatNotificationsRead(payload.new.actor_id);
        }
        await loadNotifications();
        render();
      }).subscribe();
    }
  }

  function isNotificationFromOpenChat(notification) {
    return Boolean(
      state.chatContact?.id &&
      notification.type === "message" &&
      String(notification.actor_id) === String(state.chatContact.id)
    );
  }

  async function markChatNotificationsRead(contactId) {
    if (!sb || !state.session?.user?.id || !contactId) return;
    const result = await sb.from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", state.session.user.id)
      .eq("actor_id", contactId)
      .eq("type", "message")
      .is("read_at", null);
    if (result.error) console.warn("NÃ£o foi possÃ­vel marcar as notificaÃ§Ãµes da conversa como lidas:", result.error.message);
  }

  async function loadPublicProfile(username, collectionId = null) {
    state.publicProfile = { loading: true, username, collectionId };
    state.publicShelfTab = "comics";
    state.collectionFilter = { field: "all", query: "" };
    state.section = "public-profile";
    render();
    if (!sb) {
      state.publicProfile = { error: "A autenticação ainda não foi configurada.", username };
      render();
      return;
    }
    let profile = await sb.from("profiles").select("id, username, avatar_url, title, title_color, plan, shelf_saved_public, shelf_series_public, shelf_read_public, shelf_completed_public, shelf_liked_public, shelf_blogs_public, profile_hidden, is_banned, silenced_until").ilike("username", username).maybeSingle();
    if (profile.error) {
      profile = await sb.from("profiles").select("id, username, avatar_url, title, plan").ilike("username", username).maybeSingle();
    }
    if (profile.error || !profile.data) {
      state.publicProfile = { error: "Perfil não encontrado.", username };
      render();
      return;
    }
    const favorites = await sb.from("favorites").select("item_id").eq("user_id", profile.data.id);
    const progress = await sb.from("reading_progress").select("item_id, page, total_pages, completed, updated_at").eq("user_id", profile.data.id);
    const comicLikes = await sb.from("comic_likes").select("item_id").eq("user_id", profile.data.id);
    const collections = await sb.from("shelf_collections").select("id, name, cover_url, is_public, item_ids, collection_type, blog_ids, is_featured").eq("owner_id", profile.data.id).order("created_at", { ascending: true });
    const authoredBlogs = await sb.from("blog_posts").select("id, author_id, title, excerpt, cover_url, image_2_url, image_3_url, status, is_featured, created_at, published_at").eq("author_id", profile.data.id).eq("status", "published").order("published_at", { ascending: false });
    const publicCollectionBlogIds = [...new Set((collections.data || []).filter(collection => collection.collection_type === "blog" && collection.is_public !== false).flatMap(collection => Array.isArray(collection.blog_ids) ? collection.blog_ids : []))];
    const collectionBlogs = publicCollectionBlogIds.length ? await sb.from("blog_posts").select("id, author_id, title, excerpt, cover_url, image_2_url, image_3_url, status, is_featured, created_at, published_at").in("id", publicCollectionBlogIds).eq("status", "published") : { data: [] };
    const publicBlogSaves = profile.data.shelf_blogs_public !== false ? await sb.from("blog_saves").select("blog_id").eq("user_id", profile.data.id) : { data: [] };
    const publicSavedBlogIds = (publicBlogSaves.data || []).map(row => row.blog_id);
    const savedBlogs = publicSavedBlogIds.length ? await sb.from("blog_posts").select("id, author_id, title, excerpt, cover_url, image_2_url, image_3_url, status, is_featured, created_at, published_at").in("id", publicSavedBlogIds).eq("status", "published") : { data: [] };
    const achievements = await sb.from("user_achievements").select("achievements(name, description, icon)").eq("user_id", profile.data.id);
    const likes = await sb.from("shelf_collection_likes").select("collection_id, user_id").eq("owner_id", profile.data.id);
    const followers = await sb.from("profile_follows").select("follower_id").eq("following_id", profile.data.id);
    const following = await sb.from("profile_follows").select("following_id").eq("follower_id", profile.data.id);
    const isFollowing = state.session?.user?.id ? (followers.data || []).some(row => row.follower_id === state.session.user.id) : false;
    const moderationHistory = ["moderator", "admin"].includes(state.profile?.plan)
      ? await sb.from("moderation_actions").select("id, actor_id, action, duration_until, details, created_at").eq("target_id", profile.data.id).order("created_at", { ascending: false })
      : { data: [] };
    const actorIds = [...new Set((moderationHistory.data || []).map(entry => entry.actor_id).filter(Boolean))];
    const actors = actorIds.length ? await sb.from("profiles").select("id, username").in("id", actorIds) : { data: [] };
    const actorNames = new Map((actors.data || []).map(actor => [actor.id, actor.username]));
    const collectionLikes = new Set((likes.data || []).filter(row => row.user_id === state.session?.user?.id).map(row => row.collection_id));
    const collectionLikeCounts = (likes.data || []).reduce((counts, row) => counts.set(row.collection_id, (counts.get(row.collection_id) || 0) + 1), new Map());
    const publicCoverChoicesResult = ["premium", "moderator", "admin"].includes(profile.data.plan)
      ? await sb.from("user_cover_choices").select("item_id, variant_key, label, cover_url").eq("user_id", profile.data.id)
      : { data: [] };
    const publicCoverChoices = new Map((publicCoverChoicesResult.data || []).map(choice => [choice.item_id, choice]));
    state.publicProfile = {
      profile: profile.data,
      collectionId,
      collections: (collections.data || []).filter(collection => collection.collection_type !== "blog").map(collection => ({ id: collection.id, name: collection.name, coverUrl: collection.cover_url || "", isPublic: collection.is_public !== false, is_featured: collection.is_featured === true, itemIds: Array.isArray(collection.item_ids) ? collection.item_ids : [] })),
      blogCollections: (collections.data || []).filter(collection => collection.collection_type === "blog").map(collection => ({ id: collection.id, name: collection.name, coverUrl: collection.cover_url || "", isPublic: collection.is_public !== false, is_featured: collection.is_featured === true, blogIds: Array.isArray(collection.blog_ids) ? collection.blog_ids : [] })),
      authoredBlogPosts: authoredBlogs.data || [],
      savedBlogPosts: savedBlogs.data || [],
      collectionBlogPosts: collectionBlogs.data || [],
      favoriteIds: new Set((favorites.data || []).map(row => row.item_id)),
      comicLikeIds: new Set((comicLikes.data || []).map(row => row.item_id)),
      readingProgress: new Map((progress.data || []).map(row => [row.item_id, row])),
      achievements: (achievements.data || []).map(row => row.achievements).filter(Boolean),
      collectionLikes,
      collectionLikeCounts,
      coverChoices: publicCoverChoices
      ,moderationHistory: (moderationHistory.data || []).map(entry => ({ ...entry, actor_username: actorNames.get(entry.actor_id) || "moderador" }))
      ,isFollowing
      ,followerCount: (followers.data || []).length
      ,followingCount: (following.data || []).length
    };
    render();
  }

  async function signOut() {
    await sb?.auth.signOut();
    state.notificationChannel?.unsubscribe?.();
    state.notificationChannel = null;
    clearLocalBox();
    state.localBoxVisible = false;
    state.session = null; state.profile = null; state.favoriteIds = new Set(); state.readingProgress = new Map(); state.shelfSnapshot = null; state.shelfCategories = []; state.comicLikeIds = new Set(); state.achievements = []; state.achievementChecks = new Set();
    state.notifications = [];
    state.notificationUnreadCount = 0;
    state.section = "home"; render(); toast("Você saiu da conta.");
  }

  function clearLocalBox() {
    state.localBoxFiles.forEach(file => file.fileUrl && URL.revokeObjectURL(file.fileUrl));
    state.localBoxFiles = [];
  }

  function localFileFrom(file) {
    const name = file.name.replace(/\\/g, "/").split("/").pop();
    const title = name.replace(/\.(pdf|cbz|cbr|jpg|jpeg|png|webp|gif)$/i, "");
    return { id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`, title, issue: "", type: "comic", year: "", format: extension(name), file, fileUrl: URL.createObjectURL(file), local: true, clicks: 0 };
  }

  function supportedLocalFile(file) {
    return /\.(pdf|cbz|cbr|jpg|jpeg|png|webp|gif)$/i.test(file.name);
  }

  function openLocalFile(file, keepInBox = false) {
    if (!file || !supportedLocalFile(file)) return toast("Escolha um PDF, CBZ, CBR ou uma imagem.");
    const item = localFileFrom(file);
    if (keepInBox) {
      state.localBoxFiles.push(item);
      render();
      toast("Pasta adicionada à Minha caixa. Ela ficará disponível apenas nesta sessão.");
      return;
    }
    openReader(item, { localObjectUrl: item.fileUrl });
  }

  function ensureShelfSnapshot() {
    if (!state.shelfSnapshot) state.shelfSnapshot = { saved: new Set(state.favoriteIds), read: new Set([...state.readingProgress.entries()].filter(([, row]) => row.completed).map(([id]) => id)) };
    return state.shelfSnapshot;
  }

  function rememberShelfItem(kind, itemId) {
    ensureShelfSnapshot()[kind].add(itemId);
  }

  async function toggleFavorite(itemId) {
    if (!state.session) return openAuthPage();
    if (state.favoriteIds.has(itemId)) {
      await sb.from("favorites").delete().eq("user_id", state.session.user.id).eq("item_id", itemId);
      state.favoriteIds.delete(itemId);
    } else {
      await sb.from("favorites").insert({ user_id: state.session.user.id, item_id: itemId });
      state.favoriteIds.add(itemId);
      rememberShelfItem("saved", itemId);
      awardAchievement("first_favorite");
    }
    updateFavoriteButtons(itemId);
    render();
  }

  async function toggleSeriesFavorite(seriesId) {
    if (!state.session) return openAuthPage();
    const saved = state.favoriteIds.has(seriesId);
    const result = saved
      ? await sb.from("favorites").delete().eq("user_id", state.session.user.id).eq("item_id", seriesId)
      : await sb.from("favorites").insert({ user_id: state.session.user.id, item_id: seriesId });
    if (result.error) return toast("Não foi possível atualizar as séries salvas.");
    if (saved) state.favoriteIds.delete(seriesId);
    else { state.favoriteIds.add(seriesId); rememberShelfItem("saved", seriesId); awardAchievement("first_favorite"); }
    render();
  }

  function openCoverChoice(itemId) {
    if (!state.session) return openAuthPage();
    if (!["premium", "moderator", "admin"].includes(state.profile?.plan)) return toast("A escolha de capas variantes é exclusiva para usuários Premium, moderadores e administradores.");
    if (!state.favoriteIds.has(itemId)) return toast("Salve o quadrinho na estante antes de escolher uma capa.");
    const item = state.db.library.find(entry => entry.id === itemId);
    if (!item) return;
    const current = state.coverChoices.get(itemId);
    const variants = state.coverVariants.get(itemId) || [];
    const options = [{ variant_key: "__default", label: "Capa principal", cover_url: item.coverUrl || "" }, ...variants];
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal cover-choice-modal"><div class="section-head"><div><h2>Escolher capa</h2><div class="section-subtitle">${escapeHTML(itemDisplayTitle(item))}</div></div><button class="small-btn" data-close>Fechar</button></div><form id="cover-choice-form"><div class="cover-choice-options">${options.map(option => `<label class="cover-choice-option"><input type="radio" name="variantKey" value="${escapeHTML(option.variant_key)}" ${current?.variant_key === option.variant_key || (!current && option.variant_key === "__default") ? "checked" : ""}><img src="${escapeHTML(proxiedImageUrl(option.cover_url))}" alt=""><span>${escapeHTML(option.label)}</span></label>`).join("")}</div>${variants.length ? "" : '<div class="empty">Nenhuma capa variante foi cadastrada para esta edição.</div>'}<div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Salvar capa</button></div></form></div>`;
    $("#modal-root").appendChild(overlay);
    $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#cover-choice-form", overlay).onsubmit = async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const selectedKey = String(form.get("variantKey") || "__default");
      let choice = variants.find(option => option.variant_key === selectedKey);
      if (selectedKey === "__default") {
        const result = await sb.from("user_cover_choices").delete().eq("user_id", state.session.user.id).eq("item_id", itemId);
        if (result.error) return toast(result.error.message);
        state.coverChoices.delete(itemId);
      } else if (choice) {
        const result = await sb.from("user_cover_choices").upsert({ user_id: state.session.user.id, item_id: itemId, variant_key: choice.variant_key, label: choice.label, cover_url: choice.cover_url, updated_at: new Date().toISOString() }, { onConflict: "user_id,item_id" });
        if (result.error) return toast(result.error.message);
        state.coverChoices.set(itemId, { item_id: itemId, ...choice });
      } else return toast("Essa capa variante não está cadastrada para esta edição.");
      overlay.remove();
      render();
      toast("Capa atualizada.");
    };
  }

  function updateFavoriteButtons(itemId) {
    const favorite = state.favoriteIds.has(itemId);
    $$('[data-favorite]').filter(button => button.dataset.favorite === itemId).forEach(button => {
      button.classList.toggle("is-favorite", favorite);
      button.textContent = favorite ? "★" : "☆";
    });
  }

  function updateComicLikeButtons(itemId) {
    const liked = state.comicLikeIds.has(itemId);
    const count = state.comicLikeCounts.get(itemId) || 0;
    $$('[data-like-item]').filter(button => button.dataset.likeItem === itemId).forEach(button => {
      button.classList.toggle("is-liked", liked);
      button.textContent = `${liked ? "♥" : "♡"} ${count}`;
    });
  }

  async function toggleComicLike(itemId) {
    if (!state.session) return openAuthPage();
    const liked = state.comicLikeIds.has(itemId);
    const result = liked
      ? await sb.from("comic_likes").delete().eq("user_id", state.session.user.id).eq("item_id", itemId)
      : await sb.from("comic_likes").insert({ user_id: state.session.user.id, item_id: itemId });
    if (result.error) return toast("Não foi possível atualizar a curtida.");
    if (liked) {
      state.comicLikeIds.delete(itemId);
      state.comicLikeCounts.set(itemId, Math.max(0, (state.comicLikeCounts.get(itemId) || 1) - 1));
    } else {
      state.comicLikeIds.add(itemId);
      state.comicLikeCounts.set(itemId, (state.comicLikeCounts.get(itemId) || 0) + 1);
    }
    updateComicLikeButtons(itemId);
  }

  async function shareComic(itemId) {
    const item = state.db.library.find(entry => entry.id === itemId);
    if (!item) return;
    const link = new URL(routeUrl({ ler: item.id }), window.location.href).href;
    try {
      if (navigator.share) await navigator.share({ title: item.title || "Quadrinho", text: `Leia ${item.title || "este quadrinho"} na Banca Digital`, url: link });
      else { await navigator.clipboard.writeText(link); toast("Link do quadrinho copiado."); }
    } catch (error) {
      if (error?.name !== "AbortError") window.prompt("Copie o link do quadrinho:", link);
    }
  }

  function openAuthPage() { state.authMode = "login"; setSection("login"); }
  function openSignupPage() { state.authMode = "signup"; setSection("signup"); }

  function safeTitleColor(value) {
    return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? value : "#ffd45c";
  }

  function trophyRoom(achievements = []) {
    return `<div class="trophy-room"><div class="trophy-room-title">Sala de troféus</div><div class="achievement-list">${achievements.length ? achievements.map(a => `<span title="${escapeHTML(a.description || "")}">${escapeHTML(a.icon || "★")} ${escapeHTML(a.name)}</span>`).join("") : '<span class="trophy-empty">Nenhuma insígnia conquistada ainda.</span>'}</div></div>`;
  }

  function awardAchievement(key) {
    if (!state.session || !sb || state.achievementChecks.has(key)) return;
    state.achievementChecks.add(key);
    sb.rpc("award_achievement", { p_key: key }).then(result => {
      if (result.error) console.warn("Não foi possível atualizar a conquista:", result.error.message);
      else loadAccount();
    });
  }

  function progressFor(item, progressMap = state.readingProgress) {
    return progressMap?.get(item?.id) || null;
  }

  function isSeriesCompleted(item, progressMap = state.readingProgress) {
    const editions = seriesEditions(item);
    return Boolean(item?.seriesId && editions.length > 0 && editions.every(edition => progressMap?.get(edition.id)?.completed));
  }

  function completedSeriesItems(progressMap = state.readingProgress) {
    const seen = new Set();
    return state.db.library.filter(item => {
      if (!item.seriesId || seen.has(item.seriesId)) return false;
      seen.add(item.seriesId);
      return isSeriesCompleted(item, progressMap);
    });
  }

  function updateCompletionCards(item, completed) {
    $$('[data-open]').filter(element => element.dataset.open === item?.id).forEach(cardElement => {
      const existing = $(".card-completed", cardElement);
      if (completed && !existing) {
        const status = document.createElement("div");
        status.className = "card-completed";
        status.textContent = "✓ Lida";
        cardElement.querySelector(".card-body")?.before(status);
      } else if (!completed && existing) {
        existing.remove();
      }
    });
  }

  async function saveReadingProgress(item, page, totalPages) {
    if (!state.session || !sb || item?.local || !item?.id || !totalPages) return;
    const current = progressFor(item);
    const completed = Boolean(current?.completed) || page >= Math.max(1, totalPages - 2);
    const row = { user_id: state.session.user.id, item_id: item.id, page: Math.max(1, Math.min(page, totalPages)), total_pages: totalPages, completed, updated_at: new Date().toISOString() };
    state.readingProgress.set(item.id, row);
    if (completed) rememberShelfItem("read", item.id);
    $("[data-toggle-read]")?.replaceChildren(document.createTextNode(completed ? "Desmarcar como lida" : "Marcar como lida"));
    updateCompletionCards(item, completed);
    awardAchievement("first_read");
    if (isSeriesCompleted(item)) { awardAchievement("first_completed"); awardAchievement("five_completed"); }
    const result = await sb.from("reading_progress").upsert(row, { onConflict: "user_id,item_id" });
    if (result.error) console.warn("Não foi possível salvar o progresso de leitura:", result.error.message);
  }

  function toggleReadingCompleted(item, totalPages = progressFor(item)?.total_pages || 1) {
    if (!state.session || !sb || item?.local) return;
    const current = progressFor(item);
    const row = { user_id: state.session.user.id, item_id: item.id, page: current?.page || 1, total_pages: totalPages, completed: !current?.completed, updated_at: new Date().toISOString() };
    state.readingProgress.set(item.id, row);
    if (row.completed) rememberShelfItem("read", item.id);
    updateCompletionCards(item, row.completed);
    if (row.completed && isSeriesCompleted(item)) { awardAchievement("first_completed"); awardAchievement("five_completed"); }
    const result = sb.from("reading_progress").upsert(row, { onConflict: "user_id,item_id" });
    result.then(response => { if (response.error) console.warn("Não foi possível atualizar o status de leitura:", response.error.message); });
  }

  const coverMemoryCache = new Map();
  const coverLoading = new Map();
  const coverAbortControllers = new Map();

  function cancelCoverLoads() {
    for (const controller of coverAbortControllers.values()) controller.abort();
    coverAbortControllers.clear();
    coverLoading.clear();
    $$('[data-cover-id]').forEach(element => {
      const maxWidth = element.classList.contains("hero-bg") || element.classList.contains("hero-cover") ? 1200 : 480;
      if (!coverMemoryCache.has(`${element.dataset.coverId}:${maxWidth}`)) element.dataset.coverReady = "";
    });
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

  function openPasswordRecoveryModal() {
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `
      <div class="modal auth-modal">
        <div class="section-head">
          <div>
            <h2>Recuperar acesso</h2>
            <div class="section-subtitle">Informe o email associado à sua conta para receber o link de recuperação.</div>
          </div>
          <button class="small-btn" type="button" data-close>Fechar</button>
        </div>
        <form id="password-recovery-form">
          <div class="field">
            <label for="recovery-email">Email da conta</label>
            <input id="recovery-email" name="email" type="email" required placeholder="voce@email.com" autocomplete="email">
          </div>
          <div class="modal-actions">
            <button type="button" class="small-btn" data-close>Cancelar</button>
            <button class="btn btn-danger" type="submit">Enviar link</button>
          </div>
          <div class="auth-message" id="recovery-message"></div>
        </form>
        </form>
      </div>`;
    $("#modal-root").appendChild(overlay);
    $$("[data-close]", overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#recovery-email", overlay)?.focus();
    $("#password-recovery-form", overlay).addEventListener("submit", async event => {
      event.preventDefault();
      const email = String(new FormData(event.currentTarget).get("email") || "").trim();
      const message = $("#recovery-message", overlay);
      const submit = $('button[type="submit"]', event.currentTarget);
      submit.disabled = true;
      if (!sb) {
        message.textContent = "A autenticação ainda não foi configurada.";
        submit.disabled = false;
        return;
      }
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      const result = await sb.auth.resetPasswordForEmail(email, { redirectTo });
      if (result.error) {
        message.textContent = result.error.message;
        submit.disabled = false;
        return;
      }
      overlay.remove();
      toast("Enviamos o link de recuperação para o email informado.");
    });
  }

  function weightedRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function seriesKey(value = "") {
    return String(value).trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function issueSortValue(item) {
    const explicitOrder = Number(item?.sortOrder);
    if (Number.isFinite(explicitOrder)) return explicitOrder;
    const issueNumber = Number(String(item?.issue || "").match(/\d+(?:\.\d+)?/)?.[0]);
    return Number.isFinite(issueNumber) ? issueNumber : Number.MAX_SAFE_INTEGER;
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
    const editions = seriesEditions(item);
    if (editions.length < 2) return openReader(item);
    openSeriesSelection(item, editions);
  }

  function seriesEditions(item) {
    if (!item?.seriesId) return [];
    return state.db.library.filter(x => x.seriesId === item.seriesId)
      .sort((a, b) => issueSortValue(a) - issueSortValue(b));
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
    state.collectionFilter = { field: "all", query: "" };
    navigate({ pagina: "entidade", tipo: kind, valor: value });
  }

  async function attachComments(item, overlay) {
    if (!sb) return;
    const panel = document.createElement("details");
    panel.className = "reader-comments";
    panel.innerHTML = `<div class="section-head"><h3>Comentários</h3></div><div class="comments-list"><span class="section-subtitle">Carregando...</span></div>${state.session ? '<form class="comment-form"><textarea name="body" maxlength="1000" required placeholder="Escreva um comentário..."></textarea><button class="small-btn">Comentar</button></form>' : '<p class="section-subtitle">Entre para comentar.</p>'}`;
    const summary = document.createElement("summary");
    summary.textContent = "Comentários";
    const content = document.createElement("div");
    content.className = "comments-content";
    while (panel.firstChild) content.appendChild(panel.firstChild);
    panel.append(summary, content);
    $(".comment-form button", panel)?.setAttribute("type", "submit");
    overlay.appendChild(panel);
    const list = $(".comments-list", panel);
    const refresh = async () => {
      const result = await sb.from("comments").select("id, body, created_at, profiles(username, avatar_url, title, plan)").eq("item_id", item.id).order("created_at", { ascending: false });
      if (result.error) {
        list.innerHTML = '<span class="section-subtitle">Não foi possível carregar os comentários.</span>';
        return;
      }
      list.innerHTML = (result.data || []).map(comment => {
        const username = cleanUsername(comment.profiles?.username || "usuário");
        const profile = { ...(comment.profiles || {}), username };
        return `<article class="comment"><div class="comment-author-row">${avatarMarkup(profile, "comment-avatar")}<div class="comment-author-info"><a class="comment-author" href="${publicProfileHref(username)}" target="_blank" rel="noopener">@${escapeHTML(username)}</a>${profile.title ? `<span class="comment-title">${escapeHTML(profile.title)}</span>` : ""}</div></div><p>${escapeHTML(comment.body)}</p></article>`;
      }).join("") || '<span class="section-subtitle">Nenhum comentário ainda.</span>';
    };
    await refresh();
    $(".comment-form", panel)?.addEventListener("submit", async event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const form = event.currentTarget;
      const body = String(new FormData(form).get("body") || "").trim();
      const button = $("button", form);
      if (!state.session?.user?.id) { toast("Entre na sua conta para comentar."); return; }
      if (!body) return;
      button.disabled = true;
      const result = await sb.from("comments").insert({ user_id: state.session.user.id, item_id: item.id, body });
      if (result.error) toast(result.error.message);
      else { awardAchievement("first_comment"); form.reset(); await refresh(); }
      button.disabled = false;
    });
  }

  async function openCommentsPopup(item) {
    if (!sb || !item?.id) return toast("Os comentários ainda não estão disponíveis.");
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop comments-modal-backdrop";
    overlay.innerHTML = `<div class="modal comments-modal"><div class="section-head"><div><h2>Comentários</h2><div class="section-subtitle">${escapeHTML(itemDisplayTitle(item))}</div></div><button class="small-btn" data-close>Fechar</button></div><div class="comments-list"><span class="section-subtitle">Carregando...</span></div>${state.session ? '<form class="comment-form"><textarea name="body" maxlength="1000" required placeholder="Escreva um comentário..."></textarea><button class="small-btn" type="submit">Comentar</button></form>' : '<p class="section-subtitle">Entre para comentar.</p>'}</div>`;
    $("#modal-root").appendChild(overlay);
    $("[data-close]", overlay).onclick = () => overlay.remove();
    const list = $(".comments-list", overlay);
    const titleButton = document.createElement("button");
    titleButton.type = "button";
    titleButton.className = "comment-item-title";
    titleButton.textContent = itemDisplayTitle(item);
    titleButton.title = "Abrir quadrinho";
    titleButton.onclick = () => { overlay.remove(); openReader(item); };
    $(".section-head .section-subtitle", overlay)?.replaceWith(titleButton);
    const refresh = async () => {
      const result = await sb.from("comments").select("id, body, created_at, profiles(username, avatar_url, title, plan)").eq("item_id", item.id).order("created_at", { ascending: false });
      if (result.error) { list.innerHTML = '<span class="section-subtitle">Não foi possível carregar os comentários.</span>'; return; }
      list.innerHTML = (result.data || []).map(comment => {
        const username = cleanUsername(comment.profiles?.username || "usuário");
        const profile = { ...(comment.profiles || {}), username };
        return `<article class="comment"><div class="comment-author-row">${avatarMarkup(profile, "comment-avatar")}<div class="comment-author-info"><a class="comment-author" href="${publicProfileHref(username)}" target="_blank" rel="noopener">@${escapeHTML(username)}</a>${profile.title ? `<span class="comment-title">${escapeHTML(profile.title)}</span>` : ""}</div></div><p>${escapeHTML(comment.body)}</p></article>`;
      }).join("") || '<span class="section-subtitle">Nenhum comentário ainda.</span>';
    };
    await refresh();
    $(".comment-form", overlay)?.addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const body = String(new FormData(form).get("body") || "").trim();
      if (!state.session?.user?.id || !body) return;
      const button = $("button", form); button.disabled = true;
      const result = await sb.from("comments").insert({ user_id: state.session.user.id, item_id: item.id, body });
      if (result.error) toast(result.error.message); else { form.reset(); await refresh(); }
      button.disabled = false;
    });
  }

  async function attachComments(item, overlay) {
    if (!sb) return;
    const panel = document.createElement("details");
    panel.className = "reader-comments";
    panel.innerHTML = `<summary>Comentários</summary><div class="comments-content"><div class="comments-list"><span class="section-subtitle">Carregando...</span></div>${state.session ? '<form class="comment-form"><textarea name="body" maxlength="1000" required placeholder="Escreva um comentário..."></textarea><button class="small-btn" type="submit">Comentar</button></form>' : '<p class="section-subtitle">Entre para comentar.</p>'}</div>`;
    overlay.appendChild(panel);
    const list = $(".comments-list", panel);
    const refresh = async () => {
      renderCommentThread(list, await loadCommentThread(item));
      linkCommentMentions(list);
    };
    bindCommentThread(panel, item, list, refresh);
    await refresh();
    $(".comment-form", panel)?.addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!state.session?.user?.id) return openAuthPage();
      const body = String(new FormData(form).get("body") || "").trim();
      if (!body) return;
      const button = $("button", form); button.disabled = true;
      const result = await sb.from("comments").insert({ user_id: state.session.user.id, item_id: item.id, body });
      if (result.error) toast(commentWriteError(result.error)); else { awardAchievement("first_comment"); form.reset(); await refresh(); }
      button.disabled = false;
    });
  }

  async function openCommentsPopup(item) {
    if (!sb || !item?.id) return toast("Os comentários ainda não estão disponíveis.");
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop comments-modal-backdrop";
    overlay.innerHTML = `<div class="modal comments-modal"><div class="section-head"><div><h2>Comentários</h2><div class="section-subtitle">${escapeHTML(item.title || "Quadrinho")}</div></div><button class="small-btn" data-close>Fechar</button></div><div class="comments-list"><span class="section-subtitle">Carregando...</span></div>${state.session ? '<form class="comment-form"><textarea name="body" maxlength="1000" required placeholder="Escreva um comentário..."></textarea><button class="small-btn" type="submit">Comentar</button></form>' : '<p class="section-subtitle">Entre para comentar.</p>'}</div>`;
    $("#modal-root").appendChild(overlay);
    $("[data-close]", overlay).onclick = () => overlay.remove();
    const list = $(".comments-list", overlay);
    const refresh = async () => {
      renderCommentThread(list, await loadCommentThread(item));
      linkCommentMentions(list);
    };
    const titleButton = document.createElement("button");
    titleButton.type = "button";
    titleButton.className = "comment-item-title";
    titleButton.textContent = itemDisplayTitle(item);
    titleButton.title = "Abrir quadrinho";
    titleButton.onclick = () => { overlay.remove(); openReader(item); };
    $(".section-head .section-subtitle", overlay)?.replaceWith(titleButton);
    bindCommentThread(overlay, item, list, refresh);
    await refresh();
    $(".comment-form", overlay)?.addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!state.session?.user?.id) return openAuthPage();
      const body = String(new FormData(form).get("body") || "").trim();
      if (!body) return;
      const button = $("button", form); button.disabled = true;
      const result = await sb.from("comments").insert({ user_id: state.session.user.id, item_id: item.id, body });
      if (result.error) toast(commentWriteError(result.error)); else { awardAchievement("first_comment"); form.reset(); await refresh(); }
      button.disabled = false;
    });
  }

  function formatCommentDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
  }

  function commentWriteError(error) {
    const message = String(error?.message || "");
    if (/row-level security|permission denied|comments/i.test(message)) return "Você está impedido de comentar no momento.";
    return "Não foi possível publicar o comentário.";
  }

  async function loadCommentThread(item) {
    let result = await sb.from("comments").select("id, parent_id, body, created_at, profiles(username, avatar_url, title, plan)").eq("item_id", item.id).order("created_at", { ascending: false });
    if (result.error && /parent_id|schema cache|column/i.test(result.error.message || "")) {
      const legacyResult = await sb.from("comments").select("id, body, created_at, profiles(username, avatar_url, title, plan)").eq("item_id", item.id).order("created_at", { ascending: false });
      result = { ...legacyResult, data: (legacyResult.data || []).map(comment => ({ ...comment, parent_id: null })) };
    }
    if (result.error) return { error: result.error };
    const comments = result.data || [];
    const likes = comments.length ? await sb.from("comment_likes").select("comment_id, user_id").in("comment_id", comments.map(comment => comment.id)) : { data: [] };
    const likedIds = new Set((likes.data || []).filter(row => row.user_id === state.session?.user?.id).map(row => row.comment_id));
    const counts = (likes.data || []).reduce((map, row) => map.set(row.comment_id, (map.get(row.comment_id) || 0) + 1), new Map());
    return { comments, likedIds, counts };
  }

  async function loadCommentThread(item) {
    let result = await sb.from("comments").select("id, parent_id, user_id, body, created_at").eq("item_id", item.id).order("created_at", { ascending: false });
    if (result.error && /parent_id|schema cache|column/i.test(result.error.message || "")) {
      const legacyResult = await sb.from("comments").select("id, user_id, body, created_at").eq("item_id", item.id).order("created_at", { ascending: false });
      result = { ...legacyResult, data: (legacyResult.data || []).map(comment => ({ ...comment, parent_id: null })) };
    }
    if (result.error) {
      console.error("[COMMENTS] Falha ao carregar comentários:", result.error);
      return { error: result.error };
    }
    const comments = result.data || [];
    const userIds = [...new Set(comments.map(comment => comment.user_id).filter(Boolean))];
    const profilesResult = userIds.length
      ? await sb.from("profiles").select("id, username, avatar_url, title, plan").in("id", userIds)
      : { data: [] };
    const profiles = new Map((profilesResult.data || []).map(profile => [profile.id, profile]));
    comments.forEach(comment => { comment.profiles = profiles.get(comment.user_id) || {}; });
    const likes = comments.length ? await sb.from("comment_likes").select("comment_id, user_id").in("comment_id", comments.map(comment => comment.id)) : { data: [] };
    const likedIds = new Set((likes.data || []).filter(row => row.user_id === state.session?.user?.id).map(row => row.comment_id));
    const counts = (likes.data || []).reduce((map, row) => map.set(row.comment_id, (map.get(row.comment_id) || 0) + 1), new Map());
    return { comments, likedIds, counts };
  }

  function commentMarkup(comment, childrenByParent, likedIds, likeCounts) {
    const username = cleanUsername(comment.profiles?.username || "usuário");
    const profile = { ...(comment.profiles || {}), username };
    const children = childrenByParent.get(comment.id) || [];
    const replies = children.map(child => commentMarkup(child, childrenByParent, likedIds, likeCounts)).join("");
    const canDelete = state.session?.user?.id === comment.user_id || ["moderator", "admin"].includes(state.profile?.plan);
    return `<article class="comment" data-comment-id="${comment.id}"><div class="comment-author-row">${avatarMarkup(profile, "comment-avatar")}<div class="comment-author-info"><a class="comment-author" href="${publicProfileHref(username)}" target="_blank" rel="noopener">@${escapeHTML(username)}</a>${profile.title ? `<span class="comment-title">${escapeHTML(profile.title)}</span>` : ""}</div></div><p>${escapeHTML(comment.body)}</p><div class="comment-actions"><button class="comment-action ${likedIds.has(comment.id) ? "is-liked" : ""}" data-comment-like="${comment.id}">♥ ${likeCounts.get(comment.id) || 0}</button><button class="comment-action" data-comment-reply="${comment.id}">Responder</button>${children.length ? `<button class="comment-action" data-comment-toggle="${comment.id}">Ver ${children.length} resposta${children.length === 1 ? "" : "s"}</button>` : ""}${canDelete ? `<button class="comment-action comment-delete-action" data-comment-delete="${comment.id}">Excluir</button>` : ""}<time class="comment-date" datetime="${escapeHTML(comment.created_at)}">${escapeHTML(formatCommentDate(comment.created_at))}</time></div><div class="comment-replies" data-comment-replies="${comment.id}" hidden>${replies}</div></article>`;
  }

  async function deleteComment(commentId, root, refresh) {
    if (!state.session?.user?.id || !window.confirm("Excluir este comentário e suas respostas?")) return;
    const result = await sb.from("comments").delete().eq("id", commentId);
    if (result.error) return toast("Não foi possível excluir o comentário.");
    await refresh();
  }

  function renderCommentThread(list, thread) {
    if (thread.error) {
      list.innerHTML = '<span class="section-subtitle">Não foi possível carregar os comentários.</span>';
      return;
    }
    const childrenByParent = new Map();
    thread.comments.forEach(comment => {
      if (!childrenByParent.has(comment.parent_id)) childrenByParent.set(comment.parent_id, []);
      childrenByParent.get(comment.parent_id).push(comment);
    });
    list.innerHTML = (childrenByParent.get(null) || []).map(comment => commentMarkup(comment, childrenByParent, thread.likedIds, thread.counts)).join("") || '<span class="section-subtitle">Nenhum comentário ainda.</span>';
  }

  function linkCommentMentions(root) {
    const mentionPattern = /@([A-Za-z0-9_]{3,24})/g;
    $$('p', root).forEach(paragraph => {
      const text = paragraph.textContent || "";
      let match;
      let cursor = 0;
      let hasMention = false;
      const fragment = document.createDocumentFragment();
      while ((match = mentionPattern.exec(text))) {
        hasMention = true;
        fragment.appendChild(document.createTextNode(text.slice(cursor, match.index)));
        const link = document.createElement("a");
        link.className = "comment-mention";
        link.href = publicProfileHref(match[1]);
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = match[0];
        fragment.appendChild(link);
        cursor = match.index + match[0].length;
      }
      if (!hasMention) return;
      fragment.appendChild(document.createTextNode(text.slice(cursor)));
      paragraph.replaceChildren(fragment);
    });
  }

  function bindCommentThread(root, item, list, refresh) {
    root.addEventListener("click", async event => {
      const likeButton = event.target.closest("[data-comment-like]");
      if (likeButton) {
        event.preventDefault();
        if (!state.session) return openAuthPage();
        const commentId = Number(likeButton.dataset.commentLike);
        const liked = likeButton.classList.contains("is-liked");
        const result = liked
          ? await sb.from("comment_likes").delete().eq("user_id", state.session.user.id).eq("comment_id", commentId)
          : await sb.from("comment_likes").insert({ user_id: state.session.user.id, comment_id: commentId });
        if (result.error) return toast("Não foi possível atualizar a curtida.");
        await refresh();
        return;
      }
      const deleteButton = event.target.closest("[data-comment-delete]");
      if (deleteButton) {
        event.preventDefault();
        await deleteComment(Number(deleteButton.dataset.commentDelete), root, refresh);
        return;
      }
      const toggle = event.target.closest("[data-comment-toggle]");
      if (toggle) {
        const replies = $(`[data-comment-replies="${toggle.dataset.commentToggle}"]`, root);
        if (replies) { replies.hidden = !replies.hidden; toggle.textContent = replies.hidden ? `Ver respostas` : "Ocultar respostas"; }
        return;
      }
      const reply = event.target.closest("[data-comment-reply]");
      if (reply) {
        const comment = $(`[data-comment-id="${reply.dataset.commentReply}"]`, root);
        if (!comment || $("[data-reply-form]", comment)) return;
        comment.insertAdjacentHTML("beforeend", state.session ? '<form class="comment-form comment-reply-form" data-reply-form><textarea name="body" maxlength="1000" required placeholder="Escreva uma resposta..."></textarea><button class="small-btn" type="submit">Responder</button></form>' : '<p class="section-subtitle">Entre para responder.</p>');
      }
    });
    root.addEventListener("submit", async event => {
      const form = event.target.closest("[data-reply-form]");
      if (!form) return;
      event.preventDefault();
      if (!state.session?.user?.id) return openAuthPage();
      const body = String(new FormData(form).get("body") || "").trim();
      if (!body) return;
      const parentId = Number(form.closest("[data-comment-id]")?.dataset.commentId);
      const button = $("button", form); button.disabled = true;
      const result = await sb.from("comments").insert({ user_id: state.session.user.id, item_id: item.id, parent_id: parentId, body });
      if (result.error) toast(commentWriteError(result.error)); else { form.remove(); await refresh(); }
      button.disabled = false;
    });
  }

  function openProfileSettings() {
    if (!state.session) return openAuthPage();
    const overlay = document.createElement("div"); overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal"><div class="section-head"><div><h2>Meu perfil</h2><div class="section-subtitle">Personalize seu @, sua foto e a visibilidade da estante</div></div><button class="small-btn" data-close>Fechar</button></div><form id="profile-form"><div class="form-grid"><div class="field full"><label>@usuário</label><input name="username" pattern="[A-Za-z0-9_]{3,24}" required value="${escapeHTML(state.profile?.username || "")}"></div><div class="field full"><label>Foto de perfil</label><input name="avatar" type="file" accept="image/png,image/jpeg,image/webp"></div>${["admin", "moderator", "premium"].includes(state.profile?.plan) ? `<div class="field full"><label>Visibilidade no perfil público</label><label class="checkbox-inline"><input name="shelfSavedPublic" type="checkbox" ${state.profile?.shelf_saved_public !== false ? "checked" : ""}> Mostrar coleção Salvos</label><label class="checkbox-inline"><input name="shelfSeriesPublic" type="checkbox" ${state.profile?.shelf_series_public !== false ? "checked" : ""}> Mostrar coleção Séries salvas</label><label class="checkbox-inline"><input name="shelfReadPublic" type="checkbox" ${state.profile?.shelf_read_public !== false ? "checked" : ""}> Mostrar coleção Lidos</label></div>` : ""}</div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Salvar perfil</button></div></form></div>`;
    $("#modal-root").appendChild(overlay); $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    const profileForm = $("#profile-form", overlay);
    if (!["admin", "moderator", "premium"].includes(state.profile?.plan)) $(".form-grid", overlay)?.insertAdjacentHTML("beforeend", `<div class="field full"><label class="checkbox-inline"><input name="shelfSeriesPublic" type="checkbox" ${state.profile?.shelf_series_public !== false ? "checked" : ""}> Mostrar coleção Séries salvas no perfil público</label></div>`);
    const shelfVisibilityField = $$(".field.full", overlay).find(field => field.textContent.includes("Visibilidade"));
    if (["admin", "moderator", "premium"].includes(state.profile?.plan) && shelfVisibilityField) {
      shelfVisibilityField.insertAdjacentHTML("beforeend", `<label class="checkbox-inline"><input name="shelfCompletedPublic" type="checkbox" ${state.profile?.shelf_completed_public !== false ? "checked" : ""}> Mostrar coleção Concluídos</label><label class="checkbox-inline"><input name="shelfLikedPublic" type="checkbox" ${state.profile?.shelf_liked_public !== false ? "checked" : ""}> Mostrar coleção Curtidos</label><label class="checkbox-inline"><input name="shelfBlogsPublic" type="checkbox" ${state.profile?.shelf_blogs_public !== false ? "checked" : ""}> Mostrar coleção Blogs</label>`);
    }
    profileForm.addEventListener("submit", async event => {
      if (!["admin", "moderator", "premium"].includes(state.profile?.plan)) return;
      const formData = new FormData(event.currentTarget);
      const visibility = { shelf_completed_public: formData.get("shelfCompletedPublic") === "on", shelf_liked_public: formData.get("shelfLikedPublic") === "on" };
      const likedVisibility = await sb.from("profiles").update(visibility).eq("id", state.session.user.id);
      if (likedVisibility.error) toast(likedVisibility.error.message);
      else {
        state.profile = { ...state.profile, ...visibility };
        render();
      }
    });
    const emailField = document.createElement("div");
    const currentEmail = state.session.user.email || "";
    const hasRecoveryEmail = currentEmail && !currentEmail.endsWith("@login.banca-digital.local");
    emailField.className = "field full profile-email-field";
    emailField.innerHTML = `<label>Email de recuperação <span class="field-optional">(opcional)</span></label><input name="email" type="email" placeholder="voce@email.com" autocomplete="email" value="${hasRecoveryEmail ? escapeHTML(currentEmail) : ""}"><small class="format-hint">Adicionar um email permite recuperar a conta e usá-lo para entrar depois.</small>`;
    $(".form-grid", profileForm).appendChild(emailField);
    const privacyField = document.createElement("div");
    privacyField.className = "field full profile-privacy-settings";
    privacyField.innerHTML = `<label>Privacidade e notificações</label><label class="checkbox-inline"><input name="likesPublic" type="checkbox" ${state.profile?.likes_public !== false ? "checked" : ""}> Mostrar minhas curtidas publicamente</label><label class="checkbox-inline"><input name="allowMentions" type="checkbox" ${state.profile?.allow_mentions !== false ? "checked" : ""}> Receber marcações</label><label class="checkbox-inline"><input name="allowMessages" type="checkbox" ${state.profile?.allow_messages !== false ? "checked" : ""}> Receber mensagens privadas</label><label class="checkbox-inline"><input name="notificationsEnabled" type="checkbox" ${state.profile?.notifications_enabled !== false ? "checked" : ""}> Receber notificações</label>`;
    $(".form-grid", profileForm).appendChild(privacyField);
    const originalProfileSubmit = profileForm.onsubmit;
    profileForm.onsubmit = async event => {
      event.preventDefault();
      const fd = new FormData(profileForm);
      const privacy = { likes_public: fd.get("likesPublic") === "on", allow_mentions: fd.get("allowMentions") === "on", allow_messages: fd.get("allowMessages") === "on", notifications_enabled: fd.get("notificationsEnabled") === "on" };
      const privacyUpdate = await sb.from("profiles").update(privacy).eq("id", state.session.user.id);
      if (privacyUpdate.error) return toast(privacyUpdate.error.message);
      state.profile = { ...state.profile, ...privacy };
      await originalProfileSubmit(event);
    };
    $("#profile-form", overlay).onsubmit = async event => { event.preventDefault(); const fd = new FormData(event.currentTarget); const username = cleanUsername(fd.get("username")); if (!/^[a-z0-9_]{3,24}$/.test(username)) return toast("@ inválido."); let avatar_url = state.profile?.avatar_url || null; const file = fd.get("avatar"); if (file?.size) { const path = `${state.session.user.id}/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "_")}`; const upload = await sb.storage.from("avatars").upload(path, file, { upsert: true }); if (upload.error) return toast(upload.error.message); avatar_url = sb.storage.from("avatars").getPublicUrl(path).data.publicUrl; } const eligible = ["admin", "moderator", "premium"].includes(state.profile?.plan); const preferences = eligible ? { shelf_saved_public: fd.get("shelfSavedPublic") === "on", shelf_series_public: fd.get("shelfSeriesPublic") === "on", shelf_read_public: fd.get("shelfReadPublic") === "on", shelf_completed_public: fd.get("shelfCompletedPublic") === "on", shelf_blogs_public: fd.get("shelfBlogsPublic") === "on" } : { shelf_series_public: fd.get("shelfSeriesPublic") === "on" }; const update = await sb.from("profiles").update({ username, avatar_url, ...preferences }).eq("id", state.session.user.id); if (update.error) return toast(update.error.message.includes("duplicate") ? "Esse @ já está em uso." : update.error.message); state.profile = { ...state.profile, username, avatar_url, ...preferences }; overlay.remove(); render(); toast("Perfil atualizado."); };
    $("#profile-form", overlay).addEventListener("submit", async event => {
      const email = String(new FormData(event.currentTarget).get("email") || "").trim().toLowerCase();
      if (!email) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast("Informe um email válido.");
      if (email !== currentEmail) {
        const result = await sb.auth.updateUser({ email });
        if (result.error) return toast(result.error.message);
      }
      const profileEmail = await sb.from("profiles").update({ account_email: email }).eq("id", state.session.user.id);
      if (profileEmail.error) return toast(profileEmail.error.message);
      state.session.user.email = email;
      toast(email === currentEmail ? "Email de recuperação salvo." : "Email atualizado. Verifique sua caixa de entrada para confirmar o endereço.");
    });
  }

  function openAchievementAdmin() {
    const overlay = document.createElement("div"); overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal"><div class="section-head"><div><h2>Distribuir título</h2><div class="section-subtitle">Títulos são frases personalizadas; as insígnias são conquistadas automaticamente.</div></div><button class="small-btn" data-close>Fechar</button></div><form id="achievement-form"><div class="form-grid"><div class="field full"><label>@ do usuário</label><input name="username" required placeholder="usuario"></div><div class="field full"><label>Frase do título</label><input name="title" placeholder="Leitor veterano"></div><div class="field full"><label>Cor de fundo</label><select name="titleColor"><option value="#000000">Preto</option><option value="#ffffff">Branco</option><option value="#e50914">Vermelho</option><option value="#2f80ed">Azul</option><option value="#27ae60">Verde</option><option value="#ffd45c" selected>Amarelo</option><option value="#8e44ad">Roxo</option><option value="#f2994a">Laranja</option></select></div></div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Salvar título</button></div></form></div>`;
    $("#modal-root").appendChild(overlay); $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#achievement-form", overlay).onsubmit = async event => { event.preventDefault(); const fd = new FormData(event.currentTarget); const username = cleanUsername(fd.get("username")); const title = String(fd.get("title") || "").trim(); const title_color = safeTitleColor(fd.get("titleColor")); const profile = await sb.from("profiles").select("id").eq("username", username).single(); if (profile.error) return toast("Usuário não encontrado."); let update = await sb.from("profiles").update({ title: title || null, title_color }).eq("id", profile.data.id); if (update.error && /title_color|schema cache/i.test(update.error.message)) update = await sb.from("profiles").update({ title: title || null }).eq("id", profile.data.id); if (update.error) return toast(update.error.message); if (state.profile?.id === profile.data.id) state.profile = { ...state.profile, title, title_color }; overlay.remove(); render(); toast("Título atualizado."); };
  }

  function openReader(item, options = {}) {
    if (!item) return;

    if (!item.local && !options.routeSync) {
      navigate({ ler: item.id });
      return;
    }

    activeReaderCleanup?.();
    activeReaderCleanup = null;

    recordComicRead(item);
    const isTelegramLink = (url) => /^https?:\/\/(www\.)?t(elegram)?\.me\//.test(url || "");

    // A URL direta (fileUrl) tem prioridade. Se não houver, usamos a 'telegramUrl'
    // somente se ela NÃO for um link real do Telegram (ou seja, é um caminho de arquivo).
    const resolvedUrl = item.fileUrl || (!isTelegramLink(item.telegramUrl) ? item.telegramUrl : "") || "";

    if (!resolvedUrl) {
      toast(item.telegramUrl ? "Links do Telegram não são suportados sem um servidor de ponte." : "Esta edição não tem uma URL de arquivo direto.");
      return;
    }

    const itemFormat = String(item.format || "").toLowerCase();
    const fileFormat = extension(item.file?.name || item.name || "");
    const format = /^(pdf|cbz|cbr|jpg|jpeg|png|webp|gif)$/.test(itemFormat)
      ? itemFormat
      : (fileFormat || extension(resolvedUrl)).toLowerCase();
    const skipCover = Object.prototype.hasOwnProperty.call(options, "skipCover") ? options.skipCover === true : shouldSkipCover();
    const savedProgress = progressFor(item);
    const resumePage = savedProgress?.page || (skipCover ? 2 : 1);
    let readerGrayscale = options.grayscale === true;
    const overlay = document.createElement("div");
    overlay.className = "reader-overlay";
    const supportedFormatsForModes = ["pdf", "cbz", "cbr"];
    const showModeSelector = supportedFormatsForModes.includes(format);
    overlay.innerHTML = `
      <div class="reader-top">
        <button class="small-btn" data-close-reader>← Voltar</button>
        <div class="reader-title">${escapeHTML(itemDisplayTitle(item))}</div>
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
        <button class="small-btn" data-reader-zoom>Zoom</button>
        ${state.session && !item.local ? `<button class="small-btn" data-toggle-read>${savedProgress?.completed ? 'Desmarcar como lida' : 'Marcar como lida'}</button>` : ''}
        ${item.character ? `<button class="small-btn" data-browse-character>Ver personagem</button>` : ''}
        ${item.publisher ? `<button class="small-btn" data-browse-publisher>Ver editora</button>` : ''}
        ${!item.local ? `<button class="small-btn reader-like-button ${state.comicLikeIds.has(item.id) ? "is-liked" : ""}" data-like-item="${escapeHTML(item.id)}">${state.comicLikeIds.has(item.id) ? "♥" : "♡"} ${state.comicLikeCounts.get(item.id) || 0}</button><button class="small-btn" data-share-item="${escapeHTML(item.id)}">Compartilhar</button>` : ""}
        ${!item.local ? `<button class="small-btn" data-comment-item="${escapeHTML(item.id)}">Comentários</button>` : ""}
        <button class="small-btn" data-open-external>Abrir arquivo</button>
      </div>
      <div class="reader-body" id="reader-body"></div>
      <div class="reader-controls" id="reader-controls"></div>
    `;
    document.body.appendChild(overlay);

    const closeReaderButton = $("[data-close-reader]", overlay);
    const cleanupReader = () => {
      if (activeReaderCleanup === cleanupReader) activeReaderCleanup = null;
      overlay._cbzDownloadController?.abort();
      overlay.remove();
      if (options.localObjectUrl) URL.revokeObjectURL(options.localObjectUrl);
    };
    activeReaderCleanup = cleanupReader;
    closeReaderButton.onclick = () => {
      cleanupReader();
      setSection("home");
    };
    $("[data-like-item]", overlay)?.addEventListener("click", event => { event.stopPropagation(); toggleComicLike(item.id); });
    $("[data-share-item]", overlay)?.addEventListener("click", event => { event.stopPropagation(); shareComic(item.id); });
    $("[data-comment-item]", overlay)?.addEventListener("click", event => { event.stopPropagation(); openCommentsPopup(item); });
    $("[data-open-external]", overlay).onclick = () => window.open(resolvedUrl, "_blank", "noopener");
    $("[data-toggle-cover]", overlay)?.addEventListener("click", () => {
      const nextSkipCover = !skipCover;
      if (state.session?.user?.id) saveSkipCoverPreference(nextSkipCover);
      cleanupReader();
      openReader(item, { skipCover: nextSkipCover, localObjectUrl: options.localObjectUrl, routeSync: true, grayscale: readerGrayscale });
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
    $("[data-toggle-read]", overlay)?.addEventListener("click", event => {
      const completed = toggleReadingCompleted(item, progressFor(item)?.total_pages || 1);
      event.currentTarget.textContent = completed ? "Desmarcar como lida" : "Marcar como lida";
    });
    overlay._readerNavigate = direction => {
      const button = direction > 0 ? $("[data-next]", controls) : $("[data-prev]", controls);
      if (button && !button.disabled) button.click();
    };
    let suppressReaderClick = false;
    const toggleReaderChrome = () => overlay.classList.toggle("reader-immersive");
    $("[data-reader-zoom]", overlay).onclick = () => {
      overlay.classList.toggle("reader-zoom-fit");
      overlay.classList.add("reader-immersive");
    };
    body.addEventListener("click", event => {
      if (suppressReaderClick || event.target.closest("button, a, select, textarea")) {
        suppressReaderClick = false;
        return;
      }
      toggleReaderChrome();
    });
    let pointerStart = null;
    body.addEventListener("pointerdown", event => {
      pointerStart = { x: event.clientX, y: event.clientY };
    });
    body.addEventListener("pointerup", event => {
      if (!pointerStart) return;
      const dx = event.clientX - pointerStart.x;
      const dy = event.clientY - pointerStart.y;
      pointerStart = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        suppressReaderClick = true;
        overlay._readerNavigate?.(dx < 0 ? 1 : -1);
      }
    });
    const onReaderKeydown = event => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      overlay._readerNavigate?.(direction);
    };
    document.addEventListener("keydown", onReaderKeydown);
    $("[data-close-reader]", overlay).addEventListener("click", () => document.removeEventListener("keydown", onReaderKeydown), { once: true });
    attachComments(item, overlay);
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
      renderPDFReader(item, resolvedUrl, body, controls, overlay, skipCover, resumePage, saveReadingProgress);
    } else if (format === "cbz" || resolvedUrl.toLowerCase().split("?")[0].endsWith(".cbz")) {
      renderCBZReader(item, resolvedUrl, body, controls, overlay, skipCover, resumePage, saveReadingProgress);
    } else if (format === "cbr" || resolvedUrl.toLowerCase().split("?")[0].endsWith(".cbr")) {
      renderCBRReader(item, resolvedUrl, body, controls, overlay, skipCover, resumePage, saveReadingProgress);
    } else if (["jpg","jpeg","png","webp","gif"].includes(format)) {
      body.innerHTML = `<img class="reader-image" src="${escapeHTML(resolvedUrl)}" alt="">`;
      controls.innerHTML = `<span class="reader-page">Imagem</span>`;
      saveReadingProgress(item, 1, 1);
    } else if (item.seriesUrl && !item.fileUrl && !item.telegramUrl) {
      body.innerHTML = `
        <div class="empty" style="margin:auto;max-width:650px">
          <h3>Catálogo externo</h3>
          <p>Esta entrada possui metadados, mas ainda não possui o link individual do arquivo.</p>
          <button class="btn btn-primary" data-open-series>Abrir página da série</button>
        </div>`;
      $(`[data-open-series]`, body).onclick = () => window.open(item.seriesUrl, "_blank", "noopener");
      controls.innerHTML = `<span class="reader-page">LINK EXTERNO</span>`;
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
    const raw = String(url || "");
    const clean = /^(https?:|blob:|data:)/i.test(raw) ? raw.split("?")[0].split("#")[0] : raw;
    const filename = clean.split(/[\\/]/).pop();
    return /^.+\.[a-z0-9]{1,8}$/i.test(filename) ? filename.split(".").pop().toLowerCase() : "";
  }

  async function renderPDFReader(item, url, body, controls, overlay, skipCover = false, resumePage = 1, onPageChange = () => {}) {
    body.innerHTML = `<div class="empty" style="margin:auto">Carregando PDF…</div>`;
    try {
      const pdfjs = await (window.pdfjsReady || Promise.resolve(window.pdfjsLib));
      // PDF.js 4.x via module pode não expor global em alguns navegadores.
      if (!pdfjs?.getDocument) {
        throw Object.assign(new Error("PDF.js nÃ£o estÃ¡ disponÃ­vel nesta pÃ¡gina."), { name: "PDFJS_MISSING" });
      }

      // Fetch the PDF data manually to have better control over errors.
      // This helps distinguish between "file not found" and "invalid file".
      body.innerHTML = `<div class="empty" style="margin:auto">Baixando PDFâ€¦</div>`;
      let pdfData;
      if (item.local && item.file) {
        pdfData = await item.file.arrayBuffer();
      } else {
        const response = await fetch(proxiedFileUrl(url), {
          method: "GET",
          mode: "cors",
          credentials: "omit",
          cache: "no-store"
        });
        if (!response.ok) {
          const error = new Error(`Arquivo não encontrado (HTTP ${response.status})`);
          error.name = 'MissingPDFException';
          throw error;
        }
        pdfData = await response.arrayBuffer();
      }
      if (!pdfData.byteLength) throw new Error("PDF vazio.");

      // Pass the data as a typed array.
      body.innerHTML = `<div class="empty" style="margin:auto">Abrindo PDFâ€¦</div>`;
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(pdfData) }).promise;

      const currentReadingMode = state.readingMode;

      if (currentReadingMode === 'single-page') {
        let page = Math.max(1, Math.min(resumePage, pdf.numPages));
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
          onPageChange(item, page, pdf.numPages);
        }
        await drawSinglePage();
      } else if (currentReadingMode === 'double-page') {
        let spread = Math.max(0, Math.floor((resumePage - 1) / 2));
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
          onPageChange(item, pagesToRender[0], pdf.numPages);
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
          onPageChange(item, Number(visiblePage.dataset.pageNum), pdf.numPages);

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
        pageElements.find(el => Number(el.dataset.pageNum) === resumePage)?.scrollIntoView({ block: 'start' });

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

  async function renderCBZReader(item, url, body, controls, overlay, skipCover = false, resumePage = 1, onPageChange = () => {}, prefetchedBuffer = null) {
    const downloadController = new AbortController();
    overlay._cbzDownloadController = downloadController;
    let progressRoot;
    let progressLabel;
    let progressBar;
    let progressDetail;
    let progressSpinner;
    const showCbzProgress = (message, value = null, detail = "") => {
      if (!progressRoot || !progressRoot.isConnected) {
        progressRoot = document.createElement("div");
        progressRoot.className = "reader-loading";
        progressRoot.setAttribute("role", "status");
        progressLabel = document.createElement("div");
        progressLabel.className = "reader-loading-label";
        progressBar = document.createElement("progress");
        progressBar.className = "reader-progress";
        progressBar.max = 100;
        progressDetail = document.createElement("div");
        progressDetail.className = "reader-loading-detail";
        progressSpinner = document.createElement("div");
        progressSpinner.className = "reader-spinner";
        progressRoot.append(progressLabel, progressBar, progressDetail, progressSpinner);
        body.replaceChildren(progressRoot);
      }
      progressLabel.textContent = message;
      if (value === null) {
        progressBar.hidden = true;
        progressDetail.hidden = true;
        progressSpinner.hidden = false;
      } else {
        progressBar.hidden = false;
        progressBar.value = value;
        progressDetail.hidden = false;
        progressDetail.textContent = detail;
        progressSpinner.hidden = true;
      }
    };
    showCbzProgress("Baixando páginas do CBZ…");
    try {
      if (!window.JSZip) throw new Error("JSZip não carregou.");
      let buffer = prefetchedBuffer;
      if (buffer) showCbzProgress("Arquivo CBZ baixado. Preparando p\u00e1ginas...", 100, "Download conclu\u00eddo");
      if (!buffer) {
      const response = await fetch(proxiedFileUrl(url), {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        signal: downloadController.signal
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const contentLength = Number(response.headers.get("content-length")) || 0;
      if (response.body && contentLength) {
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          chunks.push(part.value);
          received += part.value.byteLength;
          showCbzProgress("Baixando páginas do CBZ…", Math.min(99, Math.round(received / contentLength * 100)), `${(received / 1048576).toFixed(1)} MB de ${(contentLength / 1048576).toFixed(1)} MB`);
        }
        const bytes = new Uint8Array(received);
        let offset = 0;
        chunks.forEach(chunk => { bytes.set(chunk, offset); offset += chunk.byteLength; });
        buffer = bytes.buffer;
      } else {
        buffer = await response.arrayBuffer();
      }
      }
      const zip = await JSZip.loadAsync(buffer);
      const names = Object.keys(zip.files)
        .filter(n => !zip.files[n].dir && /\.(jpg|jpeg|png|webp|gif)$/i.test(n))
        .sort((a,b) => a.localeCompare(b, undefined, {numeric:true}));
      if (!names.length) throw new Error("CBZ sem imagens.");
      showCbzProgress("Preparando páginas…", 0, `0 de ${names.length} páginas`);

      const currentReadingMode = state.readingMode;

      if (currentReadingMode === 'single-page') {
        let page = Math.max(0, Math.min(resumePage - 1, names.length - 1));
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
          onPageChange(item, page + 1, names.length);
        }
        await draw();
        $("[data-close-reader]", overlay).addEventListener('click', () => {
          if (img.dataset.url) URL.revokeObjectURL(img.dataset.url);
        }, { once: true });
      } else if (currentReadingMode === 'double-page') {

        let spread = Math.max(0, Math.floor((resumePage - 1) / 2));
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
          onPageChange(item, indexesToRender[0] + 1, names.length);
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
        let extractedPages = 0;
        const pageData = await Promise.all(names.map(async (name) => {
          const blob = await zip.files[name].async("blob");
          const url = URL.createObjectURL(blob);
          objectUrls.push(url);
          extractedPages += 1;
          showCbzProgress("Extraindo páginas do CBZ…", Math.round(extractedPages / names.length * 100), `${extractedPages} de ${names.length} páginas`);
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
          onPageChange(item, Number(visiblePage.dataset.pageNum), names.length);
        };

        pageContainer.addEventListener('scroll', updateControls, { passive: true });
        updateControls();
        pageElements.find(el => Number(el.dataset.pageNum) === resumePage)?.scrollIntoView({ block: 'start' });

        $("[data-close-reader]", overlay).addEventListener('click', () => {
          pageContainer.removeEventListener('scroll', updateControls);
          for (const url of objectUrls) URL.revokeObjectURL(url);
        }, { once: true });
      }

      const modeSelect = $("#reading-mode-select", overlay);
      if (modeSelect) {
        modeSelect.addEventListener('change', (e) => {
          setReadingMode(e.target.value);
          overlay._cbzDownloadController?.abort();
          overlay.remove();
          openReader(item, { skipCover });
        });
      }
    } catch (err) {
      if (err?.name === "AbortError" || !overlay.isConnected) return;
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
  async function renderCBRReader(item, url, body, controls, overlay, skipCover = false, resumePage = 1, onPageChange = () => {}) {
    let objectUrl = null;
    let archive = null;
    let objectUrls = null; // For continuous scroll

    function showCbrProgress(message, value = null, detail = "") {
      const progress = value === null
        ? `<div class="reader-loading"><div class="reader-loading-label">${escapeHTML(message)}</div><div class="reader-spinner"></div></div>`
        : `<div class="reader-loading"><div class="reader-loading-label">${escapeHTML(message)}</div><progress class="reader-progress" max="100" value="${Math.max(0, Math.min(100, value))}"></progress><div class="reader-loading-detail">${escapeHTML(detail)}</div></div>`;
      body.innerHTML = progress;
    }

    function status(message) {
      showCbrProgress(message);
      return;
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
      const downloadUrl = proxiedFileUrl(url);
      console.log("[CBR] URL usada no fetch:", downloadUrl);

      const isMegaSource = /^https:\/\/(?:www\.)?mega\.nz\/file\//i.test(String(url || ""));
      let response = null;
      if (!isMegaSource) {
        response = await fetch(downloadUrl, {
          method: "GET",
          mode: "cors",
          credentials: "omit",
          cache: "default"
        });
        console.log("[CBR] HTTP:", response.status);
        console.log("[CBR] Content-Type:", response.headers.get("content-type") || "desconhecido");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      }

      // =========================================================
      // 2. LER ARQUIVO
      // =========================================================

      status("Lendo arquivo CBR…");

      const totalBytes = Number(response?.headers.get("content-length")) || 0;
      const formatCbrBytes = bytes => bytes >= 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
        : `${Math.round(bytes / 1024)} KB`;
      let buffer;
      if (isMegaSource) {
        buffer = await fetchFileArrayBuffer(url, (received, total) => {
          const value = total ? (received / total) * 100 : null;
          showCbrProgress("Lendo arquivo CBR…", value, total ? `${formatCbrBytes(received)} de ${formatCbrBytes(total)}` : formatCbrBytes(received));
        });
        console.log("[CBR] Mega baixado em partes:", buffer.byteLength, "bytes");
      } else if (response.body?.getReader) {
        const reader = response.body.getReader();
        const chunks = [];
        let receivedBytes = 0;
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          chunks.push(part.value);
          receivedBytes += part.value.byteLength;
          const value = totalBytes ? (receivedBytes / totalBytes) * 100 : null;
          showCbrProgress("Lendo arquivo CBR…", value, totalBytes ? `${formatCbrBytes(receivedBytes)} de ${formatCbrBytes(totalBytes)}` : formatCbrBytes(receivedBytes));
        }
        const bytes = new Uint8Array(receivedBytes);
        let offset = 0;
        chunks.forEach(chunk => { bytes.set(chunk, offset); offset += chunk.byteLength; });
        buffer = bytes.buffer;
      } else {
        buffer = await response.arrayBuffer();
      }

      console.log(
        "[CBR] Tamanho:",
        buffer.byteLength,
        "bytes"
      );

      if (buffer.byteLength < 8) {
        throw new Error("CBR_EMPTY");
      }

      const bytes = new Uint8Array(buffer);

      const preview = new TextDecoder().decode(bytes.slice(0, 128)).trimStart().toLowerCase();
      if (preview.startsWith("<!doctype html") || preview.startsWith("<html") || preview.startsWith("<head")) {
        throw new Error("CBR_HTML_RESPONSE");
      }

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
      const isZipContainer = bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04;

      console.log(
        "[CBR] Formato detectado:",
        rarVersion
      );

      if (rarVersion === "RAR5") {
        status("RAR5 detectado. Preparando leitor…");
      } else if (rarVersion === "RAR4") {
        status("RAR4 detectado. Preparando leitor…");
      } else {
        if (isZipContainer) {
          status("Arquivo ZIP detectado. Abrindo como CBZ…");
          return renderCBZReader(item, url, body, controls, overlay, skipCover, resumePage, onPageChange, buffer);
        }
        status("Formato compactado detectado. Preparando leitor…");
      }

      // =========================================================
      // 3. VERIFICAR LIBARCHIVE
      // =========================================================

      status("Verificando biblioteca CBR…");

      const LIBARCHIVE_MAIN = appAssetUrl("libarchive/libarchive.js");

      const LIBARCHIVE_WORKER = appAssetUrl("libarchive/worker-bundle.js");

      const LIBARCHIVE_WASM = appAssetUrl("libarchive/libarchive.wasm");

      console.log("[CBR] MAIN:", LIBARCHIVE_MAIN);
      console.log("[CBR] WORKER:", LIBARCHIVE_WORKER);
      console.log("[CBR] WASM:", LIBARCHIVE_WASM);

      const [mainResponse, workerResponse, wasmResponse] = await Promise.all([
        fetch(LIBARCHIVE_MAIN, { cache: "default" }),
        fetch(LIBARCHIVE_WORKER, { cache: "default" }),
        fetch(LIBARCHIVE_WASM, { cache: "default" })
      ]);
      if (!mainResponse.ok) throw new Error(`LIBARCHIVE_MAIN_MISSING: HTTP ${mainResponse.status}`);
      if (!workerResponse.ok) throw new Error(`LIBARCHIVE_WORKER_MISSING: HTTP ${workerResponse.status}`);
      if (!wasmResponse.ok) throw new Error(`LIBARCHIVE_WASM_MISSING: HTTP ${wasmResponse.status}`);

      // =========================================================
      // 4. IMPORTAR LIBARCHIVE
      // =========================================================

      status("Carregando biblioteca CBR…");

      const module = await loadLibarchiveModule();

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

      const workerUrl = appAssetUrl("libarchive/worker-bundle.js");
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
        let page = Math.max(0, Math.min(resumePage - 1, imageFiles.length - 1));
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
          onPageChange(item, page + 1, imageFiles.length);
        }
        await draw();
        $("[data-close-reader]", overlay).addEventListener('click', () => {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          archive?.close?.();
        }, { once: true });
      } else if (currentReadingMode === 'double-page') {
        let spread = Math.max(0, Math.floor((resumePage - 1) / 2));
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
          onPageChange(item, indexesToRender[0] + 1, imageFiles.length);
        }

        await drawSpread();

        $("[data-close-reader]", overlay).addEventListener("click", () => {
          for (const u of spreadUrls) {
            URL.revokeObjectURL(u);
          }
          archive?.close?.();
        }, { once: true });
      } else if (currentReadingMode === 'continuous-scroll') {
        const pageContainer = document.createElement("div");
        pageContainer.className = "image-continuous-scroll-container";
        body.replaceChildren(pageContainer);

        objectUrls = [];
        const pageElements = [];
        const pageStates = new Map();

        imageFiles.forEach((file, index) => {
          if (skipCover && index === 0) return;
          const pageNum = index + 1;
          const pageWrapper = document.createElement("div");
          pageWrapper.className = "image-page-wrapper";
          pageWrapper.style.minHeight = "65vh";
          pageWrapper.style.width = "min(90%, 900px)";
          pageWrapper.dataset.pageNum = pageNum;
          const img = document.createElement("img");
          img.className = "reader-image";
          img.alt = `Página ${pageNum}`;
          pageWrapper.appendChild(img);
          pageContainer.appendChild(pageWrapper);
          pageElements.push({ file, pageNum, wrapper: pageWrapper, img });
          pageStates.set(index, { url: null, loading: null });
        });

        const loadPage = async page => {
          const pageState = pageStates.get(imageFiles.indexOf(page.file));
          if (!pageState || pageState.url || pageState.loading) return;
          pageState.loading = (async () => {
            const extracted = await withTimeout(page.file.extract(), 120000, "A extração de uma página demorou demais.");
            const blob = extracted instanceof Blob ? extracted : new Blob([extracted], { type: "image/jpeg" });
            pageState.url = URL.createObjectURL(blob);
            page.img.src = pageState.url;
            objectUrls.push(pageState.url);
          })().catch(error => console.error("[CBR] Falha ao extrair página", page.pageNum, error)).finally(() => {
            pageState.loading = null;
          });
          await pageState.loading;
        };

        const releasePage = page => {
          const pageState = pageStates.get(imageFiles.indexOf(page.file));
          if (!pageState?.url) return;
          URL.revokeObjectURL(pageState.url);
          objectUrls = objectUrls.filter(url => url !== pageState.url);
          pageState.url = null;
          page.img.removeAttribute("src");
        };

        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            const page = pageElements.find(candidate => candidate.wrapper === entry.target);
            if (!page) return;
            if (entry.isIntersecting) loadPage(page);
            else releasePage(page);
          });
        }, { root: pageContainer, rootMargin: "150% 0px" });
        pageElements.forEach(page => observer.observe(page.wrapper));

        let currentPageIndex = 0;
        const updateControls = () => {
          const visiblePage = pageElements.find(page => {
            const rect = page.wrapper.getBoundingClientRect();
            return rect.top >= 0 && rect.top < window.innerHeight / 2;
          }) || pageElements.find(page => {
            const rect = page.wrapper.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < window.innerHeight;
          }) || pageElements[0];

          if (!visiblePage) {
            currentPageIndex = 0;
            return;
          }

          currentPageIndex = pageElements.indexOf(visiblePage);
          controls.innerHTML = `
            <button data-prev ${currentPageIndex <= 0 ? "disabled" : ""}>↑</button>
            <span class="reader-page">${visiblePage.pageNum} / ${imageFiles.length}</span>
            <button data-next ${currentPageIndex >= pageElements.length - 1 ? "disabled" : ""}>↓</button>
          `;
          const prevBtn = $("[data-prev]", controls);
          const nextBtn = $("[data-next]", controls);
          prevBtn?.addEventListener("click", () => pageElements[Math.max(0, currentPageIndex - 1)].wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' }));
          nextBtn?.addEventListener("click", () => pageElements[Math.min(pageElements.length - 1, currentPageIndex + 1)].wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' }));
          onPageChange(item, visiblePage.pageNum, imageFiles.length);
        };

        pageContainer.addEventListener('scroll', updateControls, { passive: true });
        loadPage(pageElements[0]);
        updateControls();
        pageElements.find(page => page.pageNum === resumePage)?.wrapper.scrollIntoView({ block: 'start' });

        $("[data-close-reader]", overlay).addEventListener('click', () => {
          observer.disconnect();
          pageContainer.removeEventListener('scroll', updateControls);
          for (const url of objectUrls) URL.revokeObjectURL(url);
          objectUrls = null;
          archive?.close?.();
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
      archive?.close?.();
      if (objectUrls) {
        for (const url of objectUrls) URL.revokeObjectURL(url);
      }

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

      } else if (errorText.includes("CBR_HTML_RESPONSE")) {

        fail(
          "O MediaFire não entregou o CBR.",
          "O servidor devolveu uma página HTML em vez do arquivo. Confirme o link permanente do MediaFire e se a Edge Function mediafire-proxy foi publicada."
        );

      } else if (errorText.includes("CBR_INVALID_SIGNATURE")) {

        fail(
          "Arquivo CBR inválido.",
          "O download terminou, mas o conteúdo não possui assinatura RAR. Verifique o link e o Content-Type exibidos no console."
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

  function instantCover(item) {
    const title = String(item?.title || "HQ").slice(0, 34);
    const safeTitle = title.replace(/[<>&\"']/g, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="540" viewBox="0 0 360 540"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#29232a"/><stop offset="1" stop-color="#111114"/></linearGradient></defs><rect width="360" height="540" fill="url(#g)"/><path d="M-20 430L380 80V210L-20 560Z" fill="#e50914" opacity=".72"/><text x="28" y="62" fill="#ff5962" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="3">BANCA DIGITAL</text><text x="28" y="285" fill="white" font-family="Arial,sans-serif" font-size="27" font-weight="700">${safeTitle}</text><text x="28" y="510" fill="#d2d2d5" font-family="Arial,sans-serif" font-size="12">Carregando capa…</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function coverFor(item, variant = "card", coverChoices = null) {
    // A capa local aparece imediatamente; a capa real substitui-a quando terminar de carregar.
    if (!item) return instantCover({ title: "HQ" });
    const activeChoices = coverChoices || (state.section === "public-profile" ? state.publicProfile?.coverChoices : state.coverChoices);
    const selectedCover = activeChoices?.get?.(item.id)?.cover_url;
    if (selectedCover) return proxiedImageUrl(selectedCover);
    if (variant === "hero" && item.featuredCoverUrl) return proxiedImageUrl(item.featuredCoverUrl);
    if (item.coverUrl) return proxiedImageUrl(item.coverUrl);
    if (item.cover) return proxiedImageUrl(item.cover); // backward compatibility
    return instantCover(item);
  }

  function coverCacheKey(item, maxWidth) {
    return `banca-cover:v3:${maxWidth}:${item.id}:${item.fileUrl || item.telegramUrl || ""}`;
  }

  function directFileUrl(item) {
    const url = item?.fileUrl || "";
    return /^https?:\/\//i.test(url) || url ? url : "";
  }

  function proxiedFileUrl(url) {
    const source = String(url || "");
    let parsed;
    try { parsed = new URL(source); } catch { return source; }
    const host = parsed.hostname.toLowerCase();
    const isMediaFire = parsed.protocol === "https:" && (
      host === "mediafire.com" ||
      host === "www.mediafire.com" ||
      /^download\d+\.mediafire\.com$/.test(host)
    );
    const isMega = parsed.protocol === "https:" && (host === "mega.nz" || host === "www.mega.nz") && parsed.pathname.startsWith("/file/");
    if ((!isMediaFire && !isMega) || !window.BANCA_SUPABASE_URL) return source;
    const proxy = new URL(`${window.BANCA_SUPABASE_URL}/functions/v1/${isMega ? "mega-proxy" : "mediafire-proxy"}`);
    proxy.searchParams.set("url", source);
    return proxy.toString();
  }

  async function fetchFileArrayBuffer(url, onProgress = () => {}) {
    const source = String(url || "");
    const isMega = /^https:\/\/(?:www\.)?mega\.nz\/file\//i.test(source);
    if (!isMega) {
      const response = await fetch(proxiedFileUrl(source), { mode: "cors", credentials: "omit", cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.arrayBuffer();
    }

    const chunkSize = 4 * 1024 * 1024;
    const chunks = [];
    let total = 0;
    let received = 0;
    let start = 0;
    while (start < total || start === 0) {
      const end = start + chunkSize - 1;
      const proxy = new URL(proxiedFileUrl(source));
      const response = await fetch(proxy, {
        headers: { Range: `bytes=${start}-${end}` },
        mode: "cors",
        credentials: "omit",
        cache: "no-store"
      });
      if (!(response.ok || response.status === 206)) throw new Error(`HTTP ${response.status}`);
      const part = new Uint8Array(await response.arrayBuffer());
      const contentRange = response.headers.get("content-range") || "";
      const match = contentRange.match(/bytes\s+(\d+)-(\d+)\/(\d+)/i);
      if (match) total = Number(match[3]);
      if (!part.byteLength) throw new Error("O Mega retornou um bloco vazio.");
      chunks.push(part);
      received += part.byteLength;
      onProgress(received, total);
      if (!total || part.byteLength < chunkSize) break;
      start += part.byteLength;
    }
    const bytes = new Uint8Array(received);
    let offset = 0;
    chunks.forEach(chunk => { bytes.set(chunk, offset); offset += chunk.byteLength; });
    if (total && received !== total) throw new Error(`Download incompleto: ${received} de ${total} bytes.`);
    return bytes.buffer;
  }

  function proxiedImageUrl(url) {
    const source = String(url || "");
    if (!window.BANCA_SUPABASE_URL || !/^https:\/\/(?:i\.imgur\.com|(?:www\.)?imgur\.com|zonafantasmanet\.files\.wordpress\.com)\//i.test(source)) return source;
    const proxy = new URL(`${window.BANCA_SUPABASE_URL}/functions/v1/image-proxy`);
    proxy.searchParams.set("url", source);
    return proxy.toString();
  }

  async function imageBlobToDataUrl(blob, maxWidth = 480) {
    if (!(blob instanceof Blob)) blob = new Blob([blob]);
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const webp = canvas.toDataURL("image/webp", 0.86);
    return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", 0.86);
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

  async function pdfCover(url, signal, maxWidth = 480) {
    const response = await fetch(proxiedFileUrl(url), { mode: "cors", credentials: "omit", cache: "no-store", signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(await response.arrayBuffer()) }).promise;
    const page = await pdf.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: Math.min(2, maxWidth / baseViewport.width) });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    const webp = canvas.toDataURL("image/webp", 0.86);
    return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", 0.86);
  }

  async function cbzCover(url, signal, maxWidth = 480) {
    const response = await fetch(proxiedFileUrl(url), { mode: "cors", credentials: "omit", cache: "no-store", signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const zip = await JSZip.loadAsync(await response.arrayBuffer());
    const name = Object.keys(zip.files)
      .filter(n => !zip.files[n].dir && /\.(jpg|jpeg|png|webp|gif)$/i.test(n))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))[0];
    if (!name) throw new Error("CBZ sem imagens");
    return imageBlobToDataUrl(await zip.files[name].async("blob"), maxWidth);
  }

  async function cbrCover(url, signal, maxWidth = 480) {
    const response = await fetch(proxiedFileUrl(url), { mode: "cors", credentials: "omit", cache: "no-store", signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const module = await import(appAssetUrl("libarchive/libarchive.js"));
    const Archive = module.Archive;
    Archive.init({ workerUrl: appAssetUrl("libarchive/worker-bundle.js") });
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
    return imageBlobToDataUrl(await images[0].extract(), maxWidth);
  }

  async function autoCover(item, signal, maxWidth = 480) {
    if (!item || item.coverUrl || item.cover || (maxWidth > 480 && item.featuredCoverUrl)) return null;
    const url = directFileUrl(item);
    if (!url) return null;
    const cacheId = `${item.id}:${maxWidth}`;
    const cacheKey = coverCacheKey(item, maxWidth);
    if (coverMemoryCache.has(cacheId)) return coverMemoryCache.get(cacheId);
    if (coverLoading.has(cacheId)) return coverLoading.get(cacheId);
    const cached = localStorage.getItem(cacheKey);
    if (cached && cached.length <= (maxWidth > 480 ? 900000 : 300000)) {
      coverMemoryCache.set(cacheId, cached);
      return cached;
    }
    if (cached) localStorage.removeItem(cacheKey);
    const format = (item.format || extension(url)).toLowerCase();
    let cover;
    try {
      if (format === "pdf" || /\.pdf(?:[?#]|$)/i.test(url)) cover = await pdfCover(url, signal, maxWidth);
      else if (format === "cbz" || /\.cbz(?:[?#]|$)/i.test(url)) cover = await cbzCover(url, signal, maxWidth);
      else if (format === "cbr" || /\.cbr(?:[?#]|$)/i.test(url)) cover = await cbrCover(url, signal, maxWidth);
      else if (/^(jpg|jpeg|png|webp|gif)$/i.test(format)) cover = url;
    } catch (error) {
      if (!signal?.aborted) coverMemoryCache.set(cacheId, null);
      return null;
    }
    if (cover) {
      coverMemoryCache.set(cacheId, cover);
      try { localStorage.setItem(cacheKey, cover); } catch {}
      return cover;
    }
    return null;
  }

  function hydrateHomeCovers() {
    const elements = $$('[data-cover-id]');
    if (!elements.length) return;
    const load = element => {
      const item = state.db.library.find(x => x.id === element.dataset.coverId) || state.localBoxFiles.find(x => x.id === element.dataset.coverId);
      if (!item || element.dataset.coverReady === "true") return;
      element.dataset.coverReady = "true";
      const controller = new AbortController();
      coverAbortControllers.set(item.id, controller);
      const isHero = element.classList.contains("hero-bg") || element.classList.contains("hero-cover");
      const maxWidth = isHero ? 1200 : 480;
      const cacheId = `${item.id}:${maxWidth}`;
      const job = coverLoading.get(cacheId) || autoCover(item, controller.signal, maxWidth);
      coverLoading.set(cacheId, job);
      job.then(cover => {
        if (!cover) return;
        $$('[data-cover-id]').filter(el => el.dataset.coverId === item.id && ((el.classList.contains("hero-bg") || el.classList.contains("hero-cover")) === isHero)).forEach(el => { el.style.backgroundImage = `url("${cover}")`; });
      }).catch(error => { element.dataset.coverReady = ""; console.warn("Não foi possível gerar a capa de", item.title, error); })
        .finally(() => coverLoading.delete(cacheId));
    };
    const priority = elements.filter(element => element.classList.contains("hero-bg"));
    const deferred = elements.filter(element => !element.classList.contains("hero-bg"));
    const observeDeferred = () => {
      const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { load(entry.target); observer.unobserve(entry.target); } }), { rootMargin: "500px" }) : null;
      deferred.forEach(element => observer ? observer.observe(element) : load(element));
    };
    const priorityJobs = priority.map(load).filter(Boolean);
    if (priorityJobs.length) Promise.allSettled(priorityJobs).then(observeDeferred);
    else observeDeferred();
  }

  function card(item, progressMap = state.readingProgress, favoriteIds = state.favoriteIds, directOpen = false, coverChoices = null) {
    const completed = progressFor(item, progressMap)?.completed;
    const displayTitle = itemDisplayTitle(item);
    const issueLabel = itemIssueLabel(item);
    const coverVariants = state.coverVariants.get(item.id) || [];
    const hasCoverVariants = coverVariants.length > 0;
    const canChooseCover = state.session && ["premium", "moderator", "admin"].includes(state.profile?.plan) && favoriteIds === state.favoriteIds && state.favoriteIds.has(item.id) && hasCoverVariants;
    const authors = String(item.author || "").split(/\s*(?:\/|&|\be\b)\s*/i).map(value => value.trim()).filter(Boolean);
    const entityButton = (kind, value, label = value) => value ? `<button type="button" class="card-entity-link" data-entity-kind="${escapeHTML(kind)}" data-entity-value="${escapeHTML(value)}">${escapeHTML(label)}</button>` : "";
    return `
      <article class="card" data-open="${escapeHTML(item.id)}" ${(directOpen || (state.section === "public-profile" && state.publicProfile?.collectionId)) ? "data-open-direct=\"true\"" : ""}>
        <div class="cover" data-cover-id="${escapeHTML(item.id)}" style="background-image:url('${escapeHTML(coverFor(item, "card", coverChoices))}')">
          <span class="cover-number">${escapeHTML(issueLabel)}</span>
          <button class="card-favorite ${favoriteIds.has(item.id) ? 'is-favorite' : ''}" data-favorite="${escapeHTML(item.id)}" title="Salvar na estante">★</button>
        </div>
        ${completed ? '<div class="card-completed">✓ Lida</div>' : ''}
        <div class="card-body">
          <div class="card-title">${escapeHTML(displayTitle)}</div>
          <div class="card-meta">${entityButton("year", String(item.year || ""), String(item.year || ""))}${entityButton("character", item.character)}${entityButton("publisher", item.publisher)}${entityButton("imprint", item.imprint)}</div>
          ${authors.length ? `<div class="card-authors">${authors.map(author => entityButton("author", author)).join(" ")}</div>` : ""}
          <div class="card-stats"><span>♥ ${Number(item.clicks || 0).toLocaleString("pt-BR")} leituras</span>${canChooseCover ? `<button type="button" class="card-cover-choice" data-cover-choice="${escapeHTML(item.id)}" title="Escolher capa variante">Escolher capa</button>` : hasCoverVariants ? `<span class="card-variant-info" title="Esta edição possui capas variantes">Capa variante</span>` : ""}</div>
          <div class="card-actions"><button class="card-like ${state.comicLikeIds.has(item.id) ? "is-liked" : ""}" data-like-item="${escapeHTML(item.id)}" title="Curtir quadrinho">${state.comicLikeIds.has(item.id) ? "♥" : "♡"} ${state.comicLikeCounts.get(item.id) || 0}</button><button class="card-share" data-share-item="${escapeHTML(item.id)}" title="Compartilhar quadrinho">Compartilhar</button><button class="card-comment" data-comment-item="${escapeHTML(item.id)}" title="Ver comentários">Comentários</button>${item.seriesId ? `<button class="card-series" data-view-series="${escapeHTML(item.seriesId)}" title="Ver série">Série</button>` : ""}</div>
        </div>
      </article>`;
  }

  function itemDisplayTitle(item) {
    const candidates = [item?.seriesTitle, item?.title, item?.name, item?.comicTitle, item?.displayTitle];
    let base = candidates.find(value => {
      const text = String(value || "").trim();
      return text && !/^(quadrinho|hq)$/i.test(text);
    });
    if (!base) {
      const source = item?.fileName || item?.filename || item?.originalName || item?.fileUrl;
      let filename = String(source || "").split(/[\\/?]/).pop() || "";
      try { filename = decodeURIComponent(filename); } catch {}
      filename = filename.replace(/\.[a-z0-9]{2,5}$/i, "").replace(/[+_]+/g, " ").replace(/\s+/g, " ").trim();
      if (filename && !/^(quadrinho|hq)$/i.test(filename)) base = filename;
    }
    base ||= "Quadrinho";
    const issue = String(item?.issue || "").trim();
    if (!issue) return base;
    const number = issue.match(/\d+/)?.[0];
    return number ? `${base} #${Number(number)}` : `${base} — ${issue}`;
  }

  function itemIssueLabel(item) {
    const issue = String(item?.issue || "").trim();
    if (!item?.seriesId || !issue || !/^\d+(?:\.\d+)?$/.test(issue)) return issue;
    const availableTotal = state.db.library.filter(entry => entry.seriesId === item.seriesId && (!item.volume || entry.volume === item.volume)).length;
    return availableTotal > 1 ? `${issue}/${availableTotal}` : issue;
  }

  function rail(title, items, subtitle = "", actionText = "", directOpen = false) {
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
        <div class="rail">${uniqueCatalogItems(items).map(item => card(item, state.readingProgress, state.favoriteIds, directOpen)).join("")}</div>
      </section>`;
  }

  function renderHome() {
    const lib = state.db.library;
    let heroItem = lib.find(item => item.id === state.homeHeroId);
    if (!heroItem) {
      heroItem = weightedRandom(lib.filter(x => x.featured)) || lib[0];
      state.homeHeroId = heroItem?.id || null;
    }
    const mostClicked = uniqueCatalogItems([...lib].sort((a,b) => (b.clicks||0) - (a.clicks||0)).slice(0, 8));
    const heroTitle = heroItem ? itemDisplayTitle(heroItem) : "Sua banca digital";
    const heroMeta = heroItem ? [heroItem.issue, heroItem.type ? formatType(heroItem.type) : "", heroItem.year].map(value => String(value || "").trim()).filter(Boolean).join(" · ") : "";
    let randoms = state.homeRandomIds.map(id => lib.find(item => item.id === id)).filter(Boolean);
    if (!randoms.length) {
      randoms = uniqueCatalogItems([...lib].sort(() => Math.random() - .5).slice(0, 8));
      state.homeRandomIds = randoms.map(item => item.id);
    }

    const seriesEntries = new Map();
    lib.filter(item => item.seriesId).forEach(item => {
      if (!seriesEntries.has(item.seriesId)) seriesEntries.set(item.seriesId, []);
      seriesEntries.get(item.seriesId).push(item);
    });
    const bestSeries = [...seriesEntries.entries()]
      .map(([seriesId, editions]) => ({
        item: editions[0],
        likes: editions.reduce((total, edition) => total + (state.comicLikeCounts.get(edition.id) || 0), 0)
      }))
      .sort((a, b) => b.likes - a.likes || String(a.item.seriesTitle || a.item.title).localeCompare(String(b.item.seriesTitle || b.item.title), "pt-BR"))
      .slice(0, 5);
    const bestSeriesRail = bestSeries.length ? `<section class="section best-series-section"><div class="section-head"><div><h2 class="section-title">Melhores séries</h2><div class="section-subtitle">As séries mais curtidas, pela soma das curtidas de suas edições.</div></div></div><div class="results-grid">${bestSeries.map(entry => seriesCard(entry.item)).join("")}</div></section>` : "";

    const publisherEntries = new Map();
    lib.filter(item => item.type === "comic" && String(item.publisher || "").trim()).forEach(item => {
      const name = String(item.publisher).trim();
      if (!publisherEntries.has(name)) publisherEntries.set(name, []);
      publisherEntries.get(name).push(item);
    });
    const pinnedPublishers = [...publisherEntries.entries()].filter(([name]) => state.publisherSettings.get(publisherKey(name))?.is_pinned);
    const publisherPinnedRail = pinnedPublishers.length ? `<section class="section publisher-pinned-section"><div class="section-head"><div><h2 class="section-title">Editoras fixadas</h2><div class="section-subtitle">Acesso rápido às editoras em destaque.</div></div></div><div class="publisher-carousel">${pinnedPublishers.map(([name, publisherItems]) => { const setting = state.publisherSettings.get(publisherKey(name)); const representative = publisherItems.find(item => item.featuredCoverUrl || item.coverUrl || item.cover) || publisherItems[0]; const cover = setting?.cover_url || coverFor(representative); return `<button class="publisher-card is-pinned" type="button" data-publisher="${escapeHTML(name)}"><div class="publisher-card-cover" style="background-image:url('${escapeHTML(cover)}')"></div><div class="publisher-card-overlay"></div><div class="publisher-card-info"><strong>${escapeHTML(name)}</strong><span>${publisherItems.length} edição(ões)</span></div></button>`; }).join("")}</div></section>` : "";

    const featuredCollectionsRail = state.featuredComicCollections?.length ? `<section class="section featured-collections-rail"><div class="section-head"><div><h2 class="section-title">Coleções de quadrinhos em destaque</h2><div class="section-subtitle">Coleções públicas escolhidas pela equipe.</div></div></div><div class="public-collections-grid">${state.featuredComicCollections.map(collection => publicCollectionCard(collection)).join("")}</div></section>` : "";
    return `
      <section class="hero">
        <div class="hero-bg" data-cover-id="${escapeHTML(heroItem?.id || "")}" data-cover-size="hero" style="background-image:url('${escapeHTML(coverFor(heroItem, "hero"))}')"></div>
        <div class="hero-cover" data-cover-id="${escapeHTML(heroItem?.id || "")}" data-cover-size="hero" data-open="${escapeHTML(heroItem?.id || "")}" data-open-direct="true" style="background-image:url('${escapeHTML(coverFor(heroItem, "hero"))}')" aria-label="Abrir quadrinho em destaque"></div>
        <div class="hero-content">
          <div class="eyebrow">Destaque da banca</div>
          <h1>${escapeHTML(heroTitle)}</h1>
          ${heroMeta ? `<div class="hero-meta">${escapeHTML(heroMeta)}</div>` : ""}
          <p>${escapeHTML(heroItem?.description || "Publique e descubra quadrinhos sem precisar armazenar os arquivos no servidor.")}</p>
          ${heroItem ? `<button class="btn btn-primary" data-open="${escapeHTML(heroItem.id)}" data-open-direct="true">▶ Ler agora</button>` : ""}
          <button class="btn btn-secondary" data-action="random">🎲 Surpreenda-me</button>
        </div>
      </section>
      <div class="content">
        ${rail("Mais lidos", mostClicked, "As edições que mais receberam cliques.", "Ver catálogo", true)}
        ${publisherPinnedRail}
        ${bestSeriesRail}
        ${featuredCollectionsRail}
        ${rail("Escolha aleatória", randoms, "Como escolher uma revista numa banca: você nunca sabe o que vai encontrar.", "", true)}
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
    const normalizedValue = String(filter.value || "").trim().toLowerCase();
    const allItems = state.db.library.filter(item => {
      if (filter.kind === "year") return String(item.year || "") === String(filter.value || "");
      if (filter.kind === "author") return String(item.author || "").split(/\s*(?:\/|&|\be\b)\s*/i).some(author => author.trim().toLowerCase() === normalizedValue);
      return String(item[filter.kind] || "").trim().toLowerCase() === normalizedValue && (filter.kind !== "publisher" || item.type === "comic");
    });
    const collectionFilter = state.collectionFilter || { field: "all", query: "" };
    const items = filter.kind === "publisher" ? uniqueCatalogItems(filterCollectionItems(allItems, collectionFilter.field, collectionFilter.query)) : allItems;
    const labels = { publisher: "Editora", character: "Personagem", imprint: "Selo", author: "Autor", year: "Ano", publication: "Publicação", status: "Status" };
    const title = labels[filter.kind] || "Catálogo";
    const wikiSearch = `https://pt.wikipedia.org/wiki/Especial:Pesquisar?search=${encodeURIComponent(filter.value || "")}`;
    const wikiText = filter.kind === "year" ? `Todos os quadrinhos publicados em ${filter.value}.` : `${filter.value} aparece em ${items.length} edição(ões) do catálogo da Banca Digital.`;
    const wikiMarkup = filter.kind === "year" ? "" : `<section class="entity-wiki"><div class="eyebrow">Wiki rápida</div><p>${escapeHTML(wikiText)}</p><a class="small-btn" href="${escapeHTML(wikiSearch)}" target="_blank" rel="noopener">Pesquisar na Wikipédia</a></section>`;
    if (filter.kind !== "publisher") return `<div class="content"><div class="section-head"><div><div class="eyebrow">Explorar catálogo · ${escapeHTML(title)}</div><h1 class="section-title">${escapeHTML(filter.value)}</h1><div class="section-subtitle">${items.length} edição(ões)</div></div><button class="small-btn" data-section="home">Voltar ao início</button></div>${wikiMarkup}<section class="section"><div class="results-grid">${uniqueCatalogItems(items).map(item => card(item)).join("") || `<div class="empty">Nenhuma edição encontrada.</div>`}</div></section></div>`;
    const setting = state.publisherSettings.get(publisherKey(filter.value));
    const canManage = ["moderator", "admin"].includes(state.profile?.plan);
    const grouped = new Map();
    const initialFor = item => { const initial = String(item.seriesTitle || item.title || "").trim().charAt(0).toUpperCase(); return /[0-9]/.test(initial) ? "0-9" : /^[A-Z]$/.test(initial) ? initial : "#"; };
    items.forEach(item => {
      const imprint = String(item.imprint || "Sem selo").trim() || "Sem selo";
      if (!grouped.has(imprint)) grouped.set(imprint, new Map());
      const initial = initialFor(item);
      if (!grouped.get(imprint).has(initial)) grouped.get(imprint).set(initial, []);
      grouped.get(imprint).get(initial).push(item);
    });
    const initialOrder = ["0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), "#"];
    const publisherGroupMarkupLegacy = groupItems => {
      const seriesGroups = new Map();
      groupItems.forEach(item => {
        const key = item.seriesId || item.id;
        if (!seriesGroups.has(key)) seriesGroups.set(key, []);
        seriesGroups.get(key).push(item);
      });
      return [...seriesGroups.values()].sort((a, b) => String(a[0].seriesTitle || a[0].title).localeCompare(String(b[0].seriesTitle || b[0].title), "pt-BR")).map(seriesItems => {
        const seriesKey = seriesItems[0].seriesId || seriesItems[0].id;
        const expanded = Boolean(state.publisherSeriesExpanded[seriesKey]);
        const orderedItems = seriesItems.sort((a, b) => issueSortValue(a) - issueSortValue(b));
        const visibleItems = expanded ? orderedItems : orderedItems.slice(0, 1);
        return `<div class="publisher-series-group"><div class="publisher-series-heading"><h4 class="publisher-series-title">${escapeHTML(seriesItems[0].seriesTitle || seriesItems[0].title)}</h4>${orderedItems.length > 1 ? `<button class="small-btn publisher-series-toggle" type="button" data-publisher-series-toggle="${escapeHTML(seriesKey)}">${expanded ? "Ocultar edições" : `Mostrar todas (${orderedItems.length})`}</button>` : ""}</div><div class="results-grid">${visibleItems.map(item => card(item)).join("")}</div></div>`;
      }).join("");
    };
    const publisherGroupMarkup = groupItems => {
      const groupedSeries = new Map();
      groupItems.forEach(item => {
        const key = item.seriesId || item.id;
        if (!groupedSeries.has(key)) groupedSeries.set(key, item);
      });
      return [...groupedSeries.values()]
        .sort((a, b) => String(a.seriesTitle || a.title).localeCompare(String(b.seriesTitle || b.title), "pt-BR"))
        .map(item => item.seriesId ? seriesCard(item) : card(item))
        .join("");
    };
    const imprintMarkup = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b, "pt-BR")).map(([imprint, initials]) => `<section class="search-imprint publisher-imprint"><div class="section-head"><div><h2 class="section-title">${escapeHTML(imprint)}</h2><div class="section-subtitle">Selo</div></div></div>${initialOrder.filter(initial => initials.has(initial)).map(initial => `<section class="search-initial"><h3 class="search-initial-title">${initial}</h3><div class="results-grid publisher-initial-grid">${publisherGroupMarkup(initials.get(initial))}</div></section>`).join("")}</section>`).join("");
    return `<div class="content publisher-page"><div class="section-head"><div><div class="eyebrow">Explorar catálogo · Editora</div><h1 class="section-title">${escapeHTML(filter.value)}</h1><div class="section-subtitle">${items.length} edição(ões) da editora</div></div><div class="publisher-page-actions"><button class="small-btn" data-section="home">Voltar ao início</button>${canManage ? `<button class="small-btn" data-publisher-settings="${escapeHTML(filter.value)}">Configurar editora</button>` : ""}</div></div>${wikiMarkup}${setting?.is_pinned ? '<div class="publisher-pin-badge">★ Editora fixada no carrossel</div>' : ""}${imprintMarkup || '<div class="empty">Nenhuma edição encontrada.</div>'}</div>`;
  }

  function renderLoginPage() {
    return `<div class="content auth-page"><div class="auth-card"><div class="eyebrow">Banca Digital</div><h1>Entrar</h1><p class="section-subtitle">Use seu usuário ou email e sua senha para acessar sua estante.</p><form id="auth-form"><div class="field"><label>Usuário ou email</label><input name="username" required placeholder="seu_usuario ou voce@email.com" autocomplete="username"></div><div class="field"><label>Senha</label><input name="password" type="password" required minlength="6" autocomplete="current-password"></div><div class="auth-actions"><button type="submit" class="btn btn-danger" data-auth-mode="login">Entrar</button><button type="button" class="small-btn" data-auth-switch="signup">Criar conta</button></div><button class="link-btn" type="button" data-forgot-password>Esqueci minha senha</button><div class="auth-message" id="auth-message"></div></form></div></div>`;
  }

  function openAccountPlanAdmin() {
    const overlay = document.createElement("div"); overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal"><div class="section-head"><div><h2>Alterar tipo de conta</h2><div class="section-subtitle">Defina o nível de acesso da conta.</div></div><button class="small-btn" data-close>Fechar</button></div><form id="account-plan-form"><div class="form-grid"><div class="field full"><label>@ do usuário</label><input name="username" required placeholder="usuario"></div><div class="field full"><label>Novo tipo de conta</label><select name="plan"><option value="free">Free</option><option value="premium">Premium</option><option value="moderator">Moderador</option></select></div></div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Salvar alteração</button></div></form></div>`;
    $("#modal-root").appendChild(overlay);
    $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#account-plan-form", overlay).onsubmit = async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const username = cleanUsername(form.get("username"));
      const plan = String(form.get("plan") || "free");
      let result = await sb.rpc("set_user_plan", { p_username: username, p_plan: plan });
      if (result.error && /set_user_plan|schema cache|function/i.test(result.error.message)) {
        const profile = await sb.from("profiles").select("id").eq("username", username).maybeSingle();
        if (!profile.data) return toast("Usuário não encontrado.");
        result = await sb.from("profiles").update({ plan }).eq("id", profile.data.id);
      }
      if (result.error) return toast(result.error.message);
      overlay.remove(); toast("Tipo de conta atualizado.");
    };
  }

  function renderSignupPage() {
    return `<div class="content auth-page"><div class="auth-card"><div class="eyebrow">Banca Digital</div><h1>Criar conta</h1><p class="section-subtitle">Crie seu acesso para salvar edições e montar sua estante.</p><form id="auth-form"><div class="field"><label>Usuário</label><input name="username" required pattern="[A-Za-z0-9_]{3,24}" placeholder="seu_usuario" autocomplete="username"></div><div class="field"><label>Email <span class="field-optional">(opcional)</span></label><input name="email" type="email" placeholder="voce@email.com" autocomplete="email"></div><div class="notice auth-notice">Sem email, não será possível recuperar sua conta caso você perca a senha. Contas gratuitas são excluídas após 30 dias de inatividade. Contas premium e admin são mantidas.</div><div class="field"><label>Senha</label><input name="password" type="password" required minlength="6" autocomplete="new-password"></div><div class="auth-actions"><button type="submit" class="btn btn-danger" data-auth-mode="signup">Criar conta</button><button type="button" class="small-btn" data-auth-switch="login">Já tenho uma conta</button></div><div class="auth-message" id="auth-message"></div></form></div></div>`;
  }

  function renderPasswordResetPage() {
    return `<div class="content auth-page"><div class="auth-card"><div class="eyebrow">Banca Digital</div><h1>Nova senha</h1><p class="section-subtitle">Escolha uma nova senha para sua conta.</p><form id="password-reset-form"><div class="field"><label>Nova senha</label><input name="password" type="password" required minlength="6"></div><div class="field"><label>Confirmar senha</label><input name="confirmation" type="password" required minlength="6"></div><button class="btn btn-danger">Salvar nova senha</button><div class="auth-message" id="auth-message"></div></form></div></div>`;
  }

  function localFileCard(file) {
    return `<article class="card local-file-card" data-local-open="${escapeHTML(file.id)}"><div class="cover local-file-cover" data-cover-id="${escapeHTML(file.id)}" style="background-image:url('${escapeHTML(coverFor(file))}')"><span class="local-file-icon">▣</span></div><div class="card-body"><div class="card-title">${escapeHTML(file.title)}</div><div class="card-meta">${escapeHTML(file.format.toUpperCase())} · somente nesta sessão</div></div></article>`;
  }

  function renderLocalBoxPage() {
    if (!state.session) return renderLoginPage();
    const files = state.localBoxFiles;
    return `<div class="content local-box-page"><div class="section-head"><div><div class="eyebrow">Área privada</div><h1 class="section-title">Minha caixa</h1><div class="section-subtitle">Arquivos locais para ler no navegador</div></div><button class="small-btn" data-section="shelf">Voltar à estante</button></div><div class="notice local-box-notice"><b>Privacidade:</b> os arquivos são armazenados apenas neste navegador, na memória desta sessão. Eles não são enviados para o servidor e desaparecem quando você sair da conta ou fechar a página.</div><div class="local-upload-grid"><label class="local-upload-card"><span class="local-upload-icon">▣</span><strong>Enviar uma pasta</strong><span>Adicione vários quadrinhos de uma vez. Eles aparecerão nesta aba.</span><input id="local-folder-input" type="file" webkitdirectory directory multiple accept=".pdf,.cbz,.cbr,.jpg,.jpeg,.png,.webp,.gif"></label><label class="local-upload-card"><span class="local-upload-icon">＋</span><strong>Enviar um arquivo</strong><span>Abre diretamente no leitor e é descartado ao fechá-lo.</span><input id="local-file-input" type="file" accept=".pdf,.cbz,.cbr,.jpg,.jpeg,.png,.webp,.gif"></label></div><section class="section"><div class="section-head"><div><h2 class="section-title">Arquivos da pasta</h2><div class="section-subtitle">${files.length} arquivo(s) nesta sessão</div></div>${files.length ? '<button class="small-btn" data-action="clear-local-box">Limpar caixa</button>' : ''}</div><div class="results-grid">${files.map(localFileCard).join("") || '<div class="empty">Escolha uma pasta para começar sua leitura local.</div>'}</div></section></div>`;
  }

  const SHELF_PREVIEW_LIMIT = 6;

  function shelfCollectionMarkup(title, items, key, progressMap = state.readingProgress, favoriteIds = state.favoriteIds, actions = "", coverChoices = null, renderSeriesCards = false) {
    const expanded = Boolean(state.shelfExpanded[key]);
    const visibleItems = expanded ? items : items.slice(0, SHELF_PREVIEW_LIMIT);
    const likedCollection = key === "read" && state.section === "shelf" ? shelfCollectionMarkup("Curtidas", shelfItemsByIds([...state.comicLikeIds]), "liked") : "";
    const directOpen = state.section === "shelf" || (state.section === "public-profile" && state.publicProfile?.collectionId);
    return `<section class="section shelf-collection"><div class="section-head"><div><h2 class="section-title">${escapeHTML(title)}</h2><div class="section-subtitle">${items.length} item(ns)</div></div><div class="shelf-section-actions">${actions}${items.length > SHELF_PREVIEW_LIMIT ? `<button class="small-btn" data-shelf-expand="${escapeHTML(key)}">${expanded ? "Mostrar menos" : "Ver todos"}</button>` : ""}</div></div><div class="results-grid">${visibleItems.map(item => renderSeriesCards && item.seriesId ? seriesCard(item, favoriteIds) : card(item, progressMap, favoriteIds, directOpen, coverChoices)).join("") || '<div class="empty">Nenhum item nesta coleção.</div>'}</div></section>${likedCollection}`;
  }

  function isSeriesId(id) {
    const value = String(id || "");
    return (window.DEFAULT_SERIES || []).some(series => series.id === value)
      || state.db.library.some(item => item.id === value && item.seriesId === value);
  }

  function shelfItemsByIds(ids, unique = false) {
    const allowed = new Set(ids);
    const items = state.db.library.filter(item => allowed.has(item.id));
    const savedSeries = [...allowed].filter(isSeriesId).map(seriesId => state.db.library.find(item => item.seriesId === seriesId)).filter(Boolean);
    items.push(...savedSeries);
    return unique ? uniqueCatalogItems(items) : items;
  }

  function publicCollectionItems(category, publicState) {
    return shelfItemsByIds(category.itemIds || []).filter(item => publicState.favoriteIds.has(item.id) || (item.seriesId && publicState.favoriteIds.has(item.seriesId)));
  }

  function followSummary(profileId, followerCount, followingCount) {
    return `<div class="profile-follow-summary"><button class="profile-follow-link" data-follow-list="followers" data-follow-profile-id="${escapeHTML(profileId)}">${followerCount || 0} seguidores</button><span> · </span><button class="profile-follow-link" data-follow-list="following" data-follow-profile-id="${escapeHTML(profileId)}">${followingCount || 0} seguindo</button></div>`;
  }

  async function openFollowList(kind, profileId) {
    if (!sb || !profileId) return toast("A lista de seguidores ainda não está disponível.");
    const isFollowers = kind === "followers";
    const relation = isFollowers
      ? await sb.from("profile_follows").select("follower_id").eq("following_id", profileId)
      : await sb.from("profile_follows").select("following_id").eq("follower_id", profileId);
    if (relation.error) return toast("Não foi possível carregar essa lista.");
    const ids = (relation.data || []).map(row => isFollowers ? row.follower_id : row.following_id).filter(Boolean);
    const profiles = ids.length ? await sb.from("profiles").select("id, username, avatar_url, title").in("id", ids) : { data: [] };
    if (profiles.error) return toast("Não foi possível carregar os perfis.");
    const byId = new Map((profiles.data || []).map(profile => [profile.id, profile]));
    const title = isFollowers ? "Seguidores" : "Seguindo";
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal follow-list-modal"><div class="section-head"><div><h2>${title}</h2><div class="section-subtitle">${ids.length} perfil(is)</div></div><button class="small-btn" data-close>Fechar</button></div><div class="follow-list">${ids.map(id => { const profile = byId.get(id); return profile ? `<a class="follow-list-item" href="${escapeHTML(publicProfileHref(profile.username))}"><img src="${escapeHTML(profile.avatar_url || "https://i.pinimg.com/736x/be/17/10/be1710edaace144c17bdaf6deb2d2cc8.jpg")}" alt=""><span><b>@${escapeHTML(profile.username)}</b>${profile.title ? `<small>${escapeHTML(profile.title)}</small>` : ""}</span></a>` : ""; }).join("") || '<div class="empty">Nenhum perfil nesta lista.</div>'}</div></div>`;
    $("#modal-root").appendChild(overlay);
    $("[data-close]", overlay).onclick = () => overlay.remove();
  }

  const CHAT_ROOMS = [
    { id: "geral", name: "Chat Geral", access: "public" },
    { id: "decenautas", name: "Decenautas", access: "public" },
    { id: "marvetes", name: "Marvetes", access: "public" },
    { id: "leitores-colecionadores", name: "Leitores e Colecionadores", access: "premium" },
    { id: "staff", name: "Chat da Staff", access: "staff" }
  ];

  function canOpenChatRoom(room) {
    return room.access === "public"
      || (room.access === "premium" && ["premium", "admin"].includes(state.profile?.plan))
      || (room.access === "staff" && ["moderator", "admin"].includes(state.profile?.plan));
  }

  function chatRoomLabel(room) {
    return room.access === "premium" ? "Premium" : room.access === "staff" ? "Staff" : "Público";
  }

  function chatMessageMarkup(message, profile = {}) {
    const username = cleanUsername(profile.username || "usuário");
    const title = String(profile.title || "").trim();
    return `<div class="chat-message ${message.sender_id === state.session.user.id ? "is-mine" : ""}"><a class="chat-message-author" href="${escapeHTML(publicProfileHref(username))}" target="_blank" rel="noopener">${avatarMarkup({ ...profile, username }, "chat-message-avatar")}<span><b>@${escapeHTML(username)}</b>${title ? `<em style="--title-bg:${safeTitleColor(profile.title_color)}">${escapeHTML(title)}</em>` : ""}</span></a><div>${escapeHTML(message.body)}</div><small>${escapeHTML(formatCommentDate(message.created_at))}</small></div>`;
  }

  async function openChatRoom(room) {
    if (!state.session || !sb || !room || !canOpenChatRoom(room)) return toast("Você não tem acesso a esta sala.");
    $$('.chat-modal').forEach(modal => modal.closest('.modal-backdrop')?.remove());
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal chat-modal"><div class="section-head"><div><h2>${escapeHTML(room.name)}</h2><div class="section-subtitle">Sala ${chatRoomLabel(room).toLowerCase()} · mensagens expiram em 24 horas</div></div><button class="small-btn" data-close>Fechar</button></div><div class="chat-messages" data-chat-messages><div class="empty">Carregando mensagens...</div></div><form class="chat-compose" id="chat-room-compose"><textarea name="body" maxlength="2000" rows="2" required placeholder="Escreva uma mensagem ou marque alguém com @usuario"></textarea><button type="submit" class="btn btn-danger">Enviar</button></form></div>`;
    $("#modal-root").appendChild(overlay);
    let closed = false;
    let channel = null;
    const close = event => {
      event?.preventDefault();
      event?.stopPropagation();
      if (closed) return;
      closed = true;
      channel?.unsubscribe();
      overlay.remove();
    };
    $("[data-close]", overlay).onclick = close;
    const messagesRoot = $("[data-chat-messages]", overlay);
    const renderMessages = async () => {
      const result = await sb.from("chat_messages").select("id, sender_id, body, created_at, profiles!chat_messages_sender_id_fkey(username, avatar_url, title, title_color, plan)").eq("room_id", room.id).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: true }).limit(200);
      if (result.error) return messagesRoot.innerHTML = '<div class="empty">Não foi possível carregar as mensagens.</div>';
      messagesRoot.innerHTML = (result.data || []).map(message => chatMessageMarkup(message, message.profiles || {})).join("") || '<div class="empty">Nenhuma mensagem ainda.</div>';
      messagesRoot.scrollTop = messagesRoot.scrollHeight;
    };
    await renderMessages();
    channel = sb.channel(`chat-room-${room.id}-${state.session.user.id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${room.id}` }, payload => { if (payload.new?.room_id === room.id) renderMessages(); }).subscribe();
    $("#chat-room-compose", overlay).onsubmit = async event => {
      event.preventDefault();
      const composeForm = event.currentTarget;
      const form = new FormData(composeForm);
      const body = String(form.get("body") || "").trim();
      const button = $("button[type=submit]", composeForm);
      if (!body || button.disabled) return;
      button.disabled = true;
      const result = await sb.from("chat_messages").insert({ sender_id: state.session.user.id, room_id: room.id, recipient_id: null, body, expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() });
      if (result.error) { console.error("[chat room] erro ao enviar mensagem", result.error); toast(result.error.message || "Não foi possível enviar a mensagem."); }
      else { composeForm.reset(); await renderMessages(); }
      button.disabled = false;
    };
  }

  async function openChat(contact = null) {
    $$('.notifications-popup-modal').forEach(modal => modal.closest('.modal-backdrop')?.remove());
    $$('.chat-modal').forEach(modal => modal.closest('.modal-backdrop')?.remove());
    if (!state.session || !sb) return openAuthPage();
    if (contact?.id === state.session.user.id) return toast("Você não pode enviar mensagens para si mesmo.");
    state.chatContact = contact?.id ? contact : null;
    if (contact?.id) {
      state.notifications = state.notifications.filter(notification => !isNotificationFromOpenChat(notification));
      state.notificationUnreadCount = state.notifications.filter(notification => !notification.read_at).length;
    }
    (contact?.id ? markChatNotificationsRead(contact.id) : Promise.resolve())
      .then(() => loadNotifications())
      .then(() => render());
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal chat-modal"><div class="section-head"><div><h2>Mensagens</h2><div class="section-subtitle">As mensagens desaparecem após 24 horas.</div></div><button class="small-btn" data-close>Fechar</button></div><div class="chat-contact-picker">${contact ? `<div class="chat-contact-selected">Conversando com <b>@${escapeHTML(contact.username)}</b></div>` : `<form id="chat-contact-form"><input name="username" required placeholder="Nome de usuário"><button type="submit" class="small-btn">Abrir conversa</button></form>`}</div>${contact ? `<div class="chat-messages" data-chat-messages><div class="empty">Carregando mensagens...</div></div><form class="chat-compose" id="chat-compose"><textarea name="body" maxlength="2000" rows="2" required placeholder="Escreva uma mensagem"></textarea><button type="submit" class="btn btn-danger">Enviar</button></form>` : `<div class="notice">Abra o perfil de um usuário e clique em “Enviar mensagem”, ou pesquise o nome de usuário acima.</div>`}</div>`;
    $("#modal-root").appendChild(overlay);
    let closed = false;
    const close = event => {
      event?.preventDefault();
      event?.stopPropagation();
      if (closed) return;
      closed = true;
      state.chatContact = null;
      channel?.unsubscribe();
      overlay.remove();
      loadNotifications().then(() => render());
    };
    $("[data-close]", overlay).onclick = close;
    let channel = null;
    if (!contact) {
      const availableRooms = CHAT_ROOMS.filter(canOpenChatRoom);
      $(".chat-contact-picker", overlay).insertAdjacentHTML("afterbegin", `<div class="chat-room-list"><div class="chat-room-list-title">Salas de conversa</div>${availableRooms.map(room => `<button type="button" class="chat-room-option" data-chat-room="${escapeHTML(room.id)}"><span>${escapeHTML(room.name)}</span><small>${chatRoomLabel(room)}</small></button>`).join("")}</div>`);
      $$('[data-chat-room]', overlay).forEach(button => button.onclick = () => { overlay.remove(); openChatRoom(CHAT_ROOMS.find(room => room.id === button.dataset.chatRoom)); });
      $("#chat-contact-form", overlay).onsubmit = async event => {
        event.preventDefault();
        const username = String(new FormData(event.currentTarget).get("username") || "").trim();
        if (!username) return;
        const result = await sb.from("profiles").select("id, username, avatar_url, title").ilike("username", username).maybeSingle();
        if (result.error || !result.data) return toast("Usuário não encontrado.");
        overlay.remove();
        openChat(result.data);
      };
      return;
    }
    const messagesRoot = $("[data-chat-messages]", overlay);
    const renderMessages = async () => {
      const now = new Date().toISOString();
      const result = await sb.from("chat_messages").select("id, sender_id, body, created_at").or(`and(sender_id.eq.${state.session.user.id},recipient_id.eq.${contact.id}),and(sender_id.eq.${contact.id},recipient_id.eq.${state.session.user.id})`).gt("expires_at", now).order("created_at", { ascending: true }).limit(200);
      if (result.error) return messagesRoot.innerHTML = '<div class="empty">Não foi possível carregar as mensagens.</div>';
      const senderIds = [...new Set((result.data || []).map(message => message.sender_id).filter(Boolean))];
      const profilesResult = senderIds.length ? await sb.from("profiles").select("id, username, avatar_url, title, title_color, plan").in("id", senderIds) : { data: [] };
      const profilesById = new Map((profilesResult.data || []).map(profile => [profile.id, profile]));
      messagesRoot.innerHTML = (result.data || []).map(message => chatMessageMarkup(message, profilesById.get(message.sender_id) || (message.sender_id === state.session.user.id ? state.profile : {}))).join("") || '<div class="empty">Nenhuma mensagem ainda.</div>';
      messagesRoot.scrollTop = messagesRoot.scrollHeight;
    };
    await renderMessages();
    channel = sb.channel(`chat-${state.session.user.id}-${contact.id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `recipient_id=eq.${state.session.user.id}` }, payload => { if (payload.new?.sender_id === contact.id) renderMessages(); }).subscribe();
    $("#chat-compose", overlay).onsubmit = async event => {
      event.preventDefault();
      const composeForm = event.currentTarget;
      const form = new FormData(event.currentTarget);
      const body = String(form.get("body") || "").trim();
      if (!body) return;
      const submitButton = $("button[type=submit]", event.currentTarget);
      if (!submitButton || submitButton.disabled) return;
      submitButton.disabled = true;
      const optimisticId = `chat-pending-${Date.now()}`;
      messagesRoot.insertAdjacentHTML("beforeend", `<div class="chat-message is-mine chat-message-pending" data-chat-pending="${optimisticId}"><div>${escapeHTML(body)}</div><small>Enviando…</small></div>`);
      event.currentTarget.reset();
      messagesRoot.scrollTop = messagesRoot.scrollHeight;
      const result = await sb.from("chat_messages").insert({ sender_id: state.session.user.id, recipient_id: contact.id, body, expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() });
      if (result.error) {
        $(`[data-chat-pending="${optimisticId}"]`, messagesRoot)?.remove();
        submitButton.disabled = false;
        console.error("[private chat] erro ao enviar mensagem", result.error);
        return toast(result.error.message || "Não foi possível enviar a mensagem.");
      }
      await renderMessages();
      submitButton.disabled = false;
    };
  }

  async function saveShelfCategories(categories) {
    if (sb && state.session) {
      const rows = categories.map(category => ({ id: category.id, owner_id: state.session.user.id, name: category.name, cover_url: category.coverUrl || null, is_public: category.isPublic !== false, item_ids: category.itemIds || [], collection_type: "comic", blog_ids: [], is_featured: category.is_featured === true }));
      const result = rows.length ? await sb.from("shelf_collections").upsert(rows, { onConflict: "id" }) : { error: null };
      if (result.error) return toast("Não foi possível salvar a organização da estante.");
      const ids = rows.map(row => row.id);
      const existing = await sb.from("shelf_collections").select("id").eq("owner_id", state.session.user.id).eq("collection_type", "comic");
      const removedIds = (existing.data || []).map(row => row.id).filter(id => !ids.includes(id));
      if (removedIds.length) await sb.from("shelf_collections").delete().eq("owner_id", state.session.user.id).in("id", removedIds);
    }
    render();
    toast("Estante atualizada.");
  }

  async function copyCollectionLink(categoryId, username = state.profile?.username) {
    if (!username || !categoryId) return;
    const link = new URL(publicProfileHref(username, categoryId), window.location.href).href;
    try {
      await navigator.clipboard.writeText(link);
      toast("Link da coleção copiado.");
    } catch {
      window.prompt("Copie o link da coleção:", link);
    }
  }

  function openShelfCategoryForm(categoryId = null) {
    const existing = state.shelfCategories.find(category => category.id === categoryId);
    const savedItems = shelfItemsByIds([...ensureShelfSnapshot().saved]);
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal"><div class="section-head"><div><h2>${existing ? "Editar coleção" : "Nova coleção"}</h2><div class="section-subtitle">Organize seus itens salvos e escolha se a coleção será compartilhável</div></div><button class="small-btn" data-close>Fechar</button></div><form id="shelf-category-form"><div class="form-grid"><div class="field full"><label>Nome da coleção</label><input name="name" required maxlength="60" value="${escapeHTML(existing?.name || "")}" placeholder="Ex.: Favoritos, Para reler"></div><div class="field full"><label>Imagem da coleção (opcional)</label><input name="coverUrl" type="url" value="${escapeHTML(existing?.coverUrl || "")}" placeholder="https://.../imagem.jpg"><small class="format-hint">Apenas para coleções públicas.</small></div><div class="field full"><label><input name="isPublic" type="checkbox" ${existing?.isPublic !== false ? "checked" : ""}> Coleção pública — aparecerá no perfil e poderá ser compartilhada</label></div><div class="field full"><label>Quadrinhos nesta coleção</label><div class="collection-picker">${savedItems.map(item => `<label><input type="checkbox" name="itemIds" value="${escapeHTML(item.id)}" ${existing?.itemIds?.includes(item.id) ? "checked" : ""}> ${escapeHTML(item.seriesTitle || item.title)}${item.issue ? ` — ${escapeHTML(item.issue)}` : ""}</label>`).join("") || "Salve algum quadrinho primeiro."}</div></div></div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Salvar coleção</button></div></form></div>`;
    $("#modal-root").appendChild(overlay);
    $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#shelf-category-form", overlay).onsubmit = async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const category = { id: existing?.id || `shelf-${Date.now()}`, name: String(form.get("name") || "").trim(), coverUrl: String(form.get("coverUrl") || "").trim(), isPublic: form.get("isPublic") === "on", itemIds: form.getAll("itemIds") };
      if (!category.name) return;
      const categories = existing ? state.shelfCategories.map(item => item.id === category.id ? category : item) : [...state.shelfCategories, category];
      state.shelfCategories = categories;
      overlay.remove();
      await saveShelfCategories(categories);
    };
  }

  function deleteShelfCategory(categoryId) {
    state.shelfCategories = state.shelfCategories.filter(category => category.id !== categoryId);
    saveShelfCategories(state.shelfCategories);
  }

  function blogShelfCollectionMarkup(collection, posts, editable = false) {
    const items = (collection.blogIds || []).map(id => posts.find(post => String(post.id) === String(id))).filter(Boolean);
    const staff = ["moderator", "admin"].includes(state.profile?.plan);
    const profileUsername = state.publicProfile?.profile?.username || state.profile?.username || "";
    return `<section class="section shelf-collection blog-shelf-collection"><div class="section-head"><div><h2 class="section-title">${escapeHTML(collection.name)}</h2><div class="section-subtitle">${items.length} blog(s)</div></div><div class="shelf-section-actions">${collection.isPublic !== false ? `<span class="shelf-visibility is-public">${collection.is_featured ? "Destaque · " : ""}Pública</span><button class="small-btn" data-copy-collection="${escapeHTML(collection.id)}" data-copy-username="${escapeHTML(profileUsername)}">Compartilhar</button>${!editable && profileUsername ? `<a class="small-btn" href="${escapeHTML(publicProfileHref(profileUsername, collection.id))}">Abrir</a>` : ""}` : '<span class="shelf-visibility is-private">Privada</span>'}${staff && collection.isPublic !== false ? `<button class="small-btn" data-collection-feature="${escapeHTML(collection.id)}" data-collection-featured="${collection.is_featured ? "true" : "false"}">${collection.is_featured ? "Remover destaque" : "Destacar"}</button>` : ""}${editable ? `<button class="small-btn" data-blog-shelf-edit="${escapeHTML(collection.id)}">Editar</button><button class="small-btn danger" data-blog-shelf-delete="${escapeHTML(collection.id)}">Excluir</button>` : ""}</div></div><div class="blog-shelf-grid">${items.map(post => blogCard(post)).join("") || '<div class="empty">Nenhum blog nesta coleção.</div>'}</div></section>`;
  }

  function blogShelfPanelMarkup(publicState = null) {
    const authored = publicState ? publicState.authoredBlogPosts || [] : state.authoredBlogPosts;
    const saved = publicState ? [...(publicState.savedBlogPosts || []), ...(publicState.collectionBlogPosts || [])] : state.savedBlogPosts;
    const collections = (publicState ? publicState.blogCollections || [] : state.blogShelfCategories).filter(collection => !publicState || collection.isPublic !== false);
    const posts = [...new Map([...authored, ...saved].map(post => [String(post.id), post])).values()];
    const canEdit = !publicState;
    return `<div class="blog-shelf-panel"><div class="section-head"><div><h2 class="section-title">Blogs</h2><div class="section-subtitle">Blogs escritos e salvos por esta pessoa.</div></div>${canEdit ? '<button class="small-btn" data-blog-shelf-new>+ Nova coleção</button>' : ""}</div><section class="section shelf-collection"><div class="section-head"><div><h2 class="section-title">Escritos</h2><div class="section-subtitle">${authored.length} blog(s)</div></div></div><div class="blog-shelf-grid">${authored.map(post => blogCard(post)).join("") || '<div class="empty">Nenhum blog escrito ainda.</div>'}</div></section><section class="section shelf-collection"><div class="section-head"><div><h2 class="section-title">Salvos</h2><div class="section-subtitle">${saved.length} blog(s)</div></div></div><div class="blog-shelf-grid">${saved.map(post => blogCard(post)).join("") || '<div class="empty">Nenhum blog salvo ainda.</div>'}</div></section>${collections.map(collection => blogShelfCollectionMarkup(collection, posts, canEdit)).join("")}</div>`;
  }

  function openBlogShelfCollectionForm(collectionId = null) {
    const existing = state.blogShelfCategories.find(collection => collection.id === collectionId);
    const posts = [...new Map([...state.authoredBlogPosts, ...state.savedBlogPosts].map(post => [String(post.id), post])).values()];
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal"><div class="section-head"><div><h2>${existing ? "Editar coleção de blogs" : "Nova coleção de blogs"}</h2><div class="section-subtitle">Organize blogs escritos ou salvos.</div></div><button class="small-btn" data-close>Fechar</button></div><form id="blog-shelf-collection-form"><div class="field"><label>Nome da coleção</label><input name="name" maxlength="60" required value="${escapeHTML(existing?.name || "")}" placeholder="Ex.: Notícias favoritas"></div><div class="field"><label>Imagem da coleção (opcional)</label><input name="coverUrl" type="url" value="${escapeHTML(existing?.coverUrl || "")}" placeholder="https://..."></div><div class="field"><label><input name="isPublic" type="checkbox" ${existing?.isPublic !== false ? "checked" : ""}> Coleção pública</label></div><div class="field"><label>Blogs</label><div class="collection-picker">${posts.map(post => `<label><input type="checkbox" name="blogIds" value="${escapeHTML(post.id)}" ${existing?.blogIds?.includes(String(post.id)) ? "checked" : ""}> ${escapeHTML(post.title)}</label>`).join("") || "Salve ou escreva algum blog primeiro."}</div></div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger" type="submit">${existing ? "Salvar alterações" : "Criar coleção"}</button></div></form></div>`;
    $("#modal-root").appendChild(overlay);
    $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#blog-shelf-collection-form", overlay).onsubmit = async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const name = String(form.get("name") || "").trim();
      const blogIds = form.getAll("blogIds");
      if (!name) return;
      const payload = { owner_id: state.session.user.id, name, cover_url: String(form.get("coverUrl") || "").trim() || null, is_public: form.get("isPublic") === "on", collection_type: "blog", blog_ids: blogIds, item_ids: [] };
      const result = existing ? await sb.from("shelf_collections").update(payload).eq("id", existing.id).eq("owner_id", state.session.user.id) : await sb.from("shelf_collections").insert({ id: `blog-shelf-${Date.now()}`, ...payload });
      if (result.error) return toast("Não foi possível criar a coleção de blogs.");
      overlay.remove();
      await loadAccount();
    };
  }

  async function deleteBlogShelfCollection(id) {
    const result = await sb.from("shelf_collections").delete().eq("id", id).eq("owner_id", state.session.user.id);
    if (result.error) return toast("Não foi possível excluir a coleção.");
    await loadAccount();
  }

  function publicCollectionCard(collection, canManage = false) {
    const blog = collection.collection_type === "blog";
    const count = blog ? (Array.isArray(collection.blog_ids) ? collection.blog_ids.length : 0) : (Array.isArray(collection.item_ids) ? collection.item_ids.length : 0);
    const cover = collection.cover_url || instantCover({ title: collection.name });
    return `<article class="public-shelf-collection-card" data-public-collection="${escapeHTML(collection.id)}" data-public-owner="${escapeHTML(collection.username || "")}" role="link" tabindex="0"><div class="public-shelf-collection-cover has-image" style="background-image:url('${escapeHTML(cover)}')"></div><div class="public-shelf-collection-info"><div class="eyebrow">${collection.is_featured ? "Destaque · " : ""}${blog ? "Blogs" : "Quadrinhos"}</div><h3>${escapeHTML(collection.name)}</h3><p>${count} item(ns) · @${escapeHTML(collection.username || "usuário")}</p><div class="shelf-section-actions"><span class="shelf-visibility is-public">Pública</span><a class="small-btn" href="${escapeHTML(publicProfileHref(collection.username, collection.id))}">Abrir</a>${canManage ? `<button class="small-btn" data-copy-collection="${escapeHTML(collection.id)}" data-copy-username="${escapeHTML(collection.username)}">Compartilhar</button><button class="small-btn" data-collection-feature="${escapeHTML(collection.id)}" data-collection-featured="${collection.is_featured ? "true" : "false"}">${collection.is_featured ? "Remover destaque" : "Destacar"}</button>` : ""}</div></div></article>`;
  }

  async function toggleShelfCollectionFeatured(id, featured) {
    if (!["moderator", "admin"].includes(state.profile?.plan)) return;
    const result = await sb.from("shelf_collections").update({ is_featured: !featured }).eq("id", id);
    if (result.error) return toast("Não foi possível atualizar o destaque da coleção.");
    if (state.section === "public-profile" && state.publicProfile?.profile) await loadPublicProfile(state.publicProfile.profile.username, state.publicProfile.collectionId || null);
    else await loadAccount();
  }

  function renderShelfPage() {
    if (!state.session) return renderLoginPage();
    const snapshot = ensureShelfSnapshot();
    const savedItems = shelfItemsByIds([...snapshot.saved].filter(id => !isSeriesId(id)), false).map(item => ({ ...item, seriesId: null }));
    const savedSeries = shelfItemsByIds([...snapshot.saved].filter(isSeriesId), true);
    const readItems = shelfItemsByIds([...snapshot.read]).map(item => ({ ...item, seriesId: null }));
    const completedItems = completedSeriesItems(state.readingProgress);
    const canCustomize = ["admin", "moderator", "premium"].includes(state.profile?.plan);
    const categories = state.shelfCategories.map(category => ({ ...category, itemIds: (category.itemIds || []).filter(id => snapshot.saved.has(id)) }));
    return `<div class="content"><div class="profile-header">${avatarMarkup(state.profile)}<div><div class="eyebrow">@${escapeHTML(state.profile?.username || "")}</div>${state.profile?.title ? `<div class="profile-title" style="--title-bg:${safeTitleColor(state.profile.title_color)}">${escapeHTML(state.profile.title)}</div>` : ""}${trophyRoom(state.achievements)}</div><div class="profile-actions"><button class="small-btn" data-action="profile">Editar perfil</button><button class="small-btn" data-action="logout">Sair</button></div></div><div class="section-head"><div><h1 class="section-title">Minha estante</h1><div class="section-subtitle">Coleções fixas para organizar seus quadrinhos e séries</div></div><button class="btn btn-danger" data-action="open-local-box">Abrir caixa</button></div><div class="notice local-box-notice"><b>Minha caixa:</b> leia arquivos do seu computador sem enviá-los para o servidor. Tudo fica apenas neste navegador e some quando você sair.</div>${shelfCollectionMarkup("Salvos", savedItems, "saved")}${state.profile?.shelf_series_public !== false ? shelfCollectionMarkup("Séries salvas", savedSeries, "series-saved", state.readingProgress, state.favoriteIds, "", null, true) : ""}${shelfCollectionMarkup("Lidos", readItems, "read")}${state.profile?.shelf_completed_public !== false ? shelfCollectionMarkup("Concluídos", completedItems, "completed", state.readingProgress, state.favoriteIds, "", null, true) : ""}${canCustomize ? `<section class="section shelf-categories"><div class="section-head"><div><h2 class="section-title">Coleções pessoais</h2><div class="section-subtitle">Misture séries e edições na mesma coleção</div></div><button class="small-btn" data-shelf-new-category>+ Nova coleção</button></div>${categories.map(category => shelfCollectionMarkup(category.name, shelfItemsByIds(category.itemIds), `category:${category.id}`, state.readingProgress, state.favoriteIds, `<span class="shelf-visibility ${category.isPublic !== false ? "is-public" : "is-private"}">${category.isPublic !== false ? "Pública" : "Privada"}</span>${category.isPublic !== false ? `<button class="small-btn" data-copy-collection="${escapeHTML(category.id)}">Compartilhar</button>` : ""}<button class="small-btn" data-shelf-edit-category="${escapeHTML(category.id)}">Editar</button><button class="small-btn danger" data-shelf-delete-category="${escapeHTML(category.id)}">Excluir</button>`)).join("") || '<div class="empty">Crie uma coleção para começar a organizar seus salvos.</div>'}</section>` : ""}</div>`;
  }

  function renderPublicCollectionPage(publicState, category) {
    const profile = publicState.profile;
    const allItems = publicCollectionItems(category, publicState);
    const filter = state.collectionFilter || { field: "all", query: "" };
    const items = filterCollectionItems(allItems, filter.field, filter.query);
    const isLiked = publicState.collectionLikes?.has(category.id);
    const likes = publicState.collectionLikeCounts?.get(category.id) || 0;
    const cover = category.coverUrl ? `style="background-image:url('${escapeHTML(category.coverUrl)}')"` : "";
    return `<div class="content public-collection-page"><div class="public-collection-hero"><div class="public-collection-icon ${category.coverUrl ? "has-cover" : ""}" ${cover}>${category.coverUrl ? "" : "▣"}</div><div><div class="eyebrow">Coleção pública</div><h1 class="section-title">${escapeHTML(category.name)}</h1><div class="collection-creator-block">${avatarMarkup(profile, "collection-creator-avatar")}<div><a class="collection-creator" href="${escapeHTML(publicProfileHref(profile.username))}">@${escapeHTML(profile.username)}</a>${profile.title ? `<div class="collection-creator-title" style="--title-bg:${safeTitleColor(profile.title_color)}">${escapeHTML(profile.title)}</div>` : ""}</div></div><div class="section-subtitle">${allItems.length} item(ns)</div></div></div><div class="section-head"><div><h2 class="section-title">${escapeHTML(category.name)}</h2><div class="section-subtitle">Uma coleção compartilhada da Banca Digital</div></div><div class="shelf-section-actions"><button class="small-btn ${isLiked ? "is-liked" : ""}" data-like-collection="${escapeHTML(category.id)}" data-like-owner="${escapeHTML(profile.id)}">${isLiked ? "♥ Curtida" : "♡ Curtir"} · ${likes}</button><button class="small-btn" data-copy-collection="${escapeHTML(category.id)}" data-copy-username="${escapeHTML(profile.username)}">Copiar link</button><a class="small-btn" href="${escapeHTML(publicProfileHref(profile.username))}">Ver perfil</a></div></div><form class="collection-filter" data-collection-filter-form><select name="field"><option value="all" ${filter.field === "all" ? "selected" : ""}>Filtrar por qualquer campo</option><option value="author" ${filter.field === "author" ? "selected" : ""}>Autor</option><option value="publisher" ${filter.field === "publisher" ? "selected" : ""}>Editora</option><option value="character" ${filter.field === "character" ? "selected" : ""}>Personagem</option><option value="tag" ${filter.field === "tag" ? "selected" : ""}>Gênero / tag</option><option value="seriesTitle" ${filter.field === "seriesTitle" ? "selected" : ""}>Série</option><option value="title" ${filter.field === "title" ? "selected" : ""}>Título</option></select><input name="query" value="${escapeHTML(filter.query)}" placeholder="Digite para filtrar a coleção"><button class="small-btn">Filtrar</button></form><div class="collection-results-meta">${items.length} de ${allItems.length} item(ns)</div><div class="results-grid">${items.map(item => card(item, publicState.readingProgress, publicState.favoriteIds)).join("") || '<div class="empty">Nenhum quadrinho corresponde ao filtro.</div>'}</div></div>`;
  }

  function renderPublicBlogCollectionPage(publicState, collection) {
    const profile = publicState.profile;
    const posts = (collection.blogIds || [])
      .map(id => (publicState.authoredBlogPosts || []).find(post => String(post.id) === String(id)) || (publicState.savedBlogPosts || []).find(post => String(post.id) === String(id)) || (publicState.collectionBlogPosts || []).find(post => String(post.id) === String(id)))
      .filter(Boolean);
    return `<div class="content public-collection-page public-blog-collection-page"><div class="public-collection-hero"><div class="public-collection-icon ${collection.coverUrl ? "has-cover" : ""}" ${collection.coverUrl ? `style="background-image:url('${escapeHTML(collection.coverUrl)}')"` : ""}>${collection.coverUrl ? "" : "✎"}</div><div><div class="eyebrow">Coleção pública de blogs</div><h1 class="section-title">${escapeHTML(collection.name)}</h1><div class="collection-creator-block">${avatarMarkup(profile, "collection-creator-avatar")}<div><a class="collection-creator" href="${escapeHTML(publicProfileHref(profile.username))}">@${escapeHTML(profile.username)}</a>${profile.title ? `<div class="collection-creator-title" style="--title-bg:${safeTitleColor(profile.title_color)}">${escapeHTML(profile.title)}</div>` : ""}</div></div><div class="section-subtitle">${posts.length} blog(s)</div></div></div><div class="section-head"><div><h2 class="section-title">${escapeHTML(collection.name)}</h2><div class="section-subtitle">Uma coleção pública de blogs da Banca Digital</div></div><div class="shelf-section-actions"><button class="small-btn" data-copy-collection="${escapeHTML(collection.id)}" data-copy-username="${escapeHTML(profile.username)}">Compartilhar</button><a class="small-btn" href="${escapeHTML(publicProfileHref(profile.username))}">Ver perfil</a></div></div><div class="blog-shelf-grid">${posts.map(post => blogCard(post)).join("") || '<div class="empty">Nenhum blog nesta coleção.</div>'}</div></div>`;
  }

  function filterCollectionItems(items, field, query) {
    const normalized = String(query || "").trim().toLowerCase();
    if (!normalized) return items;
    return items.filter(item => {
      const values = field === "tag" ? (item.tags || []) : field === "all" ? [item.title, item.seriesTitle, item.author, item.publisher, item.character, ...(item.tags || [])] : [item[field]];
      return values.some(value => String(value || "").toLowerCase().includes(normalized));
    });
  }

  async function toggleCollectionLike(ownerId, collectionId) {
    if (!state.session) return openAuthPage();
    const publicState = state.publicProfile;
    if (!publicState?.collectionLikes) return;
    const liked = publicState.collectionLikes.has(collectionId);
    const query = sb.from("shelf_collection_likes");
    const result = liked
      ? await query.delete().eq("owner_id", ownerId).eq("collection_id", collectionId).eq("user_id", state.session.user.id)
      : await query.insert({ owner_id: ownerId, collection_id: collectionId, user_id: state.session.user.id });
    if (result.error) return toast("Não foi possível atualizar a curtida.");
    if (liked) {
      publicState.collectionLikes.delete(collectionId);
      publicState.collectionLikeCounts.set(collectionId, Math.max(0, (publicState.collectionLikeCounts.get(collectionId) || 1) - 1));
    } else {
      publicState.collectionLikes.add(collectionId);
      publicState.collectionLikeCounts.set(collectionId, (publicState.collectionLikeCounts.get(collectionId) || 0) + 1);
    }
    render();
  }

  async function runModerationAction(target, action, duration = null, title = null, titleColor = null) {
    if (!sb || !target?.username) return;
    const result = await sb.rpc("moderate_user", { p_username: target.username, p_action: action, p_duration: duration, p_title: title, p_title_color: titleColor });
    if (result.error) return toast(result.error.message || "Não foi possível aplicar a moderação.");
    toast("Ação de moderação aplicada.");
    await loadPublicProfile(target.username, state.publicProfile?.collectionId || null);
  }

  function attachPlanControl(overlay, target) {
    if (!overlay || !target || !["moderator", "admin"].includes(state.profile?.plan)) return;
    const historySection = $(".moderation-history", overlay)?.closest(".moderation-section");
    if (!historySection) return;
    const planSection = document.createElement("section");
    planSection.className = "moderation-section";
    planSection.innerHTML = `<h3>Tipo de conta</h3><form id="moderation-plan-form"><div class="moderation-plan-row"><select name="plan"><option value="free" ${target.plan === "free" ? "selected" : ""}>Free</option><option value="premium" ${target.plan === "premium" ? "selected" : ""}>Premium</option></select><button class="small-btn" type="submit">Salvar tipo</button></div></form>`;
    historySection.before(planSection);
    $("#moderation-plan-form", planSection).onsubmit = async event => {
      event.preventDefault();
      const plan = String(new FormData(event.currentTarget).get("plan") || "free");
      const result = await sb.rpc("set_user_plan", { p_username: target.username, p_plan: plan });
      if (result.error) return toast(result.error.message || "Não foi possível alterar o tipo de conta.");
      toast("Tipo de conta atualizado.");
      overlay.remove();
      await loadPublicProfile(target.username, state.publicProfile?.collectionId || null);
    };
  }

  function openModerationPanel(target) {
    if (!target || !["moderator", "admin"].includes(state.profile?.plan)) return;
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    const history = state.publicProfile?.moderationHistory || [];
    overlay.innerHTML = `<div class="modal moderation-modal"><div class="section-head"><div><h2>Moderação de @${escapeHTML(target.username)}</h2><div class="section-subtitle">Disponível para moderadores e administradores</div></div><button class="small-btn" data-close>Fechar</button></div><div class="admin-actions moderation-actions"><button class="small-btn danger" data-moderation="ban">Banir usuário</button><button class="small-btn" data-moderation="hide">Ocultar perfil</button><button class="small-btn" data-moderation="unban">Remover banimento</button><button class="small-btn" data-moderation="unhide">Mostrar perfil</button><button class="small-btn" data-moderation="unsilence">Remover silêncio</button></div><div class="field"><label>Silenciar comentários</label><div class="admin-actions"><button class="small-btn" data-silence="24h">24 horas</button><button class="small-btn" data-silence="3d">3 dias</button><button class="small-btn" data-silence="1m">1 mês</button></div></div><form id="moderation-title-form"><div class="field"><label>Título do perfil</label><input name="title" value="${escapeHTML(target.title || "")}" maxlength="80"></div><div class="field"><label>Cor do título</label><input name="titleColor" type="color" value="${escapeHTML(safeTitleColor(target.title_color))}"></div><button class="small-btn" type="submit">Salvar título</button></form><h3>Histórico de moderação</h3><div class="moderation-history">${history.map(entry => `<div class="moderation-history-item"><b>${escapeHTML(entry.action)}</b><span>@${escapeHTML(entry.actor_username || "moderador")} · ${escapeHTML(formatCommentDate(entry.created_at))}</span></div>`).join("") || '<span class="section-subtitle">Nenhuma ação registrada.</span>'}</div></div>`;
    $("#modal-root").appendChild(overlay);
    $("[data-close]", overlay).onclick = () => overlay.remove();
    $$('[data-moderation]', overlay).forEach(button => button.onclick = async () => { await runModerationAction(target, button.dataset.moderation); overlay.remove(); });
    $$('[data-silence]', overlay).forEach(button => button.onclick = async () => { await runModerationAction(target, "silence", button.dataset.silence); overlay.remove(); });
    $("#moderation-title-form", overlay).onsubmit = async event => { event.preventDefault(); const form = new FormData(event.currentTarget); await runModerationAction(target, "title", null, String(form.get("title") || ""), String(form.get("titleColor") || "#ffd45c")); overlay.remove(); };
  }

  function openModerationPanel(target) {
    if (!target || !["moderator", "admin"].includes(state.profile?.plan)) return;
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    const history = state.publicProfile?.moderationHistory || [];
    const visibilityAction = target.profile_hidden ? "unhide" : "hide";
    const visibilityLabel = target.profile_hidden ? "Mostrar perfil" : "Ocultar perfil";
    const banAction = target.is_banned ? "unban" : "ban";
    const banLabel = target.is_banned ? "Remover banimento" : "Banir usuário";
    const silenceLabel = target.silenced_until ? `Silenciado até ${formatCommentDate(target.silenced_until)}` : "Usuário pode comentar";
    overlay.innerHTML = `<div class="modal moderation-modal"><div class="section-head moderation-header"><div><div class="eyebrow">Painel de moderação</div><h2>@${escapeHTML(target.username)}</h2><div class="section-subtitle">Ações registradas no histórico do perfil</div></div><button class="small-btn" data-close>Fechar</button></div><div class="moderation-status">${target.profile_hidden ? "Perfil oculto" : "Perfil público"} · ${target.is_banned ? "Banido" : "Conta ativa"} · ${escapeHTML(silenceLabel)}</div><div class="moderation-grid"><section class="moderation-section"><h3>Perfil e acesso</h3><div class="moderation-button-grid"><button class="small-btn" data-moderation="${visibilityAction}">${visibilityLabel}</button><button class="small-btn danger" data-moderation="${banAction}">${banLabel}</button></div></section><section class="moderation-section"><h3>Comentários</h3><div class="admin-actions"><button class="small-btn" data-silence="24h">Silenciar 24 horas</button><button class="small-btn" data-silence="3d">Silenciar 3 dias</button><button class="small-btn" data-silence="1m">Silenciar 1 mês</button><button class="small-btn" data-moderation="unsilence">Remover silêncio</button></div></section></div><section class="moderation-section"><h3>Título do perfil</h3><form id="moderation-title-form"><div class="moderation-title-fields"><div class="field"><label>Texto</label><input name="title" value="${escapeHTML(target.title || "")}" maxlength="80" placeholder="Título do usuário"></div><div class="field"><label>Cor</label><input name="titleColor" type="color" value="${escapeHTML(safeTitleColor(target.title_color))}"></div></div><button class="small-btn" type="submit">Salvar título</button></form></section><section class="moderation-section"><h3>Histórico</h3><div class="moderation-history">${history.map(entry => `<div class="moderation-history-item"><b>${escapeHTML(entry.action)}</b><span>@${escapeHTML(entry.actor_username || "moderador")} · ${escapeHTML(formatCommentDate(entry.created_at))}</span></div>`).join("") || '<span class="section-subtitle">Nenhuma ação registrada.</span>'}</div></section></div>`;
    $("#modal-root").appendChild(overlay);
    $("[data-close]", overlay).onclick = () => overlay.remove();
    $$('[data-moderation]', overlay).forEach(button => button.onclick = async () => { await runModerationAction(target, button.dataset.moderation); overlay.remove(); });
    $$('[data-silence]', overlay).forEach(button => button.onclick = async () => { await runModerationAction(target, "silence", button.dataset.silence); overlay.remove(); });
    $("#moderation-title-form", overlay).onsubmit = async event => { event.preventDefault(); const form = new FormData(event.currentTarget); await runModerationAction(target, "title", null, String(form.get("title") || ""), String(form.get("titleColor") || "#ffd45c")); overlay.remove(); };
  }

  async function deletePublicCollection(ownerId, collectionId) {
    if (state.profile?.plan !== "admin") return;
    const result = await sb.from("shelf_collections").delete().eq("owner_id", ownerId).eq("id", collectionId);
    if (result.error) return toast("Não foi possível excluir a coleção.");
    toast("Coleção pública excluída.");
    await loadPublicProfile(state.publicProfile.profile.username);
  }

  async function toggleProfileFollow(profile) {
    if (!state.session) return openAuthPage();
    if (!profile?.id || profile.id === state.session.user.id) return;
    const publicState = state.publicProfile;
    const following = Boolean(publicState?.isFollowing);
    const query = sb.from("profile_follows");
    const result = following
      ? await query.delete().eq("follower_id", state.session.user.id).eq("following_id", profile.id)
      : await query.insert({ follower_id: state.session.user.id, following_id: profile.id });
    if (result.error) return toast("Não foi possível atualizar o acompanhamento.");
    publicState.isFollowing = !following;
    publicState.followerCount = Math.max(0, (publicState.followerCount || 0) + (following ? -1 : 1));
    state.followingCount = Math.max(0, (state.followingCount || 0) + (following ? -1 : 1));
    render();
  }

  function renderPublicProfilePage() {
    const publicState = state.publicProfile;
    if (!publicState || publicState.loading) return '<div class="content"><div class="empty">Carregando perfil...</div></div>';
    if (publicState.error) return `<div class="content"><div class="empty">${escapeHTML(publicState.error)}</div></div>`;
    const profile = publicState.profile;
    const savedVisible = !["admin", "moderator", "premium"].includes(profile.plan) || profile.shelf_saved_public !== false;
    const seriesVisible = !["admin", "moderator", "premium"].includes(profile.plan) || profile.shelf_series_public !== false;
    const readVisible = !["admin", "moderator", "premium"].includes(profile.plan) || profile.shelf_read_public !== false;
    const completedVisible = !["admin", "moderator", "premium"].includes(profile.plan) || profile.shelf_completed_public !== false;
    const likedVisible = !["admin", "moderator", "premium"].includes(profile.plan) || profile.shelf_liked_public !== false;
    const savedItems = uniqueCatalogItems(state.db.library.filter(item => publicState.favoriteIds.has(item.id))).map(item => ({ ...item, seriesId: null }));
    const savedSeries = shelfItemsByIds([...publicState.favoriteIds].filter(isSeriesId), true);
    const readItems = uniqueCatalogItems(state.db.library.filter(item => publicState.readingProgress.get(item.id)?.completed)).map(item => ({ ...item, seriesId: null }));
    const likedItems = uniqueCatalogItems(state.db.library.filter(item => publicState.comicLikeIds?.has(item.id))).map(item => ({ ...item, seriesId: null }));
    const completedItems = completedSeriesItems(publicState.readingProgress);
    const publicCategories = (publicState.collections || []).filter(category => category.isPublic !== false);
    const publicBlogCollections = (publicState.blogCollections || []).filter(collection => collection.isPublic !== false);
    const selectedCategory = publicCategories.find(category => category.id === publicState.collectionId);
    const selectedBlogCollection = publicBlogCollections.find(collection => collection.id === publicState.collectionId);
    if (publicState.collectionId && selectedCategory) return renderPublicCollectionPage(publicState, selectedCategory);
    if (publicState.collectionId && selectedBlogCollection) return renderPublicBlogCollectionPage(publicState, selectedBlogCollection);
    if (publicState.collectionId && !selectedCategory && !selectedBlogCollection) return `<div class="content"><div class="empty">Esta coleção não existe ou é privada.</div><a class="small-btn" href="${escapeHTML(publicProfileHref(profile.username))}">Voltar ao perfil</a></div>`;
    const canModerate = ["moderator", "admin"].includes(state.profile?.plan) && !["moderator", "admin"].includes(profile.plan);
    const canFollow = Boolean(state.session?.user?.id && state.session.user.id !== profile.id);
    return `<div class="content public-profile-page">
      <div class="profile-header">
        ${avatarMarkup(profile)}
        <div>
          <div class="eyebrow">@${escapeHTML(profile.username)}</div>
          ${profile.title ? `<div class="profile-title" style="--title-bg:${safeTitleColor(profile.title_color)}">${escapeHTML(profile.title)}</div>` : '<div class="section-subtitle">Perfil público</div>'}
          ${trophyRoom(publicState.achievements)}
        </div>
      </div>
      <div class="section-head"><div><h1 class="section-title">Estante de @${escapeHTML(profile.username)}</h1><div class="section-subtitle">${publicState.followerCount || 0} seguidores · ${publicState.followingCount || 0} seguindo · Coleções públicas do perfil</div></div><div class="profile-actions">${canFollow ? `<button class="small-btn follow-button ${publicState.isFollowing ? "is-following" : ""}" data-follow-profile>${publicState.isFollowing ? "Seguindo" : "Seguir"}</button>` : ""}<button class="small-btn" data-section="home">Voltar ao início</button>${canModerate ? `<button class="small-btn moderation-button" data-open-moderation>Moderação</button>` : ""}</div></div>
      ${savedVisible ? shelfCollectionMarkup("Salvos", savedItems, "public-saved", publicState.readingProgress, publicState.favoriteIds) : '<div class="notice">A coleção Salvos está oculta neste perfil.</div>'}
      ${seriesVisible ? shelfCollectionMarkup("Séries salvas", savedSeries, "public-series-saved", publicState.readingProgress, publicState.favoriteIds, "", null, true) : '<div class="notice">A coleção Séries salvas está oculta neste perfil.</div>'}
      ${readVisible ? shelfCollectionMarkup("Lidos", readItems, "public-read", publicState.readingProgress, publicState.favoriteIds) : '<div class="notice">A coleção Lidos está oculta neste perfil.</div>'}
      ${completedVisible ? shelfCollectionMarkup("Concluídos", completedItems, "public-completed", publicState.readingProgress, publicState.favoriteIds, "", null, true) : '<div class="notice">A coleção Concluídos está oculta neste perfil.</div>'}
      ${likedVisible ? shelfCollectionMarkup("Curtidos", likedItems, "public-liked", publicState.readingProgress, publicState.favoriteIds) : '<div class="notice">A coleção Curtidos está oculta neste perfil.</div>'}
      ${publicCategories.map(category => { const items = publicCollectionItems(category, publicState); const liked = publicState.collectionLikes?.has(category.id); const likes = publicState.collectionLikeCounts?.get(category.id) || 0; return shelfCollectionMarkup(category.name, items, `public-category:${category.id}`, publicState.readingProgress, publicState.favoriteIds, `<span class="shelf-visibility is-public">Pública</span><button class="small-btn ${liked ? "is-liked" : ""}" data-like-collection="${escapeHTML(category.id)}" data-like-owner="${escapeHTML(profile.id)}">${liked ? "♥" : "♡"} ${likes}</button><a class="small-btn" href="${escapeHTML(publicProfileHref(profile.username, category.id))}">Abrir coleção</a><button class="small-btn" data-copy-collection="${escapeHTML(category.id)}" data-copy-username="${escapeHTML(profile.username)}">Compartilhar</button>`); }).join("")}
    </div>`;
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
        <div class="results-grid">${uniqueCatalogItems(items).map(item => card(item)).join("") || `<div class="empty">Nenhuma edição cadastrada.</div>`}</div>
      </div>`;
  }

  function renderSearch() {
    const q = state.search.trim().toLowerCase();
    const matchingEditions = uniqueCatalogItems(state.db.library.filter(x => {
      const hay = [x.title,x.seriesTitle,x.issue,x.author,x.publisher,x.imprint,x.character,x.description,...(x.tags||[])].join(" ").toLowerCase();
      return !q || hay.includes(q);
    }));
    const seenSeries = new Set();
    const results = matchingEditions.filter(item => {
      if (!item.seriesId) return true;
      if (seenSeries.has(item.seriesId)) return false;
      seenSeries.add(item.seriesId);
      return true;
    });
    const initialOrder = ["0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), "#"];
    const initialFor = item => {
      const initial = String(item.seriesTitle || item.title || "").trim().charAt(0).toUpperCase();
      return /[0-9]/.test(initial) ? "0-9" : /^[A-Z]$/.test(initial) ? initial : "#";
    };
    const grouped = new Map();
    results.forEach(item => {
      const publisher = String(item.publisher || "Sem editora").trim() || "Sem editora";
      const imprint = String(item.imprint || "Sem selo").trim() || "Sem selo";
      if (!grouped.has(publisher)) grouped.set(publisher, new Map());
      if (!grouped.get(publisher).has(imprint)) grouped.get(publisher).set(imprint, new Map());
      const initial = initialFor(item);
      if (!grouped.get(publisher).get(imprint).has(initial)) grouped.get(publisher).get(imprint).set(initial, []);
      grouped.get(publisher).get(imprint).get(initial).push(item);
    });
    const publisherMarkup = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b, "pt-BR")).map(([publisher, imprints]) => `
      <section class="section search-publisher">
        <div class="section-head"><div><h2 class="section-title">${escapeHTML(publisher)}</h2><div class="section-subtitle">Editora</div></div></div>
        ${[...imprints.entries()].sort(([a], [b]) => a.localeCompare(b, "pt-BR")).map(([imprint, initials]) => `
          <section class="search-imprint">
            <div class="section-head"><div><h3 class="section-title">${escapeHTML(imprint)}</h3><div class="section-subtitle">Selo</div></div></div>
            ${initialOrder.filter(initial => initials.has(initial)).map(initial => `
              <section class="search-initial">
                <h4 class="search-initial-title">${initial}</h4>
                <div class="results-grid">${initials.get(initial).sort((a, b) => (a.seriesTitle || a.title).localeCompare(b.seriesTitle || b.title, "pt-BR")).map(item => item.seriesId ? seriesCard(item) : card(item)).join("")}</div>
              </section>`).join("")}
          </section>`).join("")}
      </section>`).join("");
    return `
      <div class="content">
        <div class="section">
          <h1 class="section-title">Pesquisar</h1>
          <div class="search-wrap">
            <input id="search-input" class="search-input" value="${escapeHTML(state.search)}" placeholder="Título, autor, personagem, gênero, edição…">
            <button class="btn btn-danger" data-action="do-search">Pesquisar</button>
          </div>
          <div class="section-subtitle">${results.length} resultado(s)</div>
          <div style="margin-top:15px">${publisherMarkup || `<div class="empty">Nada encontrado.</div>`}</div>
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

  function renderCollectionPage() {
    const collection = state.db.collections.find(item => item.id === state.collectionId);
    if (!collection) return renderCollections();
    const items = collection.issueIds.map(id => state.db.library.find(item => item.id === id)).filter(Boolean);
    return `<div class="content"><div class="section-head"><div><div class="eyebrow">Coleção</div><h1 class="section-title">${escapeHTML(collection.title)}</h1><div class="section-subtitle">${items.length} edição(ões)</div></div><button class="small-btn" data-section="collections">Voltar às coleções</button></div><p class="section-subtitle">${escapeHTML(collection.description || "")}</p><div class="results-grid">${items.map(item => card(item)).join("") || '<div class="empty">Coleção vazia.</div>'}</div></div>`;
  }

  async function markNotificationRead(notificationId) {
    const notification = state.notifications.find(item => String(item.id) === String(notificationId));
    if (!notification || notification.read_at || !sb || !state.session) return;
    const result = await sb.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", notification.id).eq("user_id", state.session.user.id);
    if (result.error) return toast("Não foi possível marcar a notificação como lida.");
    notification.read_at = new Date().toISOString();
    state.notificationUnreadCount = Math.max(0, state.notificationUnreadCount - 1);
    render();
  }

  async function markAllNotificationsRead() {
    if (!sb || !state.session || !state.notificationUnreadCount) return;
    const result = await sb.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", state.session.user.id).is("read_at", null);
    if (result.error) return toast("Não foi possível marcar as notificações.");
    state.notifications.forEach(notification => { notification.read_at ||= new Date().toISOString(); });
    state.notificationUnreadCount = 0;
    render();
  }

  function notificationIcon(type) {
    return ({ achievement: "🏆", moderation: "⚖", plan: "★", message: "✉", chat_mention: "@", follow: "♥", collection_like: "♥", comment_reply: "↩", comment_like: "♥", mention: "@", announcement: "!" }[type] || "•");
  }

  function renderNotifications() {
    if (!state.session) return renderLoginPage();
    return `<div class="content notifications-page"><div class="section-head"><div><div class="eyebrow">Central da conta</div><h1 class="section-title">Notificações</h1><div class="section-subtitle">${state.notificationUnreadCount} não lida(s)</div></div><button class="small-btn" data-mark-all-notifications>Marcar todas como lidas</button></div><div class="notification-list">${state.notifications.map(notification => { const actor = notification.actor; const actorName = actor?.username ? `@${escapeHTML(actor.username)}` : "A Banca Digital"; const actorMarkup = actor?.username ? `<a class="notification-actor" href="${escapeHTML(publicProfileHref(actor.username))}" data-notification-profile="${escapeHTML(actor.username)}">${avatarMarkup(actor, "notification-actor-avatar")}<span><b>${actorName}</b>${actor.title ? `<small style="--title-bg:${safeTitleColor(actor.title_color)}">${escapeHTML(actor.title)}</small>` : ""}</span></a>` : `<span class="notification-system-actor"><span class="notification-icon">${notificationIcon(notification.type)}</span><b>${actorName}</b></span>`; return `<div class="notification-item ${notification.read_at ? "" : "is-unread"}" role="button" tabindex="0" data-notification-open="${escapeHTML(notification.id)}"><span class="notification-icon">${notificationIcon(notification.type)}</span><span class="notification-copy">${actorMarkup}<strong>${escapeHTML(notification.title)}</strong><span>${escapeHTML(notification.body)}</span><small>${escapeHTML(formatCommentDate(notification.created_at))}</small></span></div>`; }).join("") || '<div class="empty">Você ainda não recebeu notificações.</div>'}</div></div>`;
  }

  function closeNotificationsPopups() {
    $$('.notifications-popup-modal').forEach(modal => modal.closest('.modal-backdrop')?.remove());
  }

  function openNotificationsPopup() {
    if (!state.session) return openAuthPage();
    closeNotificationsPopups();
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal notifications-popup-modal"><div class="section-head"><div><h2>Notificações</h2><div class="section-subtitle">${state.notificationUnreadCount} não lida(s)</div></div><button class="small-btn" data-close>Fechar</button></div>${renderNotifications()}</div>`;
    $("#modal-root").appendChild(overlay);
    $$('[data-close]', overlay).forEach(button => button.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      overlay.remove();
    });
    $$('[data-notification-open]', overlay).forEach(button => button.onclick = async event => {
      if (event.target.closest("[data-notification-profile]")) return;
      const notification = state.notifications.find(item => String(item.id) === String(button.dataset.notificationOpen));
      await markNotificationRead(notification?.id);
      overlay.remove();
      if (notification?.type === "message" && notification.actor?.id) {
        await openChat(notification.actor);
      } else if (notification?.type === "chat_mention" && notification.metadata?.room_id) {
        const room = CHAT_ROOMS.find(entry => entry.id === notification.metadata.room_id);
        if (room) await openChatRoom(room);
        else openNotificationsPopup();
      } else if (notification?.type === "collection_like" && notification.metadata?.collection_id) {
        openCollection(String(notification.metadata.collection_id));
      } else if ((notification?.type === "comment_reply" || notification?.type === "comment_like" || notification?.type === "mention") && notification.metadata?.blog_id) {
        navigate({ pagina: "blogs", blog: String(notification.metadata.blog_id) });
      } else if (notification?.type === "mention" && notification.metadata?.item_id) {
        const item = state.db.library.find(entry => String(entry.id) === String(notification.metadata.item_id));
        if (item) openCommentsPopup(item);
        else openNotificationsPopup();
      } else if (notification?.type === "follow" && notification.actor?.username) {
        await loadPublicProfile(notification.actor.username);
      } else {
        openNotificationsPopup();
      }
    });
    $$('[data-notification-profile]', overlay).forEach(link => link.onclick = async event => {
      event.preventDefault();
      event.stopPropagation();
      const notification = state.notifications.find(item => String(item.id) === String(link.closest("[data-notification-open]")?.dataset.notificationOpen));
      await markNotificationRead(notification?.id);
      overlay.remove();
      await loadPublicProfile(link.dataset.notificationProfile);
    });
    $('[data-mark-all-notifications]', overlay)?.addEventListener("click", async () => {
      await markAllNotificationsRead();
      overlay.remove();
      openNotificationsPopup();
    });
  }

  function render() {
    const main = $("#main");
    let markup = "";
    if (state.section === "home") markup = renderHome();
    else if (state.section === "comic") markup = renderCatalog("comic");
    else if (state.section === "blog") markup = renderBlogsPage();
    else if (state.section === "manga") markup = renderCatalog("manga");
    else if (state.section === "collections") markup = renderCollections();
    else if (state.section === "collection") markup = renderCollectionPage();
    else if (state.section === "search") markup = renderSearch();
    else if (state.section === "entity") markup = renderEntityPage();
    else if (state.section === "login") markup = renderLoginPage();
    else if (state.section === "signup") markup = renderSignupPage();
    else if (state.section === "shelf") markup = renderShelfPage();
    else if (state.section === "local-box") markup = renderLocalBoxPage();
    else if (state.section === "public-profile") markup = renderPublicProfilePage();
    else if (state.section === "password-reset") markup = renderPasswordResetPage();
    if (main.innerHTML === markup) {
      syncActiveNav();
      return;
    }
    main.innerHTML = markup;
    bind();
    hydrateHomeCovers();
  }

  function syncActiveNav() {
    const navSection = { comic: "comics", collection: "collections" }[state.section] || state.section;
    $$(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.section === navSection));
  }

  function setSection(section) {
    if (!handlingRoute && sectionRoutes[section] !== undefined) {
      setSectionRoute(section);
      return;
    }
    state.section = section;
    syncActiveNav();
    render();
    if (section === "blog" && !state.blogPosts.length && !state.blogLoading) loadBlogPosts();
  }

  function openPublisherSettings(name) {
    if (!sb || !["moderator", "admin"].includes(state.profile?.plan)) return;
    const key = publisherKey(name);
    const setting = state.publisherSettings.get(key) || {};
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal publisher-settings-modal"><div class="section-head"><div><h2>Configurar editora</h2><div class="section-subtitle">${escapeHTML(name)}</div></div><button class="small-btn" data-close>Fechar</button></div><form id="publisher-settings-form"><div class="field"><label>Enviar imagem do card</label><input name="coverFile" type="file" accept="image/png,image/jpeg,image/webp"><small class="format-hint">A imagem será armazenada no Supabase e usada no card.</small></div><div class="field"><label>Ou use uma URL de imagem</label><input name="coverUrl" type="url" value="${escapeHTML(setting.cover_url || "")}" placeholder="https://.../imagem.jpg"></div><label class="checkbox-inline"><input name="isPinned" type="checkbox" ${setting.is_pinned ? "checked" : ""}> Fixar no carrossel de destaque</label><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Salvar configuração</button></div></form></div>`;
    $("#modal-root").appendChild(overlay);
    $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#publisher-settings-form", overlay).onsubmit = async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      let coverUrl = String(form.get("coverUrl") || "").trim() || null;
      const coverFile = form.get("coverFile");
      if (coverFile?.size) {
        const extension = String(coverFile.name || "jpg").split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const path = `${state.session.user.id}/${key}-${Date.now()}.${extension}`;
        const upload = await sb.storage.from("publisher-covers").upload(path, coverFile, { upsert: true, contentType: coverFile.type || "image/jpeg" });
        if (upload.error) return toast("Não foi possível enviar a imagem. Verifique o bucket publisher-covers no Supabase.");
        coverUrl = sb.storage.from("publisher-covers").getPublicUrl(path).data.publicUrl;
      }
      const next = { publisher_key: key, publisher_name: name, cover_url: coverUrl, is_pinned: form.get("isPinned") === "on" };
      const result = await sb.from("publisher_settings").upsert(next, { onConflict: "publisher_key" });
      if (result.error) return toast("Não foi possível salvar a configuração da editora. Execute a atualização do schema no Supabase.");
      state.publisherSettings.set(key, next);
      overlay.remove();
      render();
      toast("Configuração da editora salva.");
    };
  }

  function bind() {
    syncActiveNav();
    $(".content")?.classList.toggle("shelf-page", state.section === "shelf");
    if (state.section === "shelf" && state.session) {
      const shelfHeading = $(".content > .section-head .section-title");
      if (shelfHeading) {
        shelfHeading.textContent = `Estante de @${state.profile?.username || state.session.user.user_metadata?.username || "usuário"}`;
        if (!$(".profile-follow-summary", shelfHeading.parentElement)) shelfHeading.insertAdjacentHTML("afterend", followSummary(state.session.user.id, state.followerCount, state.followingCount));
      }
    }
    if (state.section === "shelf" && state.session) {
      const shelfHead = $(".content > .section-head");
      if (shelfHead && !$(".shelf-media-tabs")) {
        shelfHead.insertAdjacentHTML("afterend", `<div class="shelf-media-tabs"><button class="small-btn ${state.shelfTab === "comics" ? "is-active" : ""}" data-shelf-media="comics">Quadrinhos</button><button class="small-btn ${state.shelfTab === "blogs" ? "is-active" : ""}" data-shelf-media="blogs">Blogs</button></div><div class="shelf-blog-panel-mount"></div>`);
        $(".shelf-blog-panel-mount").innerHTML = blogShelfPanelMarkup();
      }
      $(".content").classList.toggle("shelf-show-blogs", state.shelfTab === "blogs");
    }
    if (state.section === "public-profile" && state.publicProfile?.profile && !state.publicProfile.collectionId) {
      const publicSummary = $(".public-profile-page > .section-head .section-subtitle");
      if (publicSummary) publicSummary.innerHTML = followSummary(state.publicProfile.profile.id, state.publicProfile.followerCount, state.publicProfile.followingCount);
      const publicHead = $(".public-profile-page > .section-head");
      if (publicHead && !$(".public-shelf-media-tabs")) {
        publicHead.insertAdjacentHTML("afterend", `<div class="shelf-media-tabs public-shelf-media-tabs"><button class="small-btn ${state.publicShelfTab === "comics" ? "is-active" : ""}" data-public-shelf-media="comics">Quadrinhos</button><button class="small-btn ${state.publicShelfTab === "blogs" ? "is-active" : ""}" data-public-shelf-media="blogs">Blogs</button></div><div class="public-shelf-blog-panel-mount"></div>`);
        $(".public-shelf-blog-panel-mount").innerHTML = blogShelfPanelMarkup(state.publicProfile);
      }
      $(".public-profile-page").classList.toggle("shelf-show-blogs", state.publicShelfTab === "blogs");
    }
    if (state.section === "entity" && state.entityFilter?.kind === "publisher" && !$("[data-publisher-filter-form]")) {
      const filter = state.collectionFilter || { field: "all", query: "" };
      const form = document.createElement("form");
      form.className = "collection-filter publisher-filter";
      form.dataset.collectionFilterForm = "true";
      form.dataset.publisherFilterForm = "true";
      form.innerHTML = `<select name="field"><option value="all" ${filter.field === "all" ? "selected" : ""}>Filtrar por qualquer campo</option><option value="author" ${filter.field === "author" ? "selected" : ""}>Autor</option><option value="publisher" ${filter.field === "publisher" ? "selected" : ""}>Editora</option><option value="character" ${filter.field === "character" ? "selected" : ""}>Personagem</option><option value="tag" ${filter.field === "tag" ? "selected" : ""}>Gênero / tag</option><option value="seriesTitle" ${filter.field === "seriesTitle" ? "selected" : ""}>Série</option><option value="title" ${filter.field === "title" ? "selected" : ""}>Título</option></select><input name="query" value="${escapeHTML(filter.query)}" placeholder="Digite para filtrar a editora"><button class="small-btn">Filtrar</button>`;
      $(".publisher-page .section-head")?.after(form);
    }
    const canManage = state.profile?.plan === "admin";
    const isAdmin = state.profile?.plan === "admin";
    syncTopAvatar();
    $$('[data-action="open-admin"]').forEach(button => { button.style.display = canManage ? "" : "none"; });
    $$('[data-action="submit"]').forEach(button => { button.style.display = isAdmin ? "" : "none"; });
    $$('.messages-nav').forEach(button => { button.style.display = state.session ? "" : "none"; });
    $$('.notification-bell').forEach(button => {
      button.style.display = state.session ? "" : "none";
      const badge = $(".notification-badge", button);
      if (badge) {
        badge.textContent = state.notificationUnreadCount > 99 ? "99+" : String(state.notificationUnreadCount);
        badge.hidden = !state.notificationUnreadCount;
      }
    });
    $$('.local-box-nav').forEach(button => { button.style.display = state.session && state.localBoxVisible ? "" : "none"; });
    $$('[data-favorite]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); toggleFavorite(el.dataset.favorite); }));
    $$('[data-series-favorite]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); toggleSeriesFavorite(el.dataset.seriesFavorite); }));
    $$('[data-cover-choice]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); openCoverChoice(el.dataset.coverChoice); }));
    $$('[data-read-item]').forEach(el => el.addEventListener("click", event => {
      event.stopPropagation();
      const item = state.db.library.find(x => x.id === el.dataset.readItem);
      if (item) openReader(item);
    }));
    $$('[data-like-item]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); toggleComicLike(el.dataset.likeItem); }));
    $$('[data-share-item]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); shareComic(el.dataset.shareItem); }));
    $$('[data-publisher]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); openEntityPage("publisher", el.dataset.publisher); }));
    $$('[data-entity-kind]').forEach(el => el.addEventListener("click", event => {
      event.stopPropagation();
      openEntityPage(el.dataset.entityKind, el.dataset.entityValue);
    }));
    $$('[data-follow-list]').forEach(el => el.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); openFollowList(el.dataset.followList, el.dataset.followProfileId); }));
    $$('[data-notification-open]').forEach(el => el.addEventListener("click", () => markNotificationRead(el.dataset.notificationOpen)));
    $('[data-mark-all-notifications]')?.addEventListener("click", markAllNotificationsRead);
    if (state.section === "public-profile" && state.publicProfile?.profile && state.session?.user?.id !== state.publicProfile.profile.id && !$("[data-open-chat]")) {
      const actions = $(".public-profile-page > .section-head .profile-actions");
      if (actions) { const button = document.createElement("button"); button.className = "small-btn"; button.dataset.openChat = "true"; button.textContent = "Enviar mensagem"; actions.prepend(button); }
    }
    $('[data-open-chat]')?.addEventListener("click", () => openChat(state.publicProfile?.profile));
    $$('[data-blog-tab]').forEach(el => el.addEventListener("click", () => { state.blogTab = el.dataset.blogTab; navigate({ pagina: "blogs" }); }));
    if (state.section === "blog" && !state.blogOpenId && $(".blogs-page") && !$(".blog-highlights-sidebar")) $(".blogs-page").insertAdjacentHTML("beforeend", blogHighlightsSidebar());
    if (state.section === "blog" && !state.blogOpenId && state.featuredBlogCollections?.length && $(".blogs-page") && !$("[data-featured-blog-collections]")) {
      const section = `<section class="section featured-blog-collections" data-featured-blog-collections><div class="section-head"><div><h2 class="section-title">Coleções de blogs em destaque</h2><div class="section-subtitle">Coleções públicas escolhidas pela equipe.</div></div></div><div class="public-collections-grid">${state.featuredBlogCollections.map(collection => publicCollectionCard(collection)).join("")}</div></section>`;
      const sections = $$('.blogs-page > .section').filter(Boolean);
      const featured = sections.find(item => $("h2", item)?.textContent.includes("Em destaque"));
      (featured || sections[0])?.insertAdjacentHTML(featured ? "afterend" : "beforebegin", section);
    }
    $$('[data-blog-open]').forEach(el => el.addEventListener("click", () => navigate({ pagina: "blogs", blog: el.dataset.blogOpen })));
    $$('[data-blog-read]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); navigate({ pagina: "blogs", blog: el.dataset.blogRead }); }));
    $('[data-blog-back]')?.addEventListener("click", () => { state.blogOpenId = null; state.blogTab = "recentes"; navigate({ pagina: "blogs" }); });
    const openedBlog = state.blogOpenId ? state.blogPosts.find(item => String(item.id) === String(state.blogOpenId)) : null;
    $$(".blog-card").forEach(card => {
      const post = state.blogPosts.find(item => String(item.id) === String(card.dataset.blogOpen));
      const meta = $(".blog-card-meta", card);
      if (post?.author?.username && meta) meta.innerHTML = `<a class="blog-meta-author" href="${escapeHTML(publicProfileHref(post.author.username))}">@${escapeHTML(post.author.username)}</a> · ${escapeHTML(blogDate(post.published_at || post.created_at))}`;
    });
    const postMeta = $(".blog-post-page .section-head .section-subtitle");
    if (openedBlog?.author?.username && postMeta) postMeta.innerHTML = `<a class="blog-meta-author" href="${escapeHTML(publicProfileHref(openedBlog.author.username))}">@${escapeHTML(openedBlog.author.username)}</a> · ${escapeHTML(blogDate(openedBlog.published_at || openedBlog.created_at))}`;
    $$(".blog-meta-author").forEach(link => link.addEventListener("click", event => event.stopPropagation()));
    const authorCard = $(".blog-author-card");
    if (openedBlog && authorCard && !$("[data-blog-inline-comments]")) {
      authorCard.insertAdjacentHTML("afterend", blogCommentsSection(openedBlog));
      const commentsSection = $("[data-blog-inline-comments]");
      loadBlogCommentsSection(openedBlog, commentsSection);
    }
    $$('[data-blog-feature]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); toggleBlogFeatured(el.dataset.blogFeature, el.dataset.blogFeatured === "true"); }));
    $$('[data-blog-delete]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); deleteBlogPost(el.dataset.blogDelete); }));
    $$('[data-blog-like]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); toggleBlogLike(el.dataset.blogLike); }));
    $$('[data-blog-save]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); toggleBlogSave(el.dataset.blogSave); }));
    $$('[data-blog-comments]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); const post = findBlogPost(el.dataset.blogComments); if (post) openBlogComments(post); }));
    $$('[data-blog-share]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); const post = findBlogPost(el.dataset.blogShare); if (post) shareBlog(post.id, post.title); }));
    if ($("#blog-form") && $(".blog-toolbar") && !$("#blog-inline-image")) {
      $(".blog-toolbar").insertAdjacentHTML("beforeend", '<button type="button" data-blog-command="strikeThrough">Riscado</button><button type="button" data-blog-command="insertOrderedList">1. Lista</button><button type="button" data-blog-command="justifyLeft">Esquerda</button><button type="button" data-blog-command="justifyCenter">Centro</button><button type="button" data-blog-command="justifyRight">Direita</button><button type="button" data-blog-command="undo">Desfazer</button><button type="button" data-blog-command="redo">Refazer</button><button type="button" data-blog-command="removeFormat">Limpar</button><button type="button" data-blog-break-box>Quebrar caixa</button><button type="button" data-blog-image>Imagem no texto</button>');
      $(".blog-toolbar").insertAdjacentHTML("afterend", '<input id="blog-inline-image" type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden>');
    }
    $$('[data-blog-command]').forEach(el => el.addEventListener("click", () => {
      const command = el.dataset.blogCommand;
      const value = el.dataset.blogValue;
      if (command === "createLink") {
        openBlogLinkDialog();
      } else document.execCommand(command, false, value || null);
      $("#blog-editor")?.focus();
    }));
    $('[data-blog-break-box]')?.addEventListener("click", () => {
      const editor = $("#blog-editor");
      if (!editor) return;
      editor.focus();
      document.execCommand("insertHTML", false, "<p><br></p>");
    });
    $('[data-blog-image]')?.addEventListener("click", () => {
      const selection = window.getSelection();
      state.blogEditorRange = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
      $("#blog-inline-image")?.click();
    });
    $("#blog-inline-image")?.addEventListener("change", async event => {
      const file = event.currentTarget.files?.[0];
      if (!file) return;
      try {
        const url = await uploadBlogImage(file, "inline");
        const editor = $("#blog-editor");
        if (!editor) return;
        editor.focus();
        const selection = window.getSelection();
        selection?.removeAllRanges();
        if (state.blogEditorRange) selection?.addRange(state.blogEditorRange);
        else {
          const range = document.createRange();
          range.selectNodeContents(editor);
          range.collapse(false);
          selection?.addRange(range);
        }
        document.execCommand("insertHTML", false, `<p><br></p><img src="${escapeHTML(url)}" alt="Imagem inserida no artigo"><p><br></p>`);
      } catch (error) {
        toast(error.message || "Não foi possível inserir a imagem.");
      } finally {
        event.currentTarget.value = "";
        state.blogEditorRange = null;
      }
    });
    if ($("#blog-form") && $(".blog-image-fields")) $(".blog-image-fields").insertAdjacentHTML("beforebegin", '<p class="format-hint blog-image-hint">Formato recomendado: capa vertical 720×1440; imagens laterais quadradas 900×900. Elas serão exibidas com a capa maior e as duas laterais empilhadas.</p>');
    const blogForm = $("#blog-form");
    if (blogForm) $("input[name=cover]", blogForm)?.setAttribute("required", "");
    $("#blog-form")?.addEventListener("submit", event => { event.preventDefault(); publishBlogPost(event.currentTarget); });
    $$('[data-public-collection]').forEach(el => el.addEventListener("click", event => { if (event.target.closest("a, button")) return; event.stopPropagation(); loadPublicProfile(el.dataset.publicOwner, el.dataset.publicCollection); }));
    $$('[data-publisher-settings]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); openPublisherSettings(el.dataset.publisherSettings); }));
    $$('[data-publisher-series-toggle]').forEach(el => el.addEventListener("click", event => {
      event.stopPropagation();
      const key = el.dataset.publisherSeriesToggle;
      state.publisherSeriesExpanded[key] = !state.publisherSeriesExpanded[key];
      render();
    }));
    $$('[data-comment-item]').forEach(el => el.addEventListener("click", event => {
      event.stopPropagation();
      const item = state.db.library.find(entry => entry.id === el.dataset.commentItem);
      if (item) openCommentsPopup(item);
    }));
    $$('[data-shelf-expand]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); state.shelfExpanded[el.dataset.shelfExpand] = !state.shelfExpanded[el.dataset.shelfExpand]; render(); }));
    $$('[data-shelf-media]').forEach(el => el.addEventListener("click", () => { state.shelfTab = el.dataset.shelfMedia; render(); }));
    $$('[data-public-shelf-media]').forEach(el => el.addEventListener("click", () => { state.publicShelfTab = el.dataset.publicShelfMedia; render(); }));
    $('[data-blog-shelf-new]')?.addEventListener("click", openBlogShelfCollectionForm);
    $$('[data-blog-shelf-edit]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); openBlogShelfCollectionForm(el.dataset.blogShelfEdit); }));
    $$('[data-blog-shelf-delete]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); deleteBlogShelfCollection(el.dataset.blogShelfDelete); }));
    if (["moderator", "admin"].includes(state.profile?.plan)) {
      $$('[data-shelf-edit-category]').forEach(edit => {
        const category = state.shelfCategories.find(item => item.id === edit.dataset.shelfEditCategory);
        const alreadyFeaturedButton = [...edit.parentElement.querySelectorAll("[data-collection-feature]")].some(button => button.dataset.collectionFeature === category?.id);
        if (category && category.isPublic !== false && !alreadyFeaturedButton) edit.insertAdjacentHTML("beforebegin", `<button class="small-btn" data-collection-feature="${escapeHTML(category.id)}" data-collection-featured="${category.is_featured ? "true" : "false"}">${category.is_featured ? "Remover destaque" : "Destacar"}</button>`);
      });
    }
    $$('[data-collection-feature]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); toggleShelfCollectionFeatured(el.dataset.collectionFeature, el.dataset.collectionFeatured === "true"); }));
    $('[data-shelf-new-category]')?.addEventListener("click", () => openShelfCategoryForm());
    $$('[data-shelf-edit-category]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); openShelfCategoryForm(el.dataset.shelfEditCategory); }));
    $$('[data-shelf-delete-category]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); deleteShelfCategory(el.dataset.shelfDeleteCategory); }));
    if (state.section === "shelf") $$('[data-copy-collection]', $(".blog-shelf-panel-mount") || document).forEach(el => { delete el.dataset.copyUsername; });
    $$('[data-copy-collection]').forEach(el => {
      if (!el.dataset.copyUsername && state.profile?.username && !el.previousElementSibling?.matches("[data-shelf-open]")) {
        const openLink = document.createElement("a");
        openLink.className = "small-btn";
        openLink.dataset.shelfOpen = "true";
        openLink.href = publicProfileHref(state.profile.username, el.dataset.copyCollection);
        openLink.textContent = "Abrir";
        el.before(openLink);
      }
      el.addEventListener("click", event => { event.stopPropagation(); copyCollectionLink(el.dataset.copyCollection, el.dataset.copyUsername || state.profile?.username); });
    });
    if (state.section === "public-profile" && state.publicProfile?.collectionId && state.profile?.plan === "admin") {
      const actions = $(".public-collection-page .shelf-section-actions");
      const category = state.publicProfile.collections?.find(item => item.id === state.publicProfile.collectionId);
      if (actions && category && !$("[data-admin-delete-public-collection]", actions)) {
        const button = document.createElement("button");
        button.className = "small-btn danger";
        button.textContent = "Excluir coleção";
        button.dataset.adminDeletePublicCollection = category.id;
        button.dataset.collectionOwner = state.publicProfile.profile.id;
        button.onclick = () => deletePublicCollection(button.dataset.collectionOwner, button.dataset.adminDeletePublicCollection);
        actions.appendChild(button);
      }
    }
    $$('[data-like-collection]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); toggleCollectionLike(el.dataset.likeOwner, el.dataset.likeCollection); }));
    $('[data-open-moderation]')?.addEventListener("click", () => {
      const target = state.publicProfile?.profile;
      openModerationPanel(target);
      setTimeout(() => attachPlanControl($(".moderation-modal")?.closest(".modal-backdrop"), target), 0);
    });
    $('[data-follow-profile]')?.addEventListener("click", () => toggleProfileFollow(state.publicProfile?.profile));
    $("[data-collection-filter-form]")?.addEventListener("submit", event => { event.preventDefault(); const form = new FormData(event.currentTarget); state.collectionFilter = { field: String(form.get("field") || "all"), query: String(form.get("query") || "") }; render(); });
    $$("[data-open]").forEach(el => el.addEventListener("click", () => {
      const item = state.db.library.find(x => x.id === el.dataset.open);
      if (el.dataset.openDirect === "true") openReader(item);
      else openItem(item);
    }));
    $$("[data-section]").forEach(el => el.addEventListener("click", () => {
      const s = el.dataset.section;
      setSection(s === "comics" ? "comic" : s);
    }));
    $$("[data-action]").forEach(el => el.addEventListener("click", () => {
      const a = el.dataset.action;
      if (a === "home") setSection("home");
      if (a === "random") openReader(weightedRandom(state.db.library));
      if (a === "focus-search") { setSection("search"); setTimeout(() => $("#search-input")?.focus(), 30); }
      if (a === "do-search") { state.search = $("#search-input")?.value || ""; navigate({ pagina: "pesquisar", q: state.search }); }
      if (a === "open-admin") { if (canManage) openAdmin(); }
      if (a === "open-auth") state.session ? setSection("shelf") : openAuthPage();
      if (a === "messages") openChat();
      if (a === "notifications-popup") openNotificationsPopup();
      if (a === "logout") signOut();
      if (a === "profile") openProfileSettings();
      if (a === "submit") { if (isAdmin) openSubmission(); else toast("O envio de quadrinhos é exclusivo para administradores."); }
      if (a === "open-local-box") { state.localBoxVisible = true; setSection("local-box"); }
    }));
    $$("[data-collection]").forEach(el => el.addEventListener("click", () => openCollection(el.dataset.collection)));
    const openSeriesById = seriesId => {
      const first = state.db.library.find(item => item.seriesId === seriesId);
      if (first) openSeriesSelection(first, seriesEditions(first));
    };
    $$('[data-view-series]').forEach(el => el.addEventListener("click", event => {
      event.stopPropagation();
      openSeriesById(el.dataset.viewSeries);
    }));
    $$('.series-card[data-open-series]').forEach(el => el.addEventListener("click", event => {
      if (event.target.closest("button")) return;
      openSeriesById(el.dataset.openSeries);
    }));
    if ($('[data-action="clear-local-box"]')) $('[data-action="clear-local-box"]').onclick = () => { clearLocalBox(); render(); toast("Minha caixa foi limpa."); };
    $("#local-folder-input")?.addEventListener("change", event => {
      const files = [...event.target.files].filter(supportedLocalFile);
      if (!files.length) return toast("Nenhum quadrinho compatível foi encontrado na pasta.");
      files.forEach(file => openLocalFile(file, true));
    });
    $("#local-file-input")?.addEventListener("change", event => openLocalFile(event.target.files[0]));
    $$('[data-local-open]').forEach(el => el.addEventListener("click", () => {
      const file = state.localBoxFiles.find(item => item.id === el.dataset.localOpen);
      if (file) openReader(file);
    }));
    $("#search-input")?.addEventListener("keydown", e => {
      if (e.key === "Enter") { state.search = e.target.value; render(); $("#search-input")?.focus(); }
    });
    $("#auth-form")?.addEventListener("submit", async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const identifier = String(form.get("username") || "").trim();
      const username = cleanUsername(identifier);
      const password = String(form.get("password") || "");
      const message = $("#auth-message");
      if (!sb) { message.textContent = "A autenticação ainda não foi configurada."; return; }
      if (!identifier.includes("@") && !/^[a-z0-9_]{3,24}$/.test(username)) { message.textContent = "Use de 3 a 24 caracteres: letras, números ou _."; return; }
      const mode = event.submitter?.dataset.authMode || event.currentTarget.dataset.authMode || "login";
      const providedEmail = String(form.get("email") || "").trim().toLowerCase();
      if (mode === "signup" && providedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(providedEmail)) { message.textContent = "Informe um email válido ou deixe o campo em branco."; return; }
      const signupUsername = identifier.includes("@")
        ? cleanUsername(identifier.split("@")[0]).replace(/[^a-z0-9_]/g, "_").slice(0, 24)
        : username;
      if (mode === "signup" && !/^[a-z0-9_]{3,24}$/.test(signupUsername)) { message.textContent = "Não foi possível definir um usuário a partir deste email. Use um usuário de 3 a 24 caracteres."; return; }
      if (mode === "signup") {
        const existing = await sb.from("profiles").select("id").eq("username", signupUsername).maybeSingle();
        if (existing.data) { message.textContent = "Esse usuário já está em uso. Escolha outro."; return; }
      }
      let email = mode === "signup" ? (providedEmail || authEmail(username)) : (identifier.includes("@") ? identifier.toLowerCase() : authEmail(username));
      if (mode === "login" && !identifier.includes("@")) {
        const lookup = await sb.rpc("get_login_email", { p_username: username });
        if (lookup.data) email = lookup.data;
      }
      const result = mode === "signup"
        ? await sb.auth.signUp({ email, password, options: { data: { username: signupUsername } } })
        : await sb.auth.signInWithPassword({ email, password });
      if (result.error) {
        if (mode === "signup" && !providedEmail && /email rate limit exceeded/i.test(result.error.message)) {
          message.textContent = "O cadastro sem email exige a confirmação de email desativada no Supabase. Desative-a em Authentication > Providers > Email ou informe um email válido.";
        } else {
          message.textContent = /database error saving new user/i.test(result.error.message)
            ? "Não foi possível criar a conta. Verifique se esse usuário já está em uso."
            : result.error.message;
        }
        return;
      }
      if (mode === "signup" && !result.data.session) { message.textContent = "Conta criada. Desative a confirmação de email no Supabase para entrar sem email."; return; }
      await loadAccount();
      setSection("shelf");
    });
    $$('[data-auth-mode]').forEach(button => button.addEventListener("click", () => {
      $("#auth-form").dataset.authMode = button.dataset.authMode;
    }));
    $$("[data-auth-switch]").forEach(button => button.addEventListener("click", () => {
      if (button.dataset.authSwitch === "signup") openSignupPage();
      else openAuthPage();
    }));
    $("[data-forgot-password]")?.addEventListener("click", openPasswordRecoveryModal);
    $("#password-reset-form")?.addEventListener("submit", async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const password = String(form.get("password") || "");
      const confirmation = String(form.get("confirmation") || "");
      const message = $("#auth-message");
      if (password !== confirmation) { message.textContent = "As senhas não coincidem."; return; }
      const result = await sb.auth.updateUser({ password });
      if (result.error) { message.textContent = result.error.message; return; }
      await sb.auth.signOut({ scope: "global" });
      state.session = null; state.profile = null; state.favoriteIds = new Set();
      toast("Senha alterada. Entre novamente com a nova senha.");
      setSection("login");
    });
  }

  function openSeriesSelection(series, editions) {
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    const volumeGroups = new Map();
    editions.slice().sort((a, b) => issueSortValue(a) - issueSortValue(b)).forEach(item => {
      const label = item.volumeTitle || item.volume || "Edições";
      if (!volumeGroups.has(label)) volumeGroups.set(label, []);
      volumeGroups.get(label).push(item);
    });
    const volumeEntries = [...volumeGroups.entries()];
    const volumeTabs = volumeEntries.length > 1
      ? `<div class="series-volume-tabs">${volumeEntries.map(([label], index) => `<button class="small-btn ${index === 0 ? "is-active" : ""}" type="button" data-series-volume-tab="${index}">${escapeHTML(label)}</button>`).join("")}</div>`
      : "";
    const volumePanels = volumeEntries.map(([label, items], index) => `<div class="series-volume-panel" data-series-volume-panel="${index}" ${index ? "hidden" : ""}><div class="section-subtitle series-volume-heading">${escapeHTML(label)}</div><div class="results-grid">${items.map(item => card(item)).join("")}</div></div>`).join("");
    overlay.innerHTML = `
      <div class="modal series-modal">
        <div class="section-head">
          <div><div class="eyebrow">Série</div><h2>${escapeHTML(series.seriesTitle || series.title)}</h2><div class="section-subtitle">${editions.length} edições disponíveis · clique em uma edição para ler</div></div>
          <button class="small-btn" data-close>Fechar</button>
        </div>
        ${volumeTabs}${volumePanels}
      </div>`;
    $("#modal-root").appendChild(overlay);
    hydrateHomeCovers();
    $("[data-close]", overlay).onclick = () => overlay.remove();
    $$('[data-open]', overlay).forEach(el => el.addEventListener("click", () => {
      overlay.remove();
      openReader(state.db.library.find(x => x.id === el.dataset.open));
    }));
    $$('[data-cover-choice]', overlay).forEach(el => el.addEventListener("click", event => {
      event.stopPropagation();
      openCoverChoice(el.dataset.coverChoice);
    }));
    $$('[data-favorite]', overlay).forEach(el => el.addEventListener("click", event => {
      event.stopPropagation();
      toggleFavorite(el.dataset.favorite);
    }));
    $$('[data-like-item]', overlay).forEach(el => el.addEventListener("click", event => {
      event.stopPropagation();
      toggleComicLike(el.dataset.likeItem);
    }));
    $$('[data-share-item]', overlay).forEach(el => el.addEventListener("click", event => {
      event.stopPropagation();
      shareComic(el.dataset.shareItem);
    }));
    $$('[data-comment-item]', overlay).forEach(el => el.addEventListener("click", event => {
      event.stopPropagation();
      const item = state.db.library.find(entry => entry.id === el.dataset.commentItem);
      if (item) openCommentsPopup(item);
    }));
    $$('[data-series-volume-tab]', overlay).forEach(tab => tab.addEventListener("click", () => {
      const selected = tab.dataset.seriesVolumeTab;
      $$('[data-series-volume-tab]', overlay).forEach(button => button.classList.toggle("is-active", button === tab));
      $$('[data-series-volume-panel]', overlay).forEach(panel => { panel.hidden = panel.dataset.seriesVolumePanel !== selected; });
    }));
  }

  function openCollection(id) {
    if (state.db.collections.some(collection => collection.id === id)) navigate({ pagina: "colecoes", colecao: id });
  }

  function detectFormat(url = "") {
    const clean = String(url).split("?")[0].split("#")[0].toLowerCase();
    return clean.match(/\.(pdf|cbz|cbr|jpg|jpeg|png|webp|gif)$/)?.[1] || "auto";
  }

  function openCoverVariantsAdmin() {
    if (!sb || !["moderator", "admin"].includes(state.profile?.plan)) return;
    const items = state.db.library.filter(item => item.type === "comic").sort((a, b) => itemDisplayTitle(a).localeCompare(itemDisplayTitle(b), "pt-BR"));
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal cover-variants-admin-modal"><div class="section-head"><div><h2>Capas variantes oficiais</h2><div class="section-subtitle">Cadastre capas hospedadas oficialmente pela DC para usuários Premium.</div></div><button class="small-btn" data-close>Fechar</button></div><form id="cover-variant-admin-form"><div class="field full"><label>Edição</label><select name="itemId" required>${items.map(item => `<option value="${escapeHTML(item.id)}">${escapeHTML(itemDisplayTitle(item))}${item.issue ? ` — ${escapeHTML(item.issue)}` : ""}</option>`).join("")}</select></div><div class="form-grid"><div class="field"><label>Chave da variante</label><input name="variantKey" required pattern="[A-Za-z0-9_-]{1,80}" placeholder="ex.: variant-a"></div><div class="field"><label>Nome da variante</label><input name="label" required maxlength="80" placeholder="Capa variante A"></div></div><div class="field full"><label>URL oficial da capa</label><input name="coverUrl" type="url" required pattern="https://static\\.dc\\.com/.*" placeholder="https://static.dc.com/2025-01/...jpg"><small class="format-hint">A URL precisa começar com https://static.dc.com/.</small></div><div class="field full"><label>URL da página fonte (opcional)</label><input name="sourceUrl" type="url" placeholder="https://www.dc.com/comics/..."></div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Salvar variante</button></div></form><div class="section-subtitle cover-variants-admin-list"></div></div>`;
    $("#modal-root").appendChild(overlay);
    $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    const itemSelect = $("select[name=itemId]", overlay);
    const list = $(".cover-variants-admin-list", overlay);
    const refreshList = () => {
      const variants = state.coverVariants.get(itemSelect.value) || [];
      list.innerHTML = variants.length ? `<div class="section-subtitle">Variantes cadastradas</div>${variants.map(variant => `<div class="admin-cover-variant-row"><span><b>${escapeHTML(variant.label)}</b><small>${escapeHTML(variant.cover_url)}</small></span><button type="button" class="small-btn danger" data-delete-cover-variant="${escapeHTML(variant.item_id)}" data-delete-variant-key="${escapeHTML(variant.variant_key)}">Excluir</button></div>`).join("")}` : "Nenhuma variante cadastrada para esta edição.";
      $$('[data-delete-cover-variant]', overlay).forEach(button => button.onclick = async () => {
        const result = await sb.from("comic_cover_variants").delete().eq("item_id", button.dataset.deleteCoverVariant).eq("variant_key", button.dataset.deleteVariantKey);
        if (result.error) return toast(result.error.message);
        await loadCoverCatalog();
        refreshList();
        render();
      });
    };
    itemSelect.addEventListener("change", refreshList);
    refreshList();
    $("#cover-variant-admin-form", overlay).onsubmit = async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const coverUrl = String(form.get("coverUrl") || "").trim();
      if (!/^https:\/\/static\.dc\.com\//i.test(coverUrl)) return toast("A capa precisa usar uma URL oficial da DC.");
      const payload = { item_id: String(form.get("itemId")), variant_key: String(form.get("variantKey") || "").trim(), label: String(form.get("label") || "").trim(), cover_url: coverUrl, source_url: String(form.get("sourceUrl") || "").trim() || null, created_at: new Date().toISOString() };
      const result = await sb.from("comic_cover_variants").upsert(payload, { onConflict: "item_id,variant_key" });
      if (result.error) return toast(result.error.message);
      await loadCoverCatalog();
      event.currentTarget.reset();
      itemSelect.value = payload.item_id;
      refreshList();
      render();
      toast("Capa variante cadastrada.");
    };
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
          <button class="small-btn" data-cover-variants>Capas variantes</button>
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
    $("[data-cover-variants]", overlay).onclick = () => { overlay.remove(); openCoverVariantsAdmin(); };
    $("[data-new]", overlay).onclick = () => { overlay.remove(); openEditForm(); };
    $("[data-export]", overlay).onclick = exportDB;
    $("[data-import]", overlay).onclick = importDB;
    $("[data-reset]", overlay).onclick = () => {
      state.db = {library:structuredClone(window.DEFAULT_LIBRARY), collections:structuredClone(window.DEFAULT_COLLECTIONS), submissions:[], removedItemIds:[]};
      save(); overlay.remove(); render(); toast("Catálogo restaurado.");
    };
    $$("[data-edit]", overlay).forEach(b => b.onclick = () => { overlay.remove(); openEditForm(b.dataset.edit); });
    $$("[data-delete]", overlay).forEach(b => b.onclick = () => {
      const itemId = b.dataset.delete;
      state.db.removedItemIds = Array.isArray(state.db.removedItemIds) ? state.db.removedItemIds : [];
      if (!state.db.removedItemIds.includes(itemId)) state.db.removedItemIds.push(itemId);
      state.db.library = state.db.library.filter(x => x.id !== itemId);
      state.db.collections.forEach(c => c.issueIds = c.issueIds.filter(i => i !== itemId));
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

  function renderCatalog(type = null) {
    const items = type ? state.db.library.filter(x => x.type === type) : state.db.library;
    const series = uniqueCatalogItems(items.filter(x => x.seriesId));
    const oneshots = uniqueCatalogItems(items.filter(x => !x.seriesId));
    const heading = type === "manga" ? "Mangás" : type === "comic" ? "Quadrinhos" : "Catálogo";
    const group = (title, groupItems, isSeries = false) => groupItems.length ? `<section class="section"><div class="section-head"><div><h2 class="section-title">${title}</h2><div class="section-subtitle">${groupItems.length} obra(s)</div></div></div><div class="results-grid">${groupItems.map(item => isSeries ? seriesCard(item) : card(item)).join("")}</div></section>` : "";
    const publishers = new Map();
    items.filter(item => String(item.publisher || "").trim()).forEach(item => {
      const publisher = String(item.publisher).trim();
      if (!publishers.has(publisher)) publishers.set(publisher, []);
      publishers.get(publisher).push(item);
    });
    const publisherCarousel = type === "comic" && publishers.size ? `<section class="section publisher-carousel-section"><div class="section-head"><div><h2 class="section-title">Editoras</h2><div class="section-subtitle">Explore os quadrinhos por editora</div></div></div><div class="publisher-carousel">${[...publishers.entries()].sort((a, b) => a[0].localeCompare(b[0], "pt-BR")).map(([publisher, publisherItems]) => { const representative = publisherItems.find(item => item.featuredCoverUrl || item.coverUrl || item.cover) || publisherItems[0]; return `<button class="publisher-card" type="button" data-publisher="${escapeHTML(publisher)}"><div class="publisher-card-cover" style="background-image:url('${escapeHTML(coverFor(representative))}')"></div><div class="publisher-card-overlay"></div><div class="publisher-card-info"><strong>${escapeHTML(publisher)}</strong><span>${publisherItems.length} quadrinho(s)</span></div></button>`; }).join("")}</div></section>` : "";
    const catalogHeader = type === "comic" ? "" : `<div class="section-head"><div><h1 class="section-title">${heading}</h1><div class="section-subtitle">${items.length} edição(ões)</div></div></div>`;
    return `<div class="content">${catalogHeader}${group("Séries", series, true)}${group("Oneshots", oneshots)}${!items.length ? `<div class="empty">Nenhuma edição cadastrada.</div>` : ""}${publisherCarousel}</div>`;
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
      saveCatalog("Coleção criada."); overlay.remove(); render();
    };
  }

  // Nova versão do painel: mantém os dados antigos, mas cadastra séries e metadados novos.
  function openAdminNotificationForm() {
    if (!sb || state.profile?.plan !== "admin") return toast("Apenas administradores podem enviar notificações.");
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = '<div class="modal"><div class="section-head"><div><h2>Enviar notificação geral</h2><div class="section-subtitle">A mensagem será enviada para todos os usuários.</div></div><button class="small-btn" data-close>Fechar</button></div><form id="admin-notification-form"><div class="field"><label>Título</label><input name="title" maxlength="120" required placeholder="Ex.: Novidade na banca"></div><div class="field"><label>Mensagem</label><textarea name="body" maxlength="500" required placeholder="Escreva o aviso..."></textarea></div><div class="field"><label>Tipo</label><select name="type"><option value="announcement">Aviso</option><option value="event">Evento</option><option value="maintenance">Manutenção</option></select></div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button type="submit" class="btn btn-danger">Enviar para todos</button></div></form></div>';
    $("#modal-root").appendChild(overlay);
    $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#admin-notification-form", overlay).onsubmit = async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const result = await sb.rpc("send_notification_to_all", { p_title: String(form.get("title") || "").trim(), p_body: String(form.get("body") || "").trim(), p_type: String(form.get("type") || "announcement") });
      if (result.error) return toast(result.error.message || "Não foi possível enviar a notificação.");
      overlay.remove();
      toast("Notificação enviada para " + (result.data || 0) + " usuário(s).");
    };
  }

  function openAdmin(editId = null) {
    cancelCoverLoads();
    const overlay = document.createElement("div");
    overlay.className = "modal-backdrop";
    overlay.innerHTML = `
      <div class="modal admin-modal">
        <div class="section-head"><div><h2>Administração</h2><div class="section-subtitle">Catálogo de obras, edições e coleções</div></div><button class="small-btn" data-close>Fechar</button></div>
        <div class="notice"><b>Oneshots e séries</b><br>Deixe o campo Série vazio para abrir uma edição diretamente. Use o mesmo nome de série em várias edições para criar a seleção de volumes.</div>
        <div class="admin-actions" style="margin-bottom:15px">
          <button class="btn btn-danger" data-new>+ Nova edição</button><button class="small-btn" data-new-collection>+ Criar coleção</button><button class="small-btn" data-achievements>Títulos</button><button class="small-btn" data-account-plan>Tipo de conta</button>
          <button class="small-btn" data-export>Exportar</button><button class="small-btn" data-import>Importar</button><button class="small-btn" data-reset>Restaurar exemplo</button>
        </div>
        <table class="admin-table"><thead><tr><th>Série / edição</th><th>Editora</th><th>Selo</th><th>Personagem</th><th>Ano</th><th>Ações</th></tr></thead><tbody>
          ${state.db.library.map(x => `<tr><td><b>${escapeHTML(x.seriesTitle || x.title)}</b><br><span style="color:#777">${escapeHTML(x.issue || (x.seriesId ? "Edição" : "Oneshot"))}</span></td><td>${escapeHTML(x.publisher || "—")}</td><td>${escapeHTML(x.imprint || "—")}</td><td>${escapeHTML(x.character || "—")}</td><td>${escapeHTML(String(x.year || "—"))}</td><td><div class="admin-actions"><button class="small-btn" data-edit="${escapeHTML(x.id)}">Editar</button><button class="small-btn danger" data-delete="${escapeHTML(x.id)}">Excluir</button></div></td></tr>`).join("")}
        </tbody></table>
        <h3 style="margin-top:28px">Coleções</h3>
        <div class="admin-collection-list">${state.db.collections.map(c => `<div><b>${escapeHTML(c.title)}</b><span>${c.issueIds.length} edições</span><button class="small-btn danger" data-delete-collection="${escapeHTML(c.id)}">Excluir</button></div>`).join("") || "Nenhuma coleção criada."}</div>
      </div>`;
    $("#modal-root").appendChild(overlay);
    const closeAdmin = event => { event?.preventDefault(); event?.stopPropagation(); overlay.remove(); hydrateHomeCovers(); };
    const notificationButton = document.createElement("button");
    notificationButton.className = "small-btn";
    notificationButton.textContent = "Enviar notificação";
    $(".admin-actions", overlay)?.appendChild(notificationButton);
    notificationButton.onclick = () => { overlay.remove(); openAdminNotificationForm(); };
    $("[data-close]", overlay).onclick = closeAdmin;
    $("[data-new]", overlay).onclick = () => { overlay.remove(); openEditForm(); };
    $("[data-new-collection]", overlay).onclick = () => { overlay.remove(); openCollectionForm(); };
    $("[data-achievements]", overlay).onclick = () => { overlay.remove(); openAchievementAdmin(); };
    $("[data-account-plan]", overlay).onclick = () => { overlay.remove(); openAccountPlanAdmin(); };
    $("[data-export]", overlay).onclick = exportDB; $("[data-import]", overlay).onclick = importDB;
    $("[data-reset]", overlay).onclick = () => { state.db = { library: structuredClone(window.DEFAULT_LIBRARY), collections: structuredClone(window.DEFAULT_COLLECTIONS), submissions: [] }; saveCatalog("Catálogo restaurado."); overlay.remove(); render(); };
    $$('[data-edit]', overlay).forEach(button => button.onclick = () => { overlay.remove(); openEditForm(button.dataset.edit); });
    $$('[data-delete]', overlay).forEach(button => button.onclick = () => { state.db.library = state.db.library.filter(x => x.id !== button.dataset.delete); state.db.collections.forEach(c => c.issueIds = c.issueIds.filter(id => id !== button.dataset.delete)); saveCatalog("Edição excluída."); overlay.remove(); render(); openAdmin(); });
    $$('[data-delete-collection]', overlay).forEach(button => button.onclick = () => { state.db.collections = state.db.collections.filter(c => c.id !== button.dataset.deleteCollection); saveCatalog("Coleção excluída."); overlay.remove(); openAdmin(); });
  }

  function openEditForm(id = null) {
    const old = id ? state.db.library.find(x => x.id === id) : null;
    const x = old || { id: "item-" + Date.now(), title: "", seriesTitle: "", issue: "", type: "comic", author: "", publisher: "", imprint: "", character: "", year: new Date().getFullYear(), description: "", fileUrl: "", telegramUrl: "", featuredCoverUrl: "", format: "auto", clicks: 0, featured: false, tags: [], collectionIds: [] };
    const overlay = document.createElement("div"); overlay.className = "modal-backdrop";
    overlay.innerHTML = `
      <div class="modal"><div class="section-head"><div><h2>${id ? "Editar edição" : "Nova edição"}</h2><div class="section-subtitle">A capa será extraída da primeira página</div></div><button class="small-btn" data-close>Fechar</button></div>
        <form id="edit-form"><div class="form-grid">
          <div class="field"><label>Título da edição</label><input name="title" required value="${escapeHTML(x.title)}"></div>
          <div class="field full"><label>Série (deixe vazio para oneshot)</label><input name="seriesTitle" value="${escapeHTML(x.seriesTitle || "")}" placeholder="Ex.: Homem-Aranha, Universo Casulo"></div>
          <div class="field"><label>Número da edição / volume</label><input name="volume" type="number" min="1" step="1" inputmode="numeric" value="${escapeHTML(String(x.issue || "").match(/\d+/)?.[0] || "")}" placeholder="Ex.: 1"><label class="checkbox-inline"><input name="oneShot" type="checkbox" ${!x.seriesId && !x.issue ? "checked" : ""}> Volume único</label></div>
          <div class="field"><label>Tipo</label><select name="type"><option value="comic" ${x.type === "comic" ? "selected" : ""}>Quadrinho</option><option value="manga" ${x.type === "manga" ? "selected" : ""}>Mangá</option></select></div>
          <div class="field"><label>Ano</label><input name="year" type="number" value="${escapeHTML(x.year || "")}"></div><div class="field"><label>Editora</label><input name="publisher" value="${escapeHTML(x.publisher || "")}"></div><div class="field"><label>Selo</label><input name="imprint" value="${escapeHTML(x.imprint || "")}" placeholder="Ex.: Vertigo, Marvel, Turma da Mônica"></div><div class="field"><label>Personagem principal</label><input name="character" value="${escapeHTML(x.character || "")}"></div><div class="field"><label>Autor</label><input name="author" value="${escapeHTML(x.author || "")}"></div>
          <div class="field full"><label>Link direto do arquivo</label><input name="sourceUrl" required value="${escapeHTML(x.telegramUrl || x.fileUrl || "")}" placeholder="arquivo.pdf, arquivo.cbz, arquivo.cbr..."><small class="format-hint">Formato detectado: <b data-format-preview>${escapeHTML(x.format || "auto")}</b></small></div>
          <div class="field full"><label>Imagem exclusiva do destaque (opcional)</label><input name="featuredCoverUrl" type="url" value="${escapeHTML(x.featuredCoverUrl || "")}" placeholder="https://.../capa-do-destaque.jpg"><small class="format-hint">Use uma imagem horizontal ou uma capa em alta resolução para controlar melhor o destaque.</small></div>
          <div class="field full"><label>Descrição</label><textarea name="description">${escapeHTML(x.description || "")}</textarea></div><div class="field full"><label>Tags</label><input name="tags" value="${escapeHTML((x.tags || []).join(", "))}"></div><div class="field full"><label><input name="featured" type="checkbox" ${x.featured ? "checked" : ""}> Mostrar como destaque</label></div>
        </div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Salvar edição</button></div></form>
      </div>`;
    $("#modal-root").appendChild(overlay); $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    const source = $("[name=sourceUrl]", overlay), preview = $("[data-format-preview]", overlay), volume = $("[name=volume]", overlay), oneShot = $("[name=oneShot]", overlay);
    const syncOneShot = () => { volume.disabled = oneShot.checked; if (oneShot.checked) volume.value = ""; };
    oneShot.addEventListener("change", syncOneShot); syncOneShot();
    source.addEventListener("input", () => preview.textContent = detectFormat(source.value));
    $("#edit-form", overlay).onsubmit = event => { event.preventDefault(); const fd = new FormData(event.currentTarget); const sourceUrl = String(fd.get("sourceUrl") || "").trim(); const seriesTitle = fd.get("oneShot") === "on" ? "" : String(fd.get("seriesTitle") || "").trim(); const volumeNumber = fd.get("oneShot") === "on" ? "" : String(fd.get("volume") || "").replace(/\D/g, ""); const item = { ...x, title: String(fd.get("title") || "").trim(), seriesTitle, seriesId: seriesTitle ? seriesKey(seriesTitle) : "", issue: volumeNumber, type: fd.get("type"), year: Number(fd.get("year")) || new Date().getFullYear(), publisher: String(fd.get("publisher") || "").trim(), imprint: String(fd.get("imprint") || "").trim(), character: String(fd.get("character") || "").trim(), author: String(fd.get("author") || "").trim(), format: detectFormat(sourceUrl), fileUrl: sourceUrl, telegramUrl: "", featuredCoverUrl: String(fd.get("featuredCoverUrl") || "").trim(), description: String(fd.get("description") || "").trim(), tags: String(fd.get("tags") || "").split(",").map(s => s.trim()).filter(Boolean), featured: fd.get("featured") === "on" }; delete item.randomWeight; const index = state.db.library.findIndex(i => i.id === item.id); if (index >= 0) state.db.library[index] = item; else state.db.library.push(item); saveCatalog("Edição salva."); overlay.remove(); render(); };
  }

  function renderCatalog(type = null) {
    const items = type ? state.db.library.filter(x => x.type === type) : state.db.library;
    const series = uniqueCatalogItems(items.filter(x => x.seriesId));
    const oneshots = uniqueCatalogItems(items.filter(x => !x.seriesId));
    const heading = type === "manga" ? "Mangás" : type === "comic" ? "Quadrinhos" : "Catálogo";
    const group = (title, groupItems, isSeries = false) => groupItems.length ? `<section class="section"><div class="section-head"><div><h2 class="section-title">${title}</h2><div class="section-subtitle">${groupItems.length} obra(s)</div></div></div><div class="results-grid">${groupItems.map(item => isSeries ? seriesCard(item) : card(item)).join("")}</div></section>` : "";
    return `<div class="content"><div class="section-head"><div><h1 class="section-title">${heading}</h1><div class="section-subtitle">${items.length} edição(ões)</div></div></div>${group("Séries", series, true)}${group("Oneshots", oneshots)}${!items.length ? `<div class="empty">Nenhuma edição cadastrada.</div>` : ""}</div>`;
  }

  function openSubmission() {
    const overlay = document.createElement("div"); overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal"><div class="section-head"><div><h2>Enviar uma edição</h2><div class="section-subtitle">Ajude a ampliar o catálogo da banca</div></div><button class="small-btn" data-close>Fechar</button></div><form id="submission-form"><div class="form-grid">
      <div class="field"><label>Seu nome</label><input name="author" required></div><div class="field"><label>Nome da série (opcional)</label><input name="seriesTitle" placeholder="Vazio = oneshot"></div><div class="field"><label>Título da edição</label><input name="title" required></div><div class="field"><label>Edição / volume</label><input name="issue"></div><div class="field"><label>Tipo</label><select name="type"><option value="comic">Quadrinho</option><option value="manga">Mangá</option></select></div><div class="field"><label>Ano</label><input name="year" type="number"></div><div class="field"><label>Editora</label><input name="publisher"></div><div class="field"><label>Selo</label><input name="imprint" placeholder="Ex.: Vertigo, Marvel, Turma da Mônica"></div><div class="field"><label>Personagem</label><input name="character"></div><div class="field full"><label>Link direto do arquivo</label><input name="sourceUrl" required placeholder="arquivo.pdf, arquivo.cbz ou arquivo.cbr"></div><div class="field full"><label>Mensagem</label><textarea name="message" placeholder="Observações sobre esta edição"></textarea></div>
    </div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Enviar para análise</button></div></form></div>`;
    $("#modal-root").appendChild(overlay); $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#submission-form", overlay).onsubmit = event => { event.preventDefault(); const fd = new FormData(event.currentTarget); const seriesTitle = String(fd.get("seriesTitle") || "").trim(); state.db.submissions.push({ id: "sub-" + Date.now(), author: String(fd.get("author") || "").trim(), seriesTitle, seriesId: seriesTitle ? seriesKey(seriesTitle) : "", title: String(fd.get("title") || "").trim(), issue: String(fd.get("issue") || "").trim(), type: fd.get("type"), year: Number(fd.get("year")) || "", publisher: String(fd.get("publisher") || "").trim(), imprint: String(fd.get("imprint") || "").trim(), character: String(fd.get("character") || "").trim(), fileUrl: String(fd.get("sourceUrl") || "").trim(), format: detectFormat(fd.get("sourceUrl") || ""), message: String(fd.get("message") || ""), createdAt: new Date().toISOString() }); save(); overlay.remove(); toast("Envio registrado para análise."); };
  }

  function renderCatalog(type = null) {
    const items = type ? state.db.library.filter(x => x.type === type) : state.db.library;
    const series = uniqueCatalogItems(items.filter(x => x.seriesId));
    const oneshots = uniqueCatalogItems(items.filter(x => !x.seriesId));
    const heading = type === "manga" ? "Mangás" : type === "comic" ? "Quadrinhos" : "Catálogo";
    const group = (title, groupItems, isSeries = false) => groupItems.length ? `<section class="section"><div class="section-head"><div><h2 class="section-title">${title}</h2><div class="section-subtitle">${groupItems.length} obra(s)</div></div></div><div class="results-grid">${groupItems.map(item => isSeries ? seriesCard(item) : card(item)).join("")}</div></section>` : "";
    const publishers = new Map();
    items.filter(item => String(item.publisher || "").trim()).forEach(item => {
      const publisher = String(item.publisher).trim();
      if (!publishers.has(publisher)) publishers.set(publisher, []);
      publishers.get(publisher).push(item);
    });
    const publisherCarousel = type === "comic" && publishers.size ? `<section class="section publisher-carousel-section"><div class="section-head"><div><h2 class="section-title">Editoras</h2><div class="section-subtitle">Explore os quadrinhos por editora</div></div></div><div class="publisher-carousel">${[...publishers.entries()].sort((a, b) => a[0].localeCompare(b[0], "pt-BR")).map(([publisher, publisherItems]) => { const representative = publisherItems.find(item => item.featuredCoverUrl || item.coverUrl || item.cover) || publisherItems[0]; return `<button class="publisher-card" type="button" data-publisher="${escapeHTML(publisher)}"><div class="publisher-card-cover" style="background-image:url('${escapeHTML(coverFor(representative))}')"></div><div class="publisher-card-overlay"></div><div class="publisher-card-info"><strong>${escapeHTML(publisher)}</strong><span>${publisherItems.length} quadrinho(s)</span></div></button>`; }).join("")}</div></section>` : "";
    const catalogHeader = type === "comic" ? "" : `<div class="section-head"><div><h1 class="section-title">${heading}</h1><div class="section-subtitle">${items.length} edição(ões)</div></div></div>`;
    return `<div class="content">${catalogHeader}${group("Séries", series, true)}${group("Oneshots", oneshots)}${!items.length ? `<div class="empty">Nenhuma edição cadastrada.</div>` : ""}${publisherCarousel}</div>`;
  }

  function renderCatalog(type = null) {
    const items = type ? state.db.library.filter(x => x.type === type) : state.db.library;
    const series = uniqueCatalogItems(items.filter(x => x.seriesId));
    const oneshots = uniqueCatalogItems(items.filter(x => !x.seriesId));
    const group = (title, groupItems, isSeries = false) => groupItems.length ? `<section class="section"><div class="section-head"><div><h2 class="section-title">${title}</h2><div class="section-subtitle">${groupItems.length} obra(s)</div></div></div><div class="results-grid">${groupItems.map(item => isSeries ? seriesCard(item) : card(item)).join("")}</div></section>` : "";
    const publishers = new Map();
    items.filter(item => String(item.publisher || "").trim()).forEach(item => { const name = String(item.publisher).trim(); if (!publishers.has(name)) publishers.set(name, []); publishers.get(name).push(item); });
    const publisherEntries = [...publishers.entries()].sort((a, b) => a[0].localeCompare(b[0], "pt-BR"));
    const publisherCard = ([name, publisherItems]) => { const setting = state.publisherSettings.get(publisherKey(name)); const cover = setting?.cover_url || instantCover({ title: name }); return `<button class="publisher-card ${setting?.is_pinned ? "is-pinned" : ""}" type="button" data-publisher="${escapeHTML(name)}"><div class="publisher-card-cover" style="background-image:url('${escapeHTML(cover)}')"></div><div class="publisher-card-overlay"></div><div class="publisher-card-info"><strong>${escapeHTML(name)}</strong><span>${publisherItems.length} quadrinho(s)</span></div></button>`; };
    const pinned = publisherEntries.filter(([name]) => state.publisherSettings.get(publisherKey(name))?.is_pinned);
    const publisherPinnedCarousel = type === "comic" && pinned.length ? `<section class="section publisher-pinned-section"><div class="section-head"><div><h2 class="section-title">Editoras fixadas</h2><div class="section-subtitle">Acesso rápido às editoras em destaque</div></div></div><div class="publisher-carousel">${pinned.map(publisherCard).join("")}</div></section>` : "";
    const publisherCarousel = type === "comic" && publisherEntries.length ? `<section class="section publisher-all-section"><div class="section-head"><div><h2 class="section-title">Editoras</h2><div class="section-subtitle">Explore todos os quadrinhos por editora</div></div></div><div class="publisher-carousel">${publisherEntries.map(publisherCard).join("")}</div></section>` : "";
    const popularCollections = state.popularPublicCollections || [];
    const popularCollectionsMarkup = type === "comic" && popularCollections.length ? `<section class="section popular-collections-section"><div class="section-head"><div><h2 class="section-title">Coleções públicas mais curtidas</h2><div class="section-subtitle">Descubra listas públicas da comunidade</div></div></div><div class="feature-grid">${popularCollections.map(collection => `<div class="feature-card" data-public-collection="${escapeHTML(collection.id)}" data-public-owner="${escapeHTML(collection.username)}"><div class="cover" style="background-image:url('${escapeHTML(collection.cover_url || "")}')"></div><div class="gradient"></div><div class="feature-info"><h3>${escapeHTML(collection.name)}</h3><p>${collection.likes} curtida(s) · @${escapeHTML(collection.username)}</p></div></div>`).join("")}</div></section>` : "";
    const heading = type === "manga" ? "Mangás" : type === "comic" ? "Quadrinhos" : "Catálogo";
    const catalogHeader = type === "comic" ? "" : `<div class="section-head"><div><h1 class="section-title">${heading}</h1><div class="section-subtitle">${items.length} edição(ões)</div></div></div>`;
    return `<div class="content">${catalogHeader}${publisherPinnedCarousel}${group("Séries", series, true)}${group("Oneshots", oneshots)}${!items.length ? `<div class="empty">Nenhuma edição cadastrada.</div>` : ""}${publisherCarousel}${popularCollectionsMarkup}</div>`;
  }

  function seriesDefinitionFor(item) {
    const definition = (window.DEFAULT_SERIES || []).find(series => series.id === item?.seriesId);
    return { ...(definition || {}), ...item, title: definition?.name || item?.seriesTitle || item?.title || "Série", seriesTitle: definition?.name || item?.seriesTitle || item?.title || "Série", coverUrl: definition?.coverUrl || item?.coverUrl || item?.cover || "" };
  }

  function seriesCard(item, favoriteIds = state.favoriteIds) {
    const series = seriesDefinitionFor(item);
    const editions = seriesEditions(item);
    const count = editions.length || series.editions || "—";
    const entityButton = (kind, value) => value ? `<button type="button" class="series-entity-link" data-entity-kind="${escapeHTML(kind)}" data-entity-value="${escapeHTML(value)}">${escapeHTML(value)}</button>` : "";
    const saved = favoriteIds.has(item.seriesId);
    return `<article class="series-card" data-open-series="${escapeHTML(item.seriesId)}" tabindex="0"><div class="series-card-cover" style="background-image:url('${escapeHTML(coverFor(series))}')"></div><div class="series-card-body"><div class="eyebrow">Série</div><h3>${escapeHTML(series.name || series.seriesTitle)}</h3><p class="series-card-description">${escapeHTML(series.description || "")}</p><div class="series-card-meta">${entityButton("publisher", series.publisher)}${entityButton("publication", series.publication)}${entityButton("status", series.status)}</div><div class="series-card-footer"><span>${escapeHTML(String(count))} edições</span><button type="button" class="series-save-button ${saved ? "is-saved" : ""}" data-series-favorite="${escapeHTML(item.seriesId)}">${saved ? "★ Salva" : "☆ Salvar"}</button></div></div></article>`;
  }

  window.addEventListener("popstate", applyRoute);
  window.BancaDigital = { state, openReader, openAdmin };
  const appRoot = document.getElementById("app");
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const routeParts = pathParts[0]?.toLowerCase() === "banca-digital-quadrinhos-v3" ? pathParts.slice(1) : pathParts;
  const queryProfile = new URLSearchParams(window.location.search).get("perfil");
  const queryPublicCollection = new URLSearchParams(window.location.search).get("lista");
  const initialPublicUsername = queryProfile
    ? cleanUsername(queryProfile)
    : routeParts.length === 1 && routeParts[0].toLowerCase() !== "index.html"
      ? cleanUsername(decodeURIComponent(routeParts[0]))
      : "";
  if (initialPublicUsername && /^[a-z0-9_]{3,24}$/.test(initialPublicUsername)) {
    state.section = "public-profile";
    state.publicProfile = { loading: true, username: initialPublicUsername, collectionId: queryPublicCollection };
  }
  if (initialPublicUsername) render();
  else applyRoute();
  syncTopAvatar();
  const warmLibarchive = () => loadLibarchiveModule().catch(error => console.warn("Biblioteca CBR indisponível:", error));
  if ("requestIdleCallback" in window) window.requestIdleCallback(warmLibarchive, { timeout: 4000 });
  else window.setTimeout(warmLibarchive, 2500);
  loadComicReadCounts()
    .then(() => { if (state.section !== "reader") render(); })
    .catch(error => console.warn("Contadores de leitura indisponÃ­veis:", error));
  sb?.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      state.session = session;
      state.section = "password-reset";
      render();
    }
  });
  loadAccount()
    .then(async () => {
      if (state.section === "reader") applyRoute();
      if (initialPublicUsername) await loadPublicProfile(initialPublicUsername, queryPublicCollection);
    })
    .catch(error => console.warn("Supabase indisponível:", error))
    .finally(() => {
      if (appRoot) appRoot.style.visibility = "";
    });
})();
