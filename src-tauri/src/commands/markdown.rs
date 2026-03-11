use crate::service::parse;

#[tauri::command]
pub fn parse_markdown(content: String) -> String {
    parse::parse_markdown(&content)
}

