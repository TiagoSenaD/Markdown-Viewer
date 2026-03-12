use crate::service::parse;

#[tauri::command]
pub fn open_file(path: String) -> Result<(String, String), String> {
    let p = std::path::Path::new(&path);
    
    match std::fs::read_to_string(p) {
        Ok(content) => {
            let html = parse::parse_markdown(&content);
            
            // Pega a pasta pai do arquivo atual
            let parent_dir = p.parent()
                .map(|p| p.to_string_lossy().to_string())
                .unwrap_or_default();
                
            // Retorna uma tupla: (HTML, Caminho da Pasta)
            Ok((html, parent_dir))
        },
        Err(e) => Err(format!("Erro ao ler o arquivo: {}", e)),
    }
}

