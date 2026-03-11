use std::fs;
use crate::service::parse;

#[tauri::command]
pub fn open_file(path: String) -> Result<String, String> {
    match fs::read_to_string(&path) {
        Ok(content) =>{
            let html = parse::parse_markdown(&content);
            Ok(html)
        },
        Err(e) => Err(format!("Erro ao ler o arquivo: {}", e)),
    }
}

