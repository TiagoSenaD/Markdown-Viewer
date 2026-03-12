import { invoke } from "@tauri-apps/api/core";

/**
 * Converte uma string Markdown em HTML usando o backend Rust (pulldown-cmark).
 * @param content - Conteúdo Markdown em texto puro.
 * @returns HTML gerado como string.
 */
export async function parseMarkdown(content: string): Promise<string> {
    try {
        const html: string = await invoke("parse_markdown", { content });
        return html;
    } catch (error) {
        console.error("Erro ao converter Markdown:", error);
        return `<p style="color: red;">Erro ao processar o Markdown.</p>`;
    }
}

/**
 * Lê um arquivo .md do disco e renderiza o conteúdo no elemento #viewer.
 * @param fullPath - Caminho absoluto do arquivo no sistema de arquivos.
 */


let currentFolderPath = ""; // Variável global para rastrear onde estamos

export async function renderMarkdownFile(fullPath: string): Promise<void> {
    try {
        // O Rust agora retorna um array/tupla [html, folder]
        const [generatedHtml, folder]: [string, string] = await invoke("open_file", { path: fullPath });

        const renderArea = document.getElementById("render-area");
        if (renderArea) {
            renderArea.innerHTML = generatedHtml;
            currentFolderPath = folder; // Atualiza a pasta base atual

            // Garante que o listener de links esteja ativo
            setupLinkInterceptor();
        }
    } catch (error) {
        console.error("Erro ao abrir arquivo Markdown:", error);
    }
}

function setupLinkInterceptor() {
    const renderArea = document.getElementById("render-area");
    if (!renderArea) return;

    // Remove listener antigo se houver para não duplicar
    renderArea.onclick = async (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest("a");

        if (link) {
            const href = link.getAttribute("href");

            // Verifica se é um link interno (.md) e não um link externo (http)
            if (href && href.endsWith(".md") && !href.startsWith("http")) {
                e.preventDefault(); // Impede o navegador de tentar mudar de página

                // No Windows/Linux, precisamos unir a pasta atual com o link clicado
                // Usar uma barra simples costuma funcionar, mas o ideal é tratar o separador
                const newPath = `${currentFolderPath}/${href}`;

                console.log("Navegando para:", newPath);
                await renderMarkdownFile(newPath);
            }
        }
    };
}