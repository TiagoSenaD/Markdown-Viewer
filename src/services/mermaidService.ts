import mermaid from "mermaid";

let initialized = false;

/**
 * Inicializa o Mermaid uma única vez com as configurações do tema.
 */
function ensureInit() {
    if (initialized) return;
    mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
        fontFamily: "Inter, sans-serif",
    });
    initialized = true;
}

/**
 * Percorre o elemento raiz buscando blocos <code class="language-mermaid">
 * gerados pelo pulldown-cmark e os converte em diagramas SVG.
 *
 * @param root - Elemento DOM onde o HTML do Markdown foi injetado.
 */
export async function renderMermaidBlocks(root: HTMLElement): Promise<void> {
    ensureInit();

    // pulldown-cmark envolve blocos de código com:
    // <pre><code class="language-mermaid">...</code></pre>
    const blocks = root.querySelectorAll<HTMLElement>("code.language-mermaid");

    if (blocks.length === 0) return;

    let idCounter = 0;

    for (const block of blocks) {
        const definition = block.textContent ?? "";
        const id = `mermaid-diagram-${Date.now()}-${idCounter++}`;

        try {
            const { svg } = await mermaid.render(id, definition);

            // Substitui o <pre><code> pelo SVG renderizado
            const wrapper = document.createElement("div");
            wrapper.className = "mermaid-container";
            wrapper.innerHTML = svg;

            const pre = block.parentElement; // o <pre>
            if (pre && pre.parentElement) {
                pre.parentElement.replaceChild(wrapper, pre);
            }
        } catch (err) {
            console.error(`[Mermaid] Falha ao renderizar diagrama "${id}":`, err);
            // Deixa o bloco de código original visível em caso de erro
            const errorDiv = document.createElement("div");
            errorDiv.className = "mermaid-error";
            errorDiv.textContent = `Erro ao renderizar diagrama Mermaid: ${err}`;
            const pre = block.parentElement;
            if (pre && pre.parentElement) {
                pre.parentElement.insertBefore(errorDiv, pre);
            }
        }
    }
}
