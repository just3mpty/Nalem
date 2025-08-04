use crate::commands::{NmapScanRequest, ScanResult};
use serde::{Deserialize, Serialize};
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::command;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct NmapScanResponse {
    pub success: bool,
    pub result: Option<ScanResult>,
    pub error: Option<String>,
}

/// Exécute un scan Nmap avec les paramètres donnés
#[command]
pub async fn run_nmap_scan(request: NmapScanRequest) -> Result<NmapScanResponse, String> {
    let scan_id = Uuid::new_v4().to_string();
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
        .to_string();

    // Validation de la cible
    if request.target.trim().is_empty() {
        return Err("La cible ne peut pas être vide".to_string());
    }

    // Construction de la commande Nmap selon le type de scan
    let nmap_args = build_nmap_args(&request)?;

    // Exécution de la commande Nmap
    match execute_nmap_command(&nmap_args) {
        Ok(output) => {
            let scan_result = ScanResult {
                id: scan_id,
                target: request.target,
                scan_type: request.scan_type,
                status: "completed".to_string(),
                result: Some(output),
                timestamp,
                tool: "nmap".to_string(),
            };

            Ok(NmapScanResponse {
                success: true,
                result: Some(scan_result),
                error: None,
            })
        }
        Err(e) => {
            let scan_result = ScanResult {
                id: scan_id,
                target: request.target,
                scan_type: request.scan_type,
                status: "error".to_string(),
                result: None,
                timestamp,
                tool: "nmap".to_string(),
            };

            Ok(NmapScanResponse {
                success: false,
                result: Some(scan_result),
                error: Some(e),
            })
        }
    }
}

/// Construit les arguments Nmap selon le type de scan
fn build_nmap_args(request: &NmapScanRequest) -> Result<Vec<String>, String> {
    let mut args = vec!["nmap".to_string()];

        // Ajout des options selon le type de scan
    match request.scan_type.as_str() {
      "quick" => {
        args.extend_from_slice(&[
          "-F".to_string(),        // Fast scan
          "-sS".to_string(),       // SYN scan
          "-T4".to_string(),       // Timing template
          "--reason".to_string(),  // Show reason for port state
        ]);
      }
      "full" => {
        args.extend_from_slice(&[
          "-p-".to_string(),       // All ports
          "-sS".to_string(),       // SYN scan
          "-T4".to_string(),       // Timing template
          "--reason".to_string(),  // Show reason for port state
        ]);
      }
      "service" => {
        args.extend_from_slice(&[
          "-sV".to_string(),       // Version detection
          "-sS".to_string(),       // SYN scan
          "-T4".to_string(),       // Timing template
          "--reason".to_string(),  // Show reason for port state
        ]);
      }
      "os" => {
        args.extend_from_slice(&[
          "-O".to_string(),        // OS detection
          "-sS".to_string(),       // SYN scan
          "-T4".to_string(),       // Timing template
          "--reason".to_string(),  // Show reason for port state
        ]);
      }
      "vuln" => {
        args.extend_from_slice(&[
          "--script=vuln".to_string(), // Vulnerability scripts
          "-sS".to_string(),           // SYN scan
          "-T4".to_string(),           // Timing template
          "--reason".to_string(),      // Show reason for port state
        ]);
      }
      "custom" => {
        if let Some(ref ports) = request.ports {
          if !ports.trim().is_empty() {
            args.push(format!("-p{}", ports.trim()));
          } else {
            return Err("Ports personnalisés requis pour le scan custom".to_string());
          }
        } else {
          return Err("Ports personnalisés requis pour le scan custom".to_string());
        }
        args.extend_from_slice(&[
          "-sS".to_string(),       // SYN scan
          "-T4".to_string(),       // Timing template
          "--reason".to_string(),  // Show reason for port state
        ]);
      }
      _ => {
        return Err(format!("Type de scan non reconnu: {}", request.scan_type));
      }
    }

    // Ajout des options personnalisées si fournies
    if let Some(ref options) = request.options {
        args.extend(options.clone());
    }

    // Ajout de la cible
    args.push(request.target.clone());

    Ok(args)
}

/// Exécute la commande Nmap
fn execute_nmap_command(args: &[String]) -> Result<String, String> {
    // Vérification que Nmap est installé
    let nmap_check = Command::new("which")
        .arg("nmap")
        .output();

    match nmap_check {
        Ok(output) if output.status.success() => {
            // Nmap est installé, on peut l'exécuter
        }
        _ => {
            return Err("Nmap n'est pas installé ou n'est pas dans le PATH".to_string());
        }
    }

    // Exécution de la commande Nmap
    let output = Command::new(&args[0])
        .args(&args[1..])
        .output()
        .map_err(|e| format!("Erreur lors de l'exécution de Nmap: {}", e))?;

    if output.status.success() {
        let stdout = String::from_utf8(output.stdout)
            .map_err(|e| format!("Erreur de décodage UTF-8: {}", e))?;
        Ok(format_nmap_output(&stdout))
    } else {
        let stderr = String::from_utf8(output.stderr)
            .map_err(|e| format!("Erreur de décodage UTF-8: {}", e))?;
        Err(format!("Nmap a échoué: {}", stderr))
    }
}

/// Formate la sortie Nmap pour une meilleure lisibilité
fn format_nmap_output(output: &str) -> String {
    let lines: Vec<&str> = output.lines().collect();
    let mut formatted_lines = Vec::new();
    
    for line in lines {
        // Ignorer les lignes vides ou les lignes de progression
        if line.trim().is_empty() || line.contains("Starting Nmap") || line.contains("Nmap scan report") {
            continue;
        }
        
        // Garder les lignes importantes
        if line.contains("PORT") || line.contains("STATE") || line.contains("SERVICE") || 
           line.contains("open") || line.contains("closed") || line.contains("filtered") ||
           line.contains("Not shown") || line.contains("Host is up") {
            formatted_lines.push(line);
        }
    }
    
    formatted_lines.join("\n")
}

/// Vérifie si Nmap est disponible sur le système
#[command]
pub async fn check_nmap_availability() -> Result<bool, String> {
    let output = Command::new("which")
        .arg("nmap")
        .output()
        .map_err(|e| format!("Erreur lors de la vérification de Nmap: {}", e))?;

    Ok(output.status.success())
}

/// Obtient la version de Nmap installée
#[command]
pub async fn get_nmap_version() -> Result<String, String> {
    let output = Command::new("nmap")
        .arg("--version")
        .output()
        .map_err(|e| format!("Erreur lors de l'obtention de la version de Nmap: {}", e))?;

    if output.status.success() {
        let version = String::from_utf8(output.stdout)
            .map_err(|e| format!("Erreur de décodage UTF-8: {}", e))?;
        Ok(version.lines().next().unwrap_or("Version inconnue").to_string())
    } else {
        Err("Impossible d'obtenir la version de Nmap".to_string())
    }
}

