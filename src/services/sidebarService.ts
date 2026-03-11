import { invoke } from "@tauri-apps/api/core";

/**
 * Lista todos os arquivos .md dentro de uma pasta usando o backend Rust.
 * @param folderPath - Caminho absoluto para a pasta.
 * @returns Array com os caminhos absolutos dos arquivos .md encontrados.
 */
export async function listMdFiles(folderPath: string): Promise<string[]> {
    try {
        const files: string[] = await invoke("list_md_files", { folder: folderPath });
        return files;
    } catch (error) {
        console.error("Erro ao listar arquivos:", error);
        return [];
    }
}

/**
 * Extrai apenas o nome do arquivo (sem o caminho completo).
 * @param fullPath - Caminho absoluto do arquivo.
 * @returns Nome do arquivo com extensão.
 */
export function getFileName(fullPath: string): string {
    return fullPath.split("/").pop() ?? fullPath;
}
