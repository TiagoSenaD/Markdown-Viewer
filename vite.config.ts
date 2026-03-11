import { defineConfig } from "vite";

export default defineConfig({
    // Vite usa src/index.html como entry point
    root: "./src",
    build: {
        // Output do bundle vai para dist/ (raiz do projeto)
        outDir: "../dist",
        emptyOutDir: true,
    },
    server: {
        // Porta padrão do Vite — deve coincidir com o devUrl no tauri.conf.json
        port: 5173,
        strictPort: true,
    },
});
