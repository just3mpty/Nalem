// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod commands;

use commands::network::{run_nmap_scan, check_nmap_availability, get_nmap_version};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            run_nmap_scan,
            check_nmap_availability,
            get_nmap_version
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
