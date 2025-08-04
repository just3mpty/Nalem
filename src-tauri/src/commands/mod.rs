pub mod network;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ScanResult {
    pub id: String,
    pub target: String,
    pub scan_type: String,
    pub status: String,
    pub result: Option<String>,
    pub timestamp: String,
    pub tool: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NmapScanRequest {
    pub target: String,
    pub scan_type: String,
    pub options: Option<Vec<String>>,
    pub ports: Option<String>,
}

