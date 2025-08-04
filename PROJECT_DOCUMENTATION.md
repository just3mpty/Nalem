# 📚 Documentation Projet Nalem

## 🎯 Vue d'ensemble

**Nalem** est une suite complète d'outils de pentest et de hacking avec une interface graphique moderne et intuitive. L'application centralise tous les outils essentiels dans une interface unifiée.

### 🏗️ Architecture

- **Frontend** : React + TypeScript + Vite
- **Backend** : Rust + Tauri
- **Design** : Interface sombre moderne avec thème professionnel
- **Structure** : Application desktop native

## 📁 Structure du Projet

```
nalem/
├── src/                          # Frontend React
│   ├── App.tsx                   # Interface principale
│   ├── App.css                   # Styles CSS
│   └── main.tsx                  # Point d'entrée React
├── src-tauri/                    # Backend Rust
│   ├── src/
│   │   ├── lib.rs                # Point d'entrée Tauri
│   │   └── commands/
│   │       ├── mod.rs            # Structures de données
│   │       └── network.rs        # Commandes réseau (Nmap, etc.)
│   └── Cargo.toml                # Dépendances Rust
├── package.json                  # Dépendances Node.js
└── PROJECT_DOCUMENTATION.md      # Cette documentation
```

## 🎨 Interface Utilisateur

### Navigation Principale
- **🌐 Scan Réseau** : Outils de scan réseau (Nmap, Masscan, etc.)
- **📶 Audit Sans Fil** : Outils WiFi (Aircrack-ng, Wifite, etc.)
- **🌍 Pentest Web** : Outils web (Burp Suite, OWASP ZAP, etc.)
- **⚡ Exploitation** : Outils d'exploitation (Metasploit, Hydra, etc.)
- **🔍 Analyse Vulnérabilités** : Scanners de vulnérabilités
- **🛠️ Outils Système** : Outils système (Wireshark, Tcpdump, etc.)

