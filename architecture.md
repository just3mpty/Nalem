nalem/
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs                 # Logique principale Rust
│   │   ├── commands/
│   │   │   ├── mod.rs
│   │   │   ├── network.rs         # Commandes réseau (nmap, etc.)
│   │   │   ├── pentest.rs         # Commandes de pentest
│   │   │   └── system.rs          # Commandes système
│   │   ├── utils/
│   │   │   ├── mod.rs
│   │   │   ├── script_runner.rs   # Exécution de scripts
│   │   │   └── security.rs        # Utilitaires de sécurité
│   │   └── models/
│   │       ├── mod.rs
│   │       ├── scan_result.rs     # Modèles de résultats
│   │       └── network_info.rs    # Modèles réseau
│   ├── scripts/                   # Scripts externes
│   │   ├── bash/
│   │   │   ├── network_scan.sh
│   │   │   └── port_scan.sh
│   │   ├── python/
│   │   │   ├── vulnerability_scanner.py
│   │   │   └── network_mapper.py
│   │   └── powershell/
│   │       ├── windows_audit.ps1
│   │       └── service_enum.ps1
│   └── config/
│       ├── tools.json             # Configuration des outils
│       └── permissions.json       # Permissions requises
├── src/
│   ├── components/
│   │   ├── NetworkScanner/
│   │   │   ├── index.tsx
│   │   │   └── NetworkScanner.tsx
│   │   ├── ScriptRunner/
│   │   │   ├── index.tsx
│   │   │   └── ScriptRunner.tsx
│   │   └── ResultsViewer/
│   │       ├── index.tsx
│   │       └── ResultsViewer.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── NetworkScan.tsx
│   │   ├── ScriptLibrary.tsx
│   │   └── Results.tsx
│   ├── services/
│   │   ├── api.ts                 # Appels Tauri
│   │   ├── networkService.ts
│   │   └── scriptService.ts
│   ├── types/
│   │   ├── network.ts
│   │   ├── scan.ts
│   │   └── script.ts
│   └── utils/
│       ├── formatters.ts
│       └── validators.ts
├── assets/
│   ├── icons/
│   └── templates/
└── docs/
    ├── scripts/
    └── api/