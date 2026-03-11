import { renderMarkdownFile } from "./services/markdownService";
import { listMdFiles, getFileName } from "./services/sidebarService";

window.addEventListener("DOMContentLoaded", () => {
  // --- Elementos ---
  const sidebar      = document.querySelector<HTMLElement>("#sidebar")!;
  const toggleBtn    = document.querySelector<HTMLButtonElement>("#toggle-btn")!;
  const pathInput    = document.querySelector<HTMLInputElement>("#path-input")!;
  const loadBtn      = document.querySelector<HTMLButtonElement>("#load-btn")!;
  const fileList     = document.querySelector<HTMLUListElement>("#file-list")!;
  const renderArea   = document.querySelector<HTMLDivElement>("#render-area")!;

  // --- Estado ---
  let activeItem: HTMLLIElement | null = null;

  // ==========================================
  // TOGGLE SIDEBAR
  // ==========================================
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // ==========================================
  // RENDERIZAR ARQUIVO
  // ==========================================
  async function openFile(fullPath: string, listItem?: HTMLLIElement) {
    // Atualizar item ativo na lista
    if (activeItem) activeItem.classList.remove("active");
    if (listItem) {
      listItem.classList.add("active");
      activeItem = listItem;
    }

    renderArea.innerHTML = `<p class="placeholder-text">Carregando...</p>`;

    try {
      await renderMarkdownFile(fullPath);
    } catch {
      renderArea.innerHTML = `<p class="error-text">Não foi possível abrir: ${fullPath}</p>`;
    }
  }

  // ==========================================
  // POPULAR LISTA DE ARQUIVOS
  // ==========================================
  async function loadFolder(folderPath: string) {
    fileList.innerHTML = `<li class="file-list-empty">Carregando...</li>`;

    const files = await listMdFiles(folderPath);

    if (files.length === 0) {
      fileList.innerHTML = `<li class="file-list-empty">Nenhum arquivo .md encontrado</li>`;
      return;
    }

    fileList.innerHTML = "";

    files.forEach((filePath) => {
      const li = document.createElement("li");
      li.className = "file-item";
      li.title = filePath;

      // Ícone de arquivo
      const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>`;

      li.innerHTML = `${icon}<span>${getFileName(filePath)}</span>`;

      li.addEventListener("click", () => openFile(filePath, li));
      fileList.appendChild(li);
    });

    // Abrir o primeiro arquivo automaticamente
    const firstItem = fileList.querySelector<HTMLLIElement>(".file-item");
    if (firstItem) {
      openFile(files[0], firstItem);
    }
  }

  // ==========================================
  // HANDLER DO INPUT
  // ==========================================
  async function handleLoad() {
    const value = pathInput.value.trim();
    if (!value) return;

    // Se termina com .md → abrir arquivo direto
    if (value.endsWith(".md")) {
      // Limpar lista atual
      fileList.innerHTML = `<li class="file-list-empty">Arquivo avulso</li>`;
      activeItem = null;
      await openFile(value);
    } else {
      // Tratar como pasta
      await loadFolder(value);
    }
  }

  loadBtn.addEventListener("click", handleLoad);
  pathInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleLoad();
  });
});
