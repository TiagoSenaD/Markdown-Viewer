import { parseMarkdown, renderMarkdownFile } from "./services/markdownService";

window.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.querySelector<HTMLInputElement>("#markdown-input");
  const renderArea = document.querySelector<HTMLDivElement>("#render-area");
  const openBtn = document.querySelector<HTMLButtonElement>("#open-btn");

  if (!inputEl || !renderArea) return;

  const isFilePath = (value: string): boolean => {
    const trimmed = value.trim();
    return trimmed.startsWith("/") || trimmed.startsWith("~") || trimmed.startsWith("./");
  };

  const showPlaceholder = () => {
    renderArea.innerHTML = "<p style='color: #999; text-align: center;'>Aguardando entrada...</p>";
  };

  const showError = (msg: string) => {
    renderArea.innerHTML = `<p style='color: #c0392b; text-align: center;'>${msg}</p>`;
  };

  const handleOpen = async () => {
    const value = inputEl.value.trim();
    if (value === "") {
      showPlaceholder();
      return;
    }

    if (isFilePath(value)) {
      try {
        await renderMarkdownFile(value);
      } catch {
        showError(`Não foi possível abrir o arquivo: ${value}`);
      }
    } else {
      const html = await parseMarkdown(value);
      renderArea.innerHTML = html;
    }
  };

  // Botão de pesquisa
  openBtn?.addEventListener("click", handleOpen);

  // Enter no campo de texto
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleOpen();
  });

  showPlaceholder();
});

