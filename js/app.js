(() => {
  "use strict";

  // --- Inicialização de Bibliotecas ---
  // --- Fim da Inicialização ---
  const DB_KEY = `bancaDigitalDB_v1:${window.CATALOG_VERSION || "local"}`;
  const DEFAULT_AVATAR_URL = "https://i.pinimg.com/736x/be/17/10/be1710edaace144c17bdaf6deb2d2cc8.jpg";

  const DataStore = {
    load() {
      try {
        const saved = JSON.parse(localStorage.getItem(DB_KEY));
        if (saved?.library && saved?.collections) {
          const defaultsById = new Map((window.DEFAULT_LIBRARY || []).map(item => [item.id, item]));
          saved.library = saved.library.map(item => ({ ...(defaultsById.get(item.id) || {}), ...item }));
          const knownIds = new Set(saved.library.map(item => item.id));
          const newDefaults = structuredClone(window.DEFAULT_LIBRARY).filter(item => !knownIds.has(item.id));
          if (newDefaults.length) {
            const merged = { ...saved, library: [...saved.library, ...newDefaults] };
            this.save(merged);
            return merged;
          }
          return saved;
        }
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
    profile: null,
    favoriteIds: new Set(),
    readingProgress: new Map(),
    shelfSnapshot: null,
    shelfExpanded: { saved: false, read: false },
    shelfCategories: [],
    collectionFilter: { field: "all", query: "" },
    comicLikeIds: new Set(),
    comicLikeCounts: new Map(),
    achievementChecks: new Set(),
    achievements: [],
    localBoxFiles: [],
    localBoxVisible: false
  };

  let activeReaderCleanup = null;
  let handlingRoute = false;

  const sectionRoutes = {
    home: "",
    comic: "quadrinhos",
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
      openReader(item, { routeSync: true });
    } else {
      state.section = section;
      state.collectionId = params.get("colecao") || null;
      if (section === "search") state.search = params.get("q") || "";
      if (section === "entity") state.entityFilter = { kind: params.get("tipo") || "character", value: params.get("valor") || "" };
      render();
    }
    handlingRoute = false;
  }

  const sb = window.supabase?.createClient && window.BANCA_SUPABASE_URL
    ? window.supabase.createClient(window.BANCA_SUPABASE_URL, window.BANCA_SUPABASE_KEY)
    : null;

  async function publishCatalog() {
    if (!sb || state.profile?.plan !== "admin") return { skipped: true };
    const result = await sb.functions.invoke("github-catalog", {
      body: { library: state.db.library, collections: state.db.collections },
    });
    if (result.error) throw new Error(result.error.message || "Não foi possível publicar o catálogo.");
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
        toast(`${message} Mas não foi possível atualizar o GitHub.`);
      });
  }

  function authEmail(username) {
    return `${String(username).replace(/^@/, '').toLowerCase()}@login.banca-digital.local`;
  }

  function cleanUsername(value) {
    return String(value || "").replace(/^@/, "").trim().toLowerCase();
  }

  function avatarMarkup(profile, className = "profile-avatar") {
    const planClass = profile?.plan === "admin" ? "avatar-admin" : profile?.plan === "premium" ? "avatar-premium" : "";
    return `<img class="${className} ${planClass}" src="${escapeHTML(profile?.avatar_url || DEFAULT_AVATAR_URL)}" alt="Foto de ${escapeHTML(profile?.username || "usuário")}">`;
  }

  function appAssetUrl(path) {
    return new URL(String(path).replace(/^\/+/, ""), document.baseURI).href;
  }

  function publicProfileHref(username, collectionId = "") {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("perfil", cleanUsername(username));
    if (collectionId) url.searchParams.set("lista", collectionId);
    return `${url.pathname}?${url.searchParams.toString()}`;
  }

  async function loadAccount() {
    if (!sb) return;
    const { data: { session } } = await sb.auth.getSession();
    state.session = session;
    const comicLikes = await sb.from("comic_likes").select("item_id, user_id");
    state.comicLikeIds = new Set((comicLikes.data || []).filter(row => row.user_id === session?.user?.id).map(row => row.item_id));
    state.comicLikeCounts = (comicLikes.data || []).reduce((counts, row) => counts.set(row.item_id, (counts.get(row.item_id) || 0) + 1), new Map());
    if (session?.user) {
      const profile = await sb.from("profiles").select("*").eq("id", session.user.id).single();
      state.profile = profile.data;
      const collections = await sb.from("shelf_collections").select("id, name, cover_url, is_public, item_ids").eq("owner_id", session.user.id).order("created_at", { ascending: true });
      state.shelfCategories = (collections.data || []).map(collection => ({ id: collection.id, name: collection.name, coverUrl: collection.cover_url || "", isPublic: collection.is_public !== false, itemIds: Array.isArray(collection.item_ids) ? collection.item_ids : [] }));
      const favorites = await sb.from("favorites").select("item_id").eq("user_id", session.user.id);
      state.favoriteIds = new Set((favorites.data || []).map(row => row.item_id));
      const progress = await sb.from("reading_progress").select("item_id, page, total_pages, completed, updated_at").eq("user_id", session.user.id);
      state.readingProgress = new Map((progress.data || []).map(row => [row.item_id, row]));
      state.shelfSnapshot = { saved: new Set(state.favoriteIds), read: new Set([...state.readingProgress.entries()].filter(([, row]) => row.completed).map(([id]) => id)) };
      const achievements = await sb.from("user_achievements").select("achievements(name, description, icon)").eq("user_id", session.user.id);
      state.achievements = (achievements.data || []).map(row => row.achievements).filter(Boolean);
      await sb.rpc("touch_profile");
    }
    render();
  }

  async function loadPublicProfile(username, collectionId = null) {
    state.publicProfile = { loading: true, username, collectionId };
    state.collectionFilter = { field: "all", query: "" };
    state.section = "public-profile";
    render();
    if (!sb) {
      state.publicProfile = { error: "A autenticação ainda não foi configurada.", username };
      render();
      return;
    }
    let profile = await sb.from("profiles").select("id, username, avatar_url, title, title_color, plan, shelf_saved_public, shelf_read_public").ilike("username", username).maybeSingle();
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
    const collections = await sb.from("shelf_collections").select("id, name, cover_url, is_public, item_ids").eq("owner_id", profile.data.id).order("created_at", { ascending: true });
    const achievements = await sb.from("user_achievements").select("achievements(name, description, icon)").eq("user_id", profile.data.id);
    const likes = await sb.from("shelf_collection_likes").select("collection_id, user_id").eq("owner_id", profile.data.id);
    const collectionLikes = new Set((likes.data || []).filter(row => row.user_id === state.session?.user?.id).map(row => row.collection_id));
    const collectionLikeCounts = (likes.data || []).reduce((counts, row) => counts.set(row.collection_id, (counts.get(row.collection_id) || 0) + 1), new Map());
    state.publicProfile = {
      profile: profile.data,
      collectionId,
      collections: (collections.data || []).map(collection => ({ id: collection.id, name: collection.name, coverUrl: collection.cover_url || "", isPublic: collection.is_public !== false, itemIds: Array.isArray(collection.item_ids) ? collection.item_ids : [] })),
      favoriteIds: new Set((favorites.data || []).map(row => row.item_id)),
      readingProgress: new Map((progress.data || []).map(row => [row.item_id, row])),
      achievements: (achievements.data || []).map(row => row.achievements).filter(Boolean),
      collectionLikes,
      collectionLikeCounts
    };
    render();
  }

  async function signOut() {
    await sb?.auth.signOut();
    clearLocalBox();
    state.localBoxVisible = false;
    state.session = null; state.profile = null; state.favoriteIds = new Set(); state.readingProgress = new Map(); state.shelfSnapshot = null; state.shelfCategories = []; state.comicLikeIds = new Set(); state.achievements = []; state.achievementChecks = new Set();
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
    render();
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

  function updateCompletionCards(item, completed) {
    $$('[data-open]').filter(element => element.dataset.open === item?.id).forEach(cardElement => {
      const existing = $(".card-completed", cardElement);
      if (completed && !existing) {
        const status = document.createElement("div");
        status.className = "card-completed";
        status.textContent = "✓ Concluída";
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
    if (completed) { awardAchievement("first_completed"); awardAchievement("five_completed"); }
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
    overlay.innerHTML = `<div class="modal comments-modal"><div class="section-head"><div><h2>Comentários</h2><div class="section-subtitle">${escapeHTML(item.title || "Quadrinho")}</div></div><button class="small-btn" data-close>Fechar</button></div><div class="comments-list"><span class="section-subtitle">Carregando...</span></div>${state.session ? '<form class="comment-form"><textarea name="body" maxlength="1000" required placeholder="Escreva um comentário..."></textarea><button class="small-btn" type="submit">Comentar</button></form>' : '<p class="section-subtitle">Entre para comentar.</p>'}</div>`;
    $("#modal-root").appendChild(overlay);
    $("[data-close]", overlay).onclick = () => overlay.remove();
    const list = $(".comments-list", overlay);
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
    const refresh = async () => renderCommentThread(list, await loadCommentThread(item));
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
      if (result.error) toast(result.error.message); else { awardAchievement("first_comment"); form.reset(); await refresh(); }
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
    const refresh = async () => renderCommentThread(list, await loadCommentThread(item));
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
      if (result.error) toast(result.error.message); else { awardAchievement("first_comment"); form.reset(); await refresh(); }
      button.disabled = false;
    });
  }

  function formatCommentDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
  }

  async function loadCommentThread(item) {
    const result = await sb.from("comments").select("id, parent_id, body, created_at, profiles(username, avatar_url, title, plan)").eq("item_id", item.id).order("created_at", { ascending: false });
    if (result.error) return { error: result.error };
    const comments = result.data || [];
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
    return `<article class="comment" data-comment-id="${comment.id}"><div class="comment-author-row">${avatarMarkup(profile, "comment-avatar")}<div class="comment-author-info"><a class="comment-author" href="${publicProfileHref(username)}" target="_blank" rel="noopener">@${escapeHTML(username)}</a>${profile.title ? `<span class="comment-title">${escapeHTML(profile.title)}</span>` : ""}</div></div><p>${escapeHTML(comment.body)}</p><div class="comment-actions"><button class="comment-action ${likedIds.has(comment.id) ? "is-liked" : ""}" data-comment-like="${comment.id}">♥ ${likeCounts.get(comment.id) || 0}</button><button class="comment-action" data-comment-reply="${comment.id}">Responder</button>${children.length ? `<button class="comment-action" data-comment-toggle="${comment.id}">Ver ${children.length} resposta${children.length === 1 ? "" : "s"}</button>` : ""}<time class="comment-date" datetime="${escapeHTML(comment.created_at)}">${escapeHTML(formatCommentDate(comment.created_at))}</time></div><div class="comment-replies" data-comment-replies="${comment.id}" hidden>${replies}</div></article>`;
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
      if (result.error) toast(result.error.message); else { form.remove(); await refresh(); }
      button.disabled = false;
    });
  }

  function openProfileSettings() {
    if (!state.session) return openAuthPage();
    const overlay = document.createElement("div"); overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal"><div class="section-head"><div><h2>Meu perfil</h2><div class="section-subtitle">Personalize seu @, sua foto e a visibilidade da estante</div></div><button class="small-btn" data-close>Fechar</button></div><form id="profile-form"><div class="form-grid"><div class="field full"><label>@usuário</label><input name="username" pattern="[A-Za-z0-9_]{3,24}" required value="${escapeHTML(state.profile?.username || "")}"></div><div class="field full"><label>Foto de perfil</label><input name="avatar" type="file" accept="image/png,image/jpeg,image/webp"></div>${["admin", "premium"].includes(state.profile?.plan) ? `<div class="field full"><label>Visibilidade no perfil público</label><label class="checkbox-inline"><input name="shelfSavedPublic" type="checkbox" ${state.profile?.shelf_saved_public !== false ? "checked" : ""}> Mostrar coleção Salvos</label><label class="checkbox-inline"><input name="shelfReadPublic" type="checkbox" ${state.profile?.shelf_read_public !== false ? "checked" : ""}> Mostrar coleção Lidos</label></div>` : ""}</div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Salvar perfil</button></div></form></div>`;
    $("#modal-root").appendChild(overlay); $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    const profileForm = $("#profile-form", overlay);
    const emailField = document.createElement("div");
    const currentEmail = state.session.user.email || "";
    const hasRecoveryEmail = currentEmail && !currentEmail.endsWith("@login.banca-digital.local");
    emailField.className = "field full profile-email-field";
    emailField.innerHTML = `<label>Email de recuperação <span class="field-optional">(opcional)</span></label><input name="email" type="email" placeholder="voce@email.com" autocomplete="email" value="${hasRecoveryEmail ? escapeHTML(currentEmail) : ""}"><small class="format-hint">Adicionar um email permite recuperar a conta e usá-lo para entrar depois.</small>`;
    $(".form-grid", profileForm).appendChild(emailField);
    $("#profile-form", overlay).onsubmit = async event => { event.preventDefault(); const fd = new FormData(event.currentTarget); const username = cleanUsername(fd.get("username")); if (!/^[a-z0-9_]{3,24}$/.test(username)) return toast("@ inválido."); let avatar_url = state.profile?.avatar_url || null; const file = fd.get("avatar"); if (file?.size) { const path = `${state.session.user.id}/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "_")}`; const upload = await sb.storage.from("avatars").upload(path, file, { upsert: true }); if (upload.error) return toast(upload.error.message); avatar_url = sb.storage.from("avatars").getPublicUrl(path).data.publicUrl; } const preferences = ["admin", "premium"].includes(state.profile?.plan) ? { shelf_saved_public: fd.get("shelfSavedPublic") === "on", shelf_read_public: fd.get("shelfReadPublic") === "on" } : {}; const update = await sb.from("profiles").update({ username, avatar_url, ...preferences }).eq("id", state.session.user.id); if (update.error) return toast(update.error.message.includes("duplicate") ? "Esse @ já está em uso." : update.error.message); state.profile = { ...state.profile, username, avatar_url, ...preferences }; overlay.remove(); render(); toast("Perfil atualizado."); };
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

    if (!item.local) {
      item.clicks = (Number(item.clicks) || 0) + 1;
      save();
    }
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
    const skipCover = options.skipCover === true;
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
      overlay.remove();
      if (options.localObjectUrl) URL.revokeObjectURL(options.localObjectUrl);
    };
    activeReaderCleanup = cleanupReader;
    closeReaderButton.onclick = () => {
      cleanupReader();
      if (!handlingRoute && new URLSearchParams(window.location.search).get("ler")) window.history.back();
    };
    $("[data-like-item]", overlay)?.addEventListener("click", event => { event.stopPropagation(); toggleComicLike(item.id); });
    $("[data-share-item]", overlay)?.addEventListener("click", event => { event.stopPropagation(); shareComic(item.id); });
    $("[data-comment-item]", overlay)?.addEventListener("click", event => { event.stopPropagation(); openCommentsPopup(item); });
    $("[data-open-external]", overlay).onclick = () => window.open(resolvedUrl, "_blank", "noopener");
    $("[data-toggle-cover]", overlay)?.addEventListener("click", () => {
      overlay.remove();
      openReader(item, { skipCover: !skipCover, localObjectUrl: options.localObjectUrl });
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

  async function renderCBZReader(item, url, body, controls, overlay, skipCover = false, resumePage = 1, onPageChange = () => {}) {
    body.innerHTML = `<div class="empty" style="margin:auto">Baixando páginas do CBZ…</div>`;
    try {
      if (!window.JSZip) throw new Error("JSZip não carregou.");
      const response = await fetch(proxiedFileUrl(url), {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        cache: "no-store"
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const buffer = await response.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);
      const names = Object.keys(zip.files)
        .filter(n => !zip.files[n].dir && /\.(jpg|jpeg|png|webp|gif)$/i.test(n))
        .sort((a,b) => a.localeCompare(b, undefined, {numeric:true}));
      if (!names.length) throw new Error("CBZ sem imagens.");

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
  async function renderCBRReader(item, url, body, controls, overlay, skipCover = false, resumePage = 1, onPageChange = () => {}) {
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
      const downloadUrl = proxiedFileUrl(url);
      console.log("[CBR] URL usada no fetch:", downloadUrl);

      const response = await fetch(downloadUrl, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
        cache: "no-store"
      });

      console.log("[CBR] HTTP:", response.status);
      console.log("[CBR] Content-Type:", response.headers.get("content-type") || "desconhecido");

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

      console.log(
        "[CBR] Formato detectado:",
        rarVersion
      );

      if (rarVersion === "RAR5") {
        status("RAR5 detectado. Preparando leitor…");
      } else if (rarVersion === "RAR4") {
        status("RAR4 detectado. Preparando leitor…");
      } else {
        throw new Error("CBR_INVALID_SIGNATURE");
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

  function coverFor(item, variant = "card") {
    // A capa local aparece imediatamente; a capa real substitui-a quando terminar de carregar.
    if (!item) return instantCover({ title: "HQ" });
    if (variant === "hero" && item.featuredCoverUrl) return item.featuredCoverUrl;
    if (item.coverUrl) return item.coverUrl;
    if (item.cover) return item.cover; // backward compatibility
    return instantCover(item);
  }

  function coverCacheKey(item, maxWidth) {
    return `banca-cover:${maxWidth}:${item.id}:${item.fileUrl || item.telegramUrl || ""}`;
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
    if (!isMediaFire || !window.BANCA_SUPABASE_URL) return source;
    const proxy = new URL(`${window.BANCA_SUPABASE_URL}/functions/v1/mediafire-proxy`);
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
    if (format === "pdf" || /\.pdf(?:[?#]|$)/i.test(url)) cover = await pdfCover(url, signal, maxWidth);
    else if (format === "cbz" || /\.cbz(?:[?#]|$)/i.test(url)) cover = await cbzCover(url, signal, maxWidth);
    else if (format === "cbr" || /\.cbr(?:[?#]|$)/i.test(url)) cover = await cbrCover(url, signal, maxWidth);
    else if (/^(jpg|jpeg|png|webp|gif)$/i.test(format)) cover = url;
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
      const job = autoCover(item, controller.signal, maxWidth);
      coverLoading.set(cacheId, job);
      job.then(cover => {
        if (!cover) return;
        $$('[data-cover-id]').filter(el => el.dataset.coverId === item.id && ((el.classList.contains("hero-bg") || el.classList.contains("hero-cover")) === isHero)).forEach(el => { el.style.backgroundImage = `url("${cover}")`; });
      }).catch(error => { element.dataset.coverReady = ""; console.warn("Não foi possível gerar a capa de", item.title, error); })
        .finally(() => coverLoading.delete(cacheId));
    };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { load(entry.target); observer.unobserve(entry.target); } }), { rootMargin: "500px" }) : null;
    elements.forEach(element => {
      if (element.classList.contains("hero-bg")) load(element);
      else if (observer) observer.observe(element);
      else load(element);
    });
  }

  function card(item, progressMap = state.readingProgress, favoriteIds = state.favoriteIds) {
    const completed = progressFor(item, progressMap)?.completed;
    return `
      <article class="card" data-open="${escapeHTML(item.id)}">
        <div class="cover" data-cover-id="${escapeHTML(item.id)}" style="background-image:url('${escapeHTML(coverFor(item))}')">
          <span class="cover-number">${escapeHTML(item.issue || "")}</span>
          <button class="card-favorite ${favoriteIds.has(item.id) ? 'is-favorite' : ''}" data-favorite="${escapeHTML(item.id)}" title="Salvar na estante">★</button>
        </div>
        ${completed ? '<div class="card-completed">✓ Concluída</div>' : ''}
        <div class="card-body">
          <div class="card-title">${escapeHTML(item.seriesTitle || item.title)}</div>
          <div class="card-meta">${formatType(item.type)} · ${escapeHTML(String(item.year || ""))}</div>
          <div class="card-stats">♥ ${Number(item.clicks || 0).toLocaleString("pt-BR")} leituras</div>
          <div class="card-actions"><button class="card-like ${state.comicLikeIds.has(item.id) ? "is-liked" : ""}" data-like-item="${escapeHTML(item.id)}" title="Curtir quadrinho">${state.comicLikeIds.has(item.id) ? "♥" : "♡"} ${state.comicLikeCounts.get(item.id) || 0}</button><button class="card-share" data-share-item="${escapeHTML(item.id)}" title="Compartilhar quadrinho">Compartilhar</button><button class="card-comment" data-comment-item="${escapeHTML(item.id)}" title="Ver comentários">Comentários</button></div>
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
        <div class="rail">${uniqueCatalogItems(items).map(item => card(item)).join("")}</div>
      </section>`;
  }

  function renderHome() {
    const lib = state.db.library;
    const heroItem = weightedRandom(lib.filter(x => x.featured)) || lib[0];
    const mostClicked = uniqueCatalogItems([...lib].sort((a,b) => (b.clicks||0) - (a.clicks||0)).slice(0, 8));
    const randoms = uniqueCatalogItems([...lib].sort(() => Math.random() - .5).slice(0, 8));
    const comics = uniqueCatalogItems(lib.filter(x => x.type === "comic").slice(0, 8));

    return `
      <section class="hero">
        <div class="hero-bg" data-cover-id="${escapeHTML(heroItem?.id || "")}" data-cover-size="hero" style="background-image:url('${escapeHTML(coverFor(heroItem, "hero"))}')"></div>
        <div class="hero-cover" data-cover-id="${escapeHTML(heroItem?.id || "")}" data-cover-size="hero" style="background-image:url('${escapeHTML(coverFor(heroItem, "hero"))}')" aria-hidden="true"></div>
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
    return `<div class="content"><div class="section-head"><div><div class="eyebrow">Explorar catálogo</div><h1 class="section-title">${escapeHTML(filter.value)}</h1><div class="section-subtitle">${items.length} edição(ões) relacionadas a ${title.toLowerCase()}</div></div><button class="small-btn" data-section="home">Voltar ao início</button></div><section class="section"><div class="results-grid">${uniqueCatalogItems(items).map(item => card(item)).join("") || `<div class="empty">Nenhuma edição encontrada.</div>`}</div></section></div>`;
  }

  function renderLoginPage() {
    return `<div class="content auth-page"><div class="auth-card"><div class="eyebrow">Banca Digital</div><h1>Entrar</h1><p class="section-subtitle">Use seu usuário ou email e sua senha para acessar sua estante.</p><form id="auth-form"><div class="field"><label>Usuário ou email</label><input name="username" required placeholder="seu_usuario ou voce@email.com" autocomplete="username"></div><div class="field"><label>Senha</label><input name="password" type="password" required minlength="6" autocomplete="current-password"></div><div class="auth-actions"><button type="submit" class="btn btn-danger" data-auth-mode="login">Entrar</button><button type="button" class="small-btn" data-auth-switch="signup">Criar conta</button></div><button class="link-btn" type="button" data-forgot-password>Esqueci minha senha</button><div class="auth-message" id="auth-message"></div></form></div></div>`;
  }

  function openAccountPlanAdmin() {
    const overlay = document.createElement("div"); overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal"><div class="section-head"><div><h2>Alterar tipo de conta</h2><div class="section-subtitle">Mude uma conta entre gratuita e premium.</div></div><button class="small-btn" data-close>Fechar</button></div><form id="account-plan-form"><div class="form-grid"><div class="field full"><label>@ do usuário</label><input name="username" required placeholder="usuario"></div><div class="field full"><label>Novo tipo de conta</label><select name="plan"><option value="free">Free</option><option value="premium">Premium</option></select></div></div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Salvar alteração</button></div></form></div>`;
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

  function shelfCollectionMarkup(title, items, key, progressMap = state.readingProgress, favoriteIds = state.favoriteIds, actions = "") {
    const expanded = Boolean(state.shelfExpanded[key]);
    const visibleItems = expanded ? items : items.slice(0, SHELF_PREVIEW_LIMIT);
    return `<section class="section shelf-collection"><div class="section-head"><div><h2 class="section-title">${escapeHTML(title)}</h2><div class="section-subtitle">${items.length} item(ns)</div></div><div class="shelf-section-actions">${actions}${items.length > SHELF_PREVIEW_LIMIT ? `<button class="small-btn" data-shelf-expand="${escapeHTML(key)}">${expanded ? "Mostrar menos" : "Ver todos"}</button>` : ""}</div></div><div class="results-grid">${visibleItems.map(item => card(item, progressMap, favoriteIds)).join("") || '<div class="empty">Nenhum item nesta coleção.</div>'}</div></section>`;
  }

  function shelfItemsByIds(ids) {
    const allowed = new Set(ids);
    return uniqueCatalogItems(state.db.library.filter(item => allowed.has(item.id)));
  }

  async function saveShelfCategories(categories) {
    if (sb && state.session) {
      const rows = categories.map(category => ({ id: category.id, owner_id: state.session.user.id, name: category.name, cover_url: category.coverUrl || null, is_public: category.isPublic !== false, item_ids: category.itemIds || [] }));
      const result = rows.length ? await sb.from("shelf_collections").upsert(rows, { onConflict: "id" }) : { error: null };
      if (result.error) return toast("Não foi possível salvar a organização da estante.");
      const ids = rows.map(row => row.id);
      const existing = await sb.from("shelf_collections").select("id").eq("owner_id", state.session.user.id);
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
    if (!confirm("Excluir esta subcategoria? Os quadrinhos não serão excluídos da coleção Salvos.")) return;
    state.shelfCategories = state.shelfCategories.filter(category => category.id !== categoryId);
    saveShelfCategories(state.shelfCategories);
  }

  function renderShelfPage() {
    if (!state.session) return renderLoginPage();
    const snapshot = ensureShelfSnapshot();
    const savedItems = shelfItemsByIds([...snapshot.saved]);
    const readItems = shelfItemsByIds([...snapshot.read]);
    const canCustomize = ["admin", "premium"].includes(state.profile?.plan);
    const categories = state.shelfCategories.map(category => ({ ...category, itemIds: (category.itemIds || []).filter(id => snapshot.saved.has(id)) }));
    return `<div class="content"><div class="profile-header">${avatarMarkup(state.profile)}<div><div class="eyebrow">@${escapeHTML(state.profile?.username || "")}</div>${state.profile?.title ? `<div class="profile-title" style="--title-bg:${safeTitleColor(state.profile.title_color)}">${escapeHTML(state.profile.title)}</div>` : ""}${trophyRoom(state.achievements)}</div><div class="profile-actions"><button class="small-btn" data-action="profile">Editar perfil</button><button class="small-btn" data-action="logout">Sair</button></div></div><div class="section-head"><div><h1 class="section-title">Minha estante</h1><div class="section-subtitle">Coleções fixas para organizar seus quadrinhos</div></div><button class="btn btn-danger" data-action="open-local-box">Abrir caixa</button></div><div class="notice local-box-notice"><b>Minha caixa:</b> leia arquivos do seu computador sem enviá-los para o servidor. Tudo fica apenas neste navegador e some quando você sair.</div>${shelfCollectionMarkup("Salvos", savedItems, "saved")}${shelfCollectionMarkup("Lidos", readItems, "read")}${canCustomize ? `<section class="section shelf-categories"><div class="section-head"><div><h2 class="section-title">Coleções pessoais</h2><div class="section-subtitle">Coleções públicas aparecem no seu perfil e podem ser compartilhadas</div></div><button class="small-btn" data-shelf-new-category>+ Nova coleção</button></div>${categories.map(category => shelfCollectionMarkup(category.name, shelfItemsByIds(category.itemIds), `category:${category.id}`, state.readingProgress, state.favoriteIds, `<span class="shelf-visibility ${category.isPublic !== false ? "is-public" : "is-private"}">${category.isPublic !== false ? "Pública" : "Privada"}</span>${category.isPublic !== false ? `<button class="small-btn" data-copy-collection="${escapeHTML(category.id)}">Compartilhar</button>` : ""}<button class="small-btn" data-shelf-edit-category="${escapeHTML(category.id)}">Editar</button><button class="small-btn danger" data-shelf-delete-category="${escapeHTML(category.id)}">Excluir</button>`)).join("") || '<div class="empty">Crie uma coleção para começar a organizar seus salvos.</div>'}</section>` : ""}</div>`;
  }

  function renderPublicCollectionPage(publicState, category) {
    const profile = publicState.profile;
    const allItems = uniqueCatalogItems(state.db.library.filter(item => (category.itemIds || []).includes(item.id) && publicState.favoriteIds.has(item.id)));
    const filter = state.collectionFilter || { field: "all", query: "" };
    const items = filterCollectionItems(allItems, filter.field, filter.query);
    const isLiked = publicState.collectionLikes?.has(category.id);
    const likes = publicState.collectionLikeCounts?.get(category.id) || 0;
    const cover = category.coverUrl ? `style="background-image:url('${escapeHTML(category.coverUrl)}')"` : "";
    return `<div class="content public-collection-page"><div class="public-collection-hero"><div class="public-collection-icon ${category.coverUrl ? "has-cover" : ""}" ${cover}>${category.coverUrl ? "" : "▣"}</div><div><div class="eyebrow">Coleção pública</div><h1 class="section-title">${escapeHTML(category.name)}</h1><div class="collection-creator-block">${avatarMarkup(profile, "collection-creator-avatar")}<div><a class="collection-creator" href="${escapeHTML(publicProfileHref(profile.username))}">@${escapeHTML(profile.username)}</a>${profile.title ? `<div class="collection-creator-title" style="--title-bg:${safeTitleColor(profile.title_color)}">${escapeHTML(profile.title)}</div>` : ""}</div></div><div class="section-subtitle">${allItems.length} item(ns)</div></div></div><div class="section-head"><div><h2 class="section-title">${escapeHTML(category.name)}</h2><div class="section-subtitle">Uma coleção compartilhada da Banca Digital</div></div><div class="shelf-section-actions"><button class="small-btn ${isLiked ? "is-liked" : ""}" data-like-collection="${escapeHTML(category.id)}" data-like-owner="${escapeHTML(profile.id)}">${isLiked ? "♥ Curtida" : "♡ Curtir"} · ${likes}</button><button class="small-btn" data-copy-collection="${escapeHTML(category.id)}" data-copy-username="${escapeHTML(profile.username)}">Copiar link</button><a class="small-btn" href="${escapeHTML(publicProfileHref(profile.username))}">Ver perfil</a></div></div><form class="collection-filter" data-collection-filter-form><select name="field"><option value="all" ${filter.field === "all" ? "selected" : ""}>Filtrar por qualquer campo</option><option value="author" ${filter.field === "author" ? "selected" : ""}>Autor</option><option value="publisher" ${filter.field === "publisher" ? "selected" : ""}>Editora</option><option value="character" ${filter.field === "character" ? "selected" : ""}>Personagem</option><option value="tag" ${filter.field === "tag" ? "selected" : ""}>Gênero / tag</option><option value="seriesTitle" ${filter.field === "seriesTitle" ? "selected" : ""}>Série</option><option value="title" ${filter.field === "title" ? "selected" : ""}>Título</option></select><input name="query" value="${escapeHTML(filter.query)}" placeholder="Digite para filtrar a coleção"><button class="small-btn">Filtrar</button></form><div class="collection-results-meta">${items.length} de ${allItems.length} item(ns)</div><div class="results-grid">${items.map(item => card(item, publicState.readingProgress, publicState.favoriteIds)).join("") || '<div class="empty">Nenhum quadrinho corresponde ao filtro.</div>'}</div></div>`;
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

  function renderPublicProfilePage() {
    const publicState = state.publicProfile;
    if (!publicState || publicState.loading) return '<div class="content"><div class="empty">Carregando perfil...</div></div>';
    if (publicState.error) return `<div class="content"><div class="empty">${escapeHTML(publicState.error)}</div></div>`;
    const profile = publicState.profile;
    const savedVisible = !["admin", "premium"].includes(profile.plan) || profile.shelf_saved_public !== false;
    const readVisible = !["admin", "premium"].includes(profile.plan) || profile.shelf_read_public !== false;
    const savedItems = uniqueCatalogItems(state.db.library.filter(item => publicState.favoriteIds.has(item.id)));
    const readItems = uniqueCatalogItems(state.db.library.filter(item => publicState.readingProgress.get(item.id)?.completed));
    const publicCategories = (publicState.collections || []).filter(category => category.isPublic !== false);
    const selectedCategory = publicCategories.find(category => category.id === publicState.collectionId);
    if (publicState.collectionId && selectedCategory) return renderPublicCollectionPage(publicState, selectedCategory);
    if (publicState.collectionId && !selectedCategory) return `<div class="content"><div class="empty">Esta coleção não existe ou é privada.</div><a class="small-btn" href="${escapeHTML(publicProfileHref(profile.username))}">Voltar ao perfil</a></div>`;
    return `<div class="content public-profile-page">
      <div class="profile-header">
        ${avatarMarkup(profile)}
        <div>
          <div class="eyebrow">@${escapeHTML(profile.username)}</div>
          ${profile.title ? `<div class="profile-title" style="--title-bg:${safeTitleColor(profile.title_color)}">${escapeHTML(profile.title)}</div>` : '<div class="section-subtitle">Perfil público</div>'}
          ${trophyRoom(publicState.achievements)}
        </div>
      </div>
      <div class="section-head"><div><h1 class="section-title">Estante de @${escapeHTML(profile.username)}</h1><div class="section-subtitle">Coleções públicas do perfil</div></div><button class="small-btn" data-section="home">Voltar ao início</button></div>
      ${savedVisible ? shelfCollectionMarkup("Salvos", savedItems, "public-saved", publicState.readingProgress, publicState.favoriteIds) : '<div class="notice">A coleção Salvos está oculta neste perfil.</div>'}
      ${readVisible ? shelfCollectionMarkup("Lidos", readItems, "public-read", publicState.readingProgress, publicState.favoriteIds) : '<div class="notice">A coleção Lidos está oculta neste perfil.</div>'}
      ${publicCategories.map(category => { const items = uniqueCatalogItems(state.db.library.filter(item => (category.itemIds || []).includes(item.id) && publicState.favoriteIds.has(item.id))); const liked = publicState.collectionLikes?.has(category.id); const likes = publicState.collectionLikeCounts?.get(category.id) || 0; return shelfCollectionMarkup(category.name, items, `public-category:${category.id}`, publicState.readingProgress, publicState.favoriteIds, `<span class="shelf-visibility is-public">Pública</span><button class="small-btn ${liked ? "is-liked" : ""}" data-like-collection="${escapeHTML(category.id)}" data-like-owner="${escapeHTML(profile.id)}">${liked ? "♥" : "♡"} ${likes}</button><a class="small-btn" href="${escapeHTML(publicProfileHref(profile.username, category.id))}">Abrir coleção</a><button class="small-btn" data-copy-collection="${escapeHTML(category.id)}" data-copy-username="${escapeHTML(profile.username)}">Compartilhar</button>`); }).join("")}
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
    const results = uniqueCatalogItems(state.db.library.filter(x => {
      const hay = [x.title,x.seriesTitle,x.issue,x.author,x.publisher,x.imprint,x.character,x.description,...(x.tags||[])].join(" ").toLowerCase();
      return !q || hay.includes(q);
    }));
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
                <div class="results-grid">${initials.get(initial).sort((a, b) => (a.seriesTitle || a.title).localeCompare(b.seriesTitle || b.title, "pt-BR")).map(item => card(item)).join("")}</div>
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

  function render() {
    const main = $("#main");
    if (state.section === "home") main.innerHTML = renderHome();
    else if (state.section === "comic") main.innerHTML = renderCatalog("comic");
    else if (state.section === "manga") main.innerHTML = renderCatalog("manga");
    else if (state.section === "collections") main.innerHTML = renderCollections();
    else if (state.section === "collection") main.innerHTML = renderCollectionPage();
    else if (state.section === "search") main.innerHTML = renderSearch();
    else if (state.section === "entity") main.innerHTML = renderEntityPage();
    else if (state.section === "login") main.innerHTML = renderLoginPage();
    else if (state.section === "signup") main.innerHTML = renderSignupPage();
    else if (state.section === "shelf") main.innerHTML = renderShelfPage();
    else if (state.section === "local-box") main.innerHTML = renderLocalBoxPage();
    else if (state.section === "public-profile") main.innerHTML = renderPublicProfilePage();
    else if (state.section === "password-reset") main.innerHTML = renderPasswordResetPage();
    else if (state.section === "reader") main.innerHTML = "";
    bind();
    hydrateHomeCovers();
  }

  function setSection(section) {
    if (!handlingRoute && sectionRoutes[section] !== undefined) {
      setSectionRoute(section);
      return;
    }
    state.section = section;
    $$(".nav-link").forEach(btn => btn.classList.toggle("active", btn.dataset.section === section || (section === "comic" && btn.dataset.section === "comics")));
    render();
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function bind() {
    const canManage = state.profile?.plan === "admin";
    const isAdmin = state.profile?.plan === "admin";
    const headerAvatar = $(".avatar");
    if (headerAvatar) {
      headerAvatar.innerHTML = avatarMarkup(state.profile, "top-avatar-img");
      headerAvatar.title = state.session ? "Abrir minha estante" : "Entrar ou abrir minha estante";
      headerAvatar.classList.toggle("avatar-admin", state.profile?.plan === "admin");
      headerAvatar.classList.toggle("avatar-premium", state.profile?.plan === "premium");
    }
    $$('[data-action="open-admin"]').forEach(button => { button.style.display = canManage ? "" : "none"; });
    $$('[data-action="submit"]').forEach(button => { button.style.display = isAdmin ? "" : "none"; });
    $$('.local-box-nav').forEach(button => { button.style.display = state.session && state.localBoxVisible ? "" : "none"; });
    $$('[data-favorite]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); toggleFavorite(el.dataset.favorite); }));
    $$('[data-like-item]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); toggleComicLike(el.dataset.likeItem); }));
    $$('[data-share-item]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); shareComic(el.dataset.shareItem); }));
    $$('[data-comment-item]').forEach(el => el.addEventListener("click", event => {
      event.stopPropagation();
      const item = state.db.library.find(entry => entry.id === el.dataset.commentItem);
      if (item) openCommentsPopup(item);
    }));
    $$('[data-shelf-expand]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); state.shelfExpanded[el.dataset.shelfExpand] = !state.shelfExpanded[el.dataset.shelfExpand]; render(); }));
    $('[data-shelf-new-category]')?.addEventListener("click", () => openShelfCategoryForm());
    $$('[data-shelf-edit-category]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); openShelfCategoryForm(el.dataset.shelfEditCategory); }));
    $$('[data-shelf-delete-category]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); deleteShelfCategory(el.dataset.shelfDeleteCategory); }));
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
    $$('[data-like-collection]').forEach(el => el.addEventListener("click", event => { event.stopPropagation(); toggleCollectionLike(el.dataset.likeOwner, el.dataset.likeCollection); }));
    $("[data-collection-filter-form]")?.addEventListener("submit", event => { event.preventDefault(); const form = new FormData(event.currentTarget); state.collectionFilter = { field: String(form.get("field") || "all"), query: String(form.get("query") || "") }; render(); });
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
      if (a === "do-search") { state.search = $("#search-input")?.value || ""; navigate({ pagina: "pesquisar", q: state.search }); }
      if (a === "open-admin") { if (canManage) openAdmin(); }
      if (a === "open-auth") state.session ? setSection("shelf") : openAuthPage();
      if (a === "logout") signOut();
      if (a === "profile") openProfileSettings();
      if (a === "submit") { if (isAdmin) openSubmission(); else toast("O envio de quadrinhos é exclusivo para administradores."); }
      if (a === "open-local-box") { state.localBoxVisible = true; setSection("local-box"); }
    }));
    $$("[data-collection]").forEach(el => el.addEventListener("click", () => openCollection(el.dataset.collection)));
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
    overlay.innerHTML = `
      <div class="modal series-modal">
        <div class="section-head">
          <div><div class="eyebrow">Série</div><h2>${escapeHTML(series.seriesTitle || series.title)}</h2><div class="section-subtitle">${editions.length} edições disponíveis</div></div>
          <button class="small-btn" data-close>Fechar</button>
        </div>
        <div class="results-grid">${editions.slice().sort((a,b) => String(a.issue || "").localeCompare(String(b.issue || ""), undefined, {numeric:true})).map(item => card(item)).join("")}</div>
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
    if (state.db.collections.some(collection => collection.id === id)) navigate({ pagina: "colecoes", colecao: id });
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
      state.db = {library:structuredClone(window.DEFAULT_LIBRARY), collections:structuredClone(window.DEFAULT_COLLECTIONS), submissions:[]};
      save(); overlay.remove(); render(); toast("Catálogo restaurado.");
    };
    $$("[data-edit]", overlay).forEach(b => b.onclick = () => { overlay.remove(); openEditForm(b.dataset.edit); });
    $$("[data-delete]", overlay).forEach(b => b.onclick = () => {
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
      saveCatalog("Coleção criada."); overlay.remove(); render();
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
    const group = (title, groupItems) => groupItems.length ? `<section class="section"><div class="section-head"><div><h2 class="section-title">${title}</h2><div class="section-subtitle">${groupItems.length} obra(s)</div></div></div><div class="results-grid">${groupItems.map(item => card(item)).join("")}</div></section>` : "";
    return `<div class="content"><div class="section-head"><div><h1 class="section-title">${heading}</h1><div class="section-subtitle">${items.length} edição(ões)</div></div></div>${group("Séries", series)}${group("Oneshots", oneshots)}${!items.length ? `<div class="empty">Nenhuma edição cadastrada.</div>` : ""}</div>`;
  }

  function openSubmission() {
    const overlay = document.createElement("div"); overlay.className = "modal-backdrop";
    overlay.innerHTML = `<div class="modal"><div class="section-head"><div><h2>Enviar uma edição</h2><div class="section-subtitle">Ajude a ampliar o catálogo da banca</div></div><button class="small-btn" data-close>Fechar</button></div><form id="submission-form"><div class="form-grid">
      <div class="field"><label>Seu nome</label><input name="author" required></div><div class="field"><label>Nome da série (opcional)</label><input name="seriesTitle" placeholder="Vazio = oneshot"></div><div class="field"><label>Título da edição</label><input name="title" required></div><div class="field"><label>Edição / volume</label><input name="issue"></div><div class="field"><label>Tipo</label><select name="type"><option value="comic">Quadrinho</option><option value="manga">Mangá</option></select></div><div class="field"><label>Ano</label><input name="year" type="number"></div><div class="field"><label>Editora</label><input name="publisher"></div><div class="field"><label>Selo</label><input name="imprint" placeholder="Ex.: Vertigo, Marvel, Turma da Mônica"></div><div class="field"><label>Personagem</label><input name="character"></div><div class="field full"><label>Link direto do arquivo</label><input name="sourceUrl" required placeholder="arquivo.pdf, arquivo.cbz ou arquivo.cbr"></div><div class="field full"><label>Mensagem</label><textarea name="message" placeholder="Observações sobre esta edição"></textarea></div>
    </div><div class="modal-actions"><button type="button" class="small-btn" data-close>Cancelar</button><button class="btn btn-danger">Enviar para análise</button></div></form></div>`;
    $("#modal-root").appendChild(overlay); $$('[data-close]', overlay).forEach(button => button.onclick = () => overlay.remove());
    $("#submission-form", overlay).onsubmit = event => { event.preventDefault(); const fd = new FormData(event.currentTarget); const seriesTitle = String(fd.get("seriesTitle") || "").trim(); state.db.submissions.push({ id: "sub-" + Date.now(), author: String(fd.get("author") || "").trim(), seriesTitle, seriesId: seriesTitle ? seriesKey(seriesTitle) : "", title: String(fd.get("title") || "").trim(), issue: String(fd.get("issue") || "").trim(), type: fd.get("type"), year: Number(fd.get("year")) || "", publisher: String(fd.get("publisher") || "").trim(), imprint: String(fd.get("imprint") || "").trim(), character: String(fd.get("character") || "").trim(), fileUrl: String(fd.get("sourceUrl") || "").trim(), format: detectFormat(fd.get("sourceUrl") || ""), message: String(fd.get("message") || ""), createdAt: new Date().toISOString() }); save(); overlay.remove(); toast("Envio registrado para análise."); };
  }

  window.addEventListener("popstate", applyRoute);
  window.BancaDigital = { state, openReader, openAdmin };
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
  sb?.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      state.session = session;
      state.section = "password-reset";
      render();
    }
  });
  loadAccount()
    .then(() => initialPublicUsername && loadPublicProfile(initialPublicUsername, queryPublicCollection))
    .catch(error => console.warn("Supabase indisponível:", error));
})();
