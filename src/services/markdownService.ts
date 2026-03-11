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
export async function renderMarkdownFile(fullPath: string): Promise<void> {
    try {
        const generatedHtml: string = await invoke("open_file", { path: fullPath });
        const renderArea = document.getElementById("render-area");
        if (renderArea) {
            renderArea.innerHTML = generatedHtml;
        }
    } catch (error) {
        console.error("Erro ao abrir arquivo Markdown:", error);
    }
}