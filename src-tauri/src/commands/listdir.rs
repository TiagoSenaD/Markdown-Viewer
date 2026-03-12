use std::fs;
use std::path::Path;

#[tauri::command]
pub fn list_md_files(folder: String) -> Result<Vec<String>, String> {
    let path = Path::new(&folder);

    if !path.is_dir() {
        return Err(format!("'{}' não é uma pasta válida.", folder));
    }

    let entries = fs::read_dir(path)
        .map_err(|e| format!("Erro ao ler pasta: {}", e))?;

    let mut files: Vec<String> = entries
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let path = entry.path();
            if path.is_file() && path.extension()?.to_str()? == "md" {
                path.to_str().map(|s| s.to_string())
            } else {
                None
            }
        })
        .collect();

    files.sort();

    Ok(files)
}