### Thème Visuel
- **Couleurs** : Thème sombre professionnel
- **Palette** : Bleu primaire (#6366f1), Vert secondaire (#10b981)
- **Typographie** : Inter font family
- **Animations** : Transitions fluides et hover effects
- **Layout** : Utilisation optimale de l'espace disponible
- **Responsive** : Adaptation automatique selon la taille d'écran

## 🔧 Modules Implémentés

### 1. 🌐 Scan Réseau

#### Outils Disponibles
- **🔍 Nmap** : Scanner de ports et services (✅ Implémenté)
- **⚡ Masscan** : Scan ultra-rapide (🚧 En développement)
- **👆 Fingerprinting** : Identification des systèmes (🚧 En développement)
- **🔎 Découverte** : Découverte d'hôtes (🚧 En développement)

#### Nmap - Fonctionnalités
- **Types de Scan** :
  - Scan Rapide (ports 1-1024)
  - Scan Complet (tous les ports)
  - Détection Services
  - Détection OS
  - Scan Vulnérabilités
  - Ports Personnalisés

- **Presets de Ports** :
  - Ports Communs : 21,22,23,25,53,80,110,111,135,139,143,443,993,995,1723,3306,3389,5900,8080
  - Ports Web : 80,443,8080,8443,3000,4000,5000,8000,9000
  - Ports Base de Données : 1433,1434,3306,5432,6379,27017,9200
  - Ports Email : 25,110,143,465,587,993,995
  - Personnalisé : Saisie libre

- **Code Couleur des Ports** :
  - 🟢 Vert : Ports ouverts
  - 🟡 Jaune : Ports filtrés
  - 🔴 Rouge : Ports fermés
  - 🟣 Violet : Ports non filtrés

#### Interface Nmap
- **Saisie de cible** : IP ou plage d'adresses
- **Sélecteur de type** : Dropdown avec descriptions
- **Gestion des ports** : Input + presets
- **Statut Nmap** : Vérification automatique de disponibilité
- **Résultats** : Affichage coloré avec scroll contrôlé
- **Layout optimisé** : Utilisation complète de la largeur disponible
- **Sidebar fixe** : Navigation latérale avec tous les outils
- **Hauteur dynamique** : Adaptation automatique selon la taille d'écran
- **Zone résultats étendue** : Plus d'espace pour afficher les résultats

## 🛠️ Backend Rust

### Commandes Tauri
```rust
// Vérification de disponibilité
check_nmap_availability() -> bool

// Obtention de version
get_nmap_version() -> String

// Exécution de scan
run_nmap_scan(request: NmapScanRequest) -> NmapScanResponse
```

### Structures de Données
```rust
pub struct ScanResult {
    pub id: String,
    pub target: String,
    pub scan_type: String,
    pub status: String,
    pub result: Option<String>,
    pub timestamp: String,
    pub tool: String,
}

pub struct NmapScanRequest {
    pub target: String,
    pub scan_type: String,
    pub options: Option<Vec<String>>,
    pub ports: Option<String>,
}
```

### Options Nmap
- **Scan Rapide** : `-F -sS -T4 --reason`
- **Scan Complet** : `-p- -sS -T4 --reason`
- **Détection Services** : `-sV -sS -T4 --reason`
- **Détection OS** : `-O -sS -T4 --reason`
- **Vulnérabilités** : `--script=vuln -sS -T4 --reason`
- **Personnalisé** : `-p{ports} -sS -T4 --reason`

## 🎯 Roadmap

### Phase 1 - Scan Réseau (En cours)
- ✅ Nmap complet
- 🚧 Masscan
- 🚧 Fingerprinting
- 🚧 Découverte d'hôtes

### Phase 2 - Audit Sans Fil
- 🚧 Aircrack-ng suite
- 🚧 Wifite
- 🚧 Airgeddon

### Phase 3 - Pentest Web
- 🚧 Burp Suite
- 🚧 OWASP ZAP
- 🚧 Nikto

### Phase 4 - Exploitation
- 🚧 Metasploit
- 🚧 Hydra
- 🚧 John the Ripper

### Phase 5 - Analyse Vulnérabilités
- 🚧 OpenVAS
- 🚧 Nessus
- 🚧 NSE scripts

### Phase 6 - Outils Système
- 🚧 Wireshark
- 🚧 Tcpdump
- 🚧 Netcat

## 🔄 Développement

### Commandes Utiles
```bash
# Développement
npm run tauri dev

# Build
npm run tauri build

# Vérification Rust
cargo check
```

### Ajout d'un Nouvel Outil
1. **Frontend** : Ajouter dans `networkTools` array
2. **Backend** : Créer commande Rust dans `commands/`
3. **Interface** : Ajouter section dans `tool-content`
4. **Documentation** : Mettre à jour cette doc

### Styles CSS
- **Variables** : Définies dans `:root`
- **Composants** : Classes modulaires
- **Responsive** : Media queries pour mobile
- **Thème** : Cohérent avec palette définie

## 📝 Notes de Développement

### Problèmes Résolus
- ✅ Interface Nmap avec code couleur
- ✅ Gestion des ports personnalisés
- ✅ Scroll contrôlé dans les résultats
- ✅ Vérification automatique de Nmap
- ✅ Navigation multi-outils

### Améliorations Futures
- 🔄 Export des résultats
- 🔄 Historique des scans
- 🔄 Profils de scan sauvegardés
- 🔄 Notifications en temps réel
- 🔄 Mode sombre/clair

## 🎨 Guide de Style

### Couleurs
```css
--primary-color: #6366f1;      /* Bleu principal */
--secondary-color: #10b981;    /* Vert succès */
--accent-color: #f59e0b;       /* Orange accent */
--danger-color: #ef4444;       /* Rouge erreur */
--warning-color: #f97316;      /* Orange avertissement */
```

### Typographie
- **Titres** : Inter, font-weight: 700
- **Corps** : Inter, font-weight: 400
- **Code** : Monaco, Menlo, Ubuntu Mono

### Espacement
- **Padding** : 0.75rem, 1rem, 1.5rem, 2rem
- **Marges** : 0.5rem, 1rem, 1.5rem, 2rem
- **Border-radius** : 8px, 12px, 20px

---

*Dernière mise à jour : Août 2024*
*Version : 0.1.0* 