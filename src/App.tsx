import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface ScanResult {
  id: string;
  target: string;
  scan_type: string;
  status: string;
  result?: string;
  timestamp: string;
  tool: string;
}

interface NmapScanRequest {
  target: string;
  scan_type: string;
  options?: string[];
  ports?: string;
}

interface NmapScanResponse {
  success: boolean;
  result?: ScanResult;
  error?: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('network');
  const [activeNetworkTool, setActiveNetworkTool] = useState('nmap');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('quick');
  const [customPorts, setCustomPorts] = useState('');
  const [nmapAvailable, setNmapAvailable] = useState<boolean | null>(null);
  const [nmapVersion, setNmapVersion] = useState<string>('');

  const tabs = [
    { id: 'network', name: 'Scan Réseau', icon: '🌐' },
    { id: 'wireless', name: 'Audit Sans Fil', icon: '📶' },
    { id: 'web', name: 'Pentest Web', icon: '🌍' },
    { id: 'exploitation', name: 'Exploitation', icon: '⚡' },
    { id: 'vulnerability', name: 'Analyse Vulnérabilités', icon: '🔍' },
    { id: 'system', name: 'Outils Système', icon: '🛠️' }
  ];

  const networkTools = [
    { id: 'nmap', name: 'Nmap', icon: '🔍', description: 'Scanner de ports et services', status: 'available' as const },
    { id: 'masscan', name: 'Masscan', icon: '⚡', description: 'Scan ultra-rapide de ports', status: 'development' as const },
    { id: 'fingerprint', name: 'Fingerprinting', icon: '👆', description: 'Identification des systèmes', status: 'development' as const },
    { id: 'discovery', name: 'Découverte', icon: '🔎', description: 'Découverte d\'hôtes', status: 'development' as const }
  ];

  const nmapScanTypes = [
    { id: 'quick', name: 'Scan Rapide', description: 'Ports communs (1-1024)' },
    { id: 'full', name: 'Scan Complet', description: 'Tous les ports (1-65535)' },
    { id: 'service', name: 'Détection Services', description: 'Identification des services' },
    { id: 'os', name: 'Détection OS', description: 'Détection du système d\'exploitation' },
    { id: 'vuln', name: 'Scan Vulnérabilités', description: 'Recherche de vulnérabilités' },
    { id: 'custom', name: 'Ports Personnalisés', description: 'Spécifier les ports manuellement' }
  ];

  const portPresets = [
    { id: 'common', name: 'Ports Communs', value: '21,22,23,25,53,80,110,111,135,139,143,443,993,995,1723,3306,3389,5900,8080' },
    { id: 'web', name: 'Ports Web', value: '80,443,8080,8443,3000,4000,5000,8000,9000' },
    { id: 'database', name: 'Ports Base de Données', value: '1433,1434,3306,5432,6379,27017,9200' },
    { id: 'mail', name: 'Ports Email', value: '25,110,143,465,587,993,995' },
    { id: 'custom', name: 'Personnalisé', value: '' }
  ];

  // Fonction pour colorer les résultats Nmap
  const colorizeNmapOutput = (output: string): string => {
    return output
      .replace(/(\d+\/tcp\s+)(open)/g, '$1<span class="port-open">$2</span>')
      .replace(/(\d+\/tcp\s+)(filtered)/g, '$1<span class="port-filtered">$2</span>')
      .replace(/(\d+\/tcp\s+)(closed)/g, '$1<span class="port-closed">$2</span>')
      .replace(/(\d+\/tcp\s+)(unfiltered)/g, '$1<span class="port-unfiltered">$2</span>')
      .replace(/(\d+\/udp\s+)(open)/g, '$1<span class="port-open">$2</span>')
      .replace(/(\d+\/udp\s+)(filtered)/g, '$1<span class="port-filtered">$2</span>')
      .replace(/(\d+\/udp\s+)(closed)/g, '$1<span class="port-closed">$2</span>')
      .replace(/(\d+\/udp\s+)(unfiltered)/g, '$1<span class="port-unfiltered">$2</span>');
  };

  // Vérification de la disponibilité de Nmap au chargement
  useEffect(() => {
    checkNmapAvailability();
  }, []);

  const checkNmapAvailability = async () => {
    try {
      const available = await invoke<boolean>("check_nmap_availability");
      setNmapAvailable(available);
      
      if (available) {
        const version = await invoke<string>("get_nmap_version");
        setNmapVersion(version);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de Nmap:", error);
      setNmapAvailable(false);
    }
  };

  const handleScan = async () => {
    if (!target.trim() || !nmapAvailable) return;

    const request: NmapScanRequest = {
      target: target.trim(),
      scan_type: scanType,
      ports: scanType === 'custom' ? customPorts : undefined,
    };

    setIsScanning(true);

    try {
      const response = await invoke<NmapScanResponse>("run_nmap_scan", { request });
      
      if (response.success && response.result) {
        setScanResults(prev => [response.result!, ...prev]);
      } else if (response.result) {
        setScanResults(prev => [response.result!, ...prev]);
        console.error("Erreur lors du scan:", response.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'appel de la commande:", error);
      const errorResult: ScanResult = {
        id: Date.now().toString(),
        target: target,
        scan_type: scanType,
        status: 'error',
        result: `Erreur: ${error}`,
        timestamp: new Date().toISOString(),
        tool: 'nmap'
      };
      setScanResults(prev => [errorResult, ...prev]);
    } finally {
      setIsScanning(false);
    }
  };

  const handlePortPresetChange = (preset: string) => {
    const selectedPreset = portPresets.find(p => p.id === preset);
    if (selectedPreset && preset !== 'custom') {
      setCustomPorts(selectedPreset.value);
    } else if (preset === 'custom') {
      setCustomPorts('');
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">🔒 Nalem</h1>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'network' && (
          <div className="network-scanner">
            <div className="scanner-header">
              <h2>🌐 Scanner Réseau</h2>
              
              {/* Status Nmap */}
              <div className="nmap-status">
                {nmapAvailable === null ? (
                  <span className="status-loading">🔄 Vérification de Nmap...</span>
                ) : nmapAvailable ? (
                  <span className="status-available">
                    ✅ Nmap disponible - {nmapVersion}
                  </span>
                ) : (
                  <span className="status-unavailable">
                    ❌ Nmap non disponible - Veuillez l'installer
                  </span>
                )}
              </div>
            </div>

            <div className="scanner-layout">
              {/* Sidebar - Tools Navigation */}
              <aside className="tools-sidebar">
                <div className="sidebar-header">
                  <h3>Outils</h3>
                </div>
                <div className="tools-list">
                  {networkTools.map(tool => (
                    <button
                      key={tool.id}
                      className={`tool-item ${activeNetworkTool === tool.id ? 'active' : ''} ${tool.status}`}
                      onClick={() => setActiveNetworkTool(tool.id)}
                    >
                      <span className="tool-icon">{tool.icon}</span>
                      <div className="tool-info">
                        <span className="tool-name">{tool.name}</span>
                        <span className="tool-description">{tool.description}</span>
                      </div>
                      {tool.status === 'development' && (
                        <span className="tool-status-badge">🚧</span>
                      )}
                    </button>
                  ))}
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="tool-content-area">
                {activeNetworkTool === 'nmap' && (
                  <div className="nmap-tool">
                    <div className="tool-header">
                      <h3>🔍 Nmap - Scanner de ports et services</h3>
                      <p>Découvrez les ports ouverts et les services sur vos cibles</p>
                    </div>

                    <div className="nmap-layout">
                      {/* Configuration Panel */}
                      <div className="config-panel">
                        <div className="config-section">
                          <h4>🎯 Configuration</h4>
                          <div className="config-controls">
                            <div className="input-group">
                              <label htmlFor="target">Cible :</label>
                              <input
                                id="target"
                                type="text"
                                value={target}
                                onChange={(e) => setTarget(e.currentTarget.value)}
                                placeholder="192.168.1.0/24 ou 192.168.1.1"
                                className="target-input"
                                disabled={!nmapAvailable}
                              />
                            </div>

                            <div className="input-group">
                              <label htmlFor="scanType">Type de scan :</label>
                              <select
                                id="scanType"
                                value={scanType}
                                onChange={(e) => setScanType(e.target.value)}
                                className="scan-type-select"
                                disabled={!nmapAvailable}
                              >
                                {nmapScanTypes.map(type => (
                                  <option key={type.id} value={type.id}>
                                    {type.name} - {type.description}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {scanType === 'custom' && (
                              <div className="input-group">
                                <label htmlFor="customPorts">Ports personnalisés :</label>
                                <div className="ports-input-container">
                                  <input
                                    id="customPorts"
                                    type="text"
                                    value={customPorts}
                                    onChange={(e) => setCustomPorts(e.currentTarget.value)}
                                    placeholder="80,443,8080 ou 1-1000"
                                    className="ports-input"
                                    disabled={!nmapAvailable}
                                  />
                                  <select
                                    className="port-preset-select"
                                    onChange={(e) => handlePortPresetChange(e.target.value)}
                                    disabled={!nmapAvailable}
                                  >
                                    {portPresets.map(preset => (
                                      <option key={preset.id} value={preset.id}>
                                        {preset.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}

                            <button
                              onClick={handleScan}
                              disabled={isScanning || !target.trim() || !nmapAvailable}
                              className="scan-button"
                            >
                              {isScanning ? '🔍 Scanning...' : '🚀 Lancer le scan'}
                            </button>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="config-section">
                          <h4>⚡ Actions Rapides</h4>
                          <div className="quick-actions">
                            <button
                              onClick={() => {
                                setTarget('127.0.0.1');
                                setScanType('quick');
                              }}
                              className="quick-action-btn"
                              disabled={!nmapAvailable}
                            >
                              🏠 Localhost
                            </button>
                            <button
                              onClick={() => {
                                setTarget('192.168.1.0/24');
                                setScanType('quick');
                              }}
                              className="quick-action-btn"
                              disabled={!nmapAvailable}
                            >
                              🏠 Réseau Local
                            </button>
                            <button
                              onClick={() => {
                                setTarget('10.0.0.0/24');
                                setScanType('quick');
                              }}
                              className="quick-action-btn"
                              disabled={!nmapAvailable}
                            >
                              🏠 Réseau 10.x
                            </button>
                          </div>
                        </div>

                        {/* Scan History */}
                        <div className="config-section">
                          <h4>📋 Historique</h4>
                          <div className="scan-history">
                            {scanResults.length === 0 ? (
                              <p className="no-history">Aucun scan effectué</p>
                            ) : (
                              <div className="history-list">
                                {scanResults.slice(0, 5).map(scan => (
                                  <div key={scan.id} className="history-item">
                                    <div className="history-info">
                                      <span className="history-target">{scan.target}</span>
                                      <span className={`history-status ${scan.status}`}>
                                        {scan.status === 'completed' ? '✅' : 
                                         scan.status === 'running' ? '🔄' : '❌'}
                                      </span>
                                    </div>
                                    <span className="history-time">
                                      {new Date(scan.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Results Panel */}
                      <div className="results-panel">
                        <div className="results-header">
                          <h4>📊 Résultats</h4>
                          <div className="results-controls">
                            <button className="clear-results-btn">
                              🗑️ Effacer
                            </button>
                            <button className="export-results-btn">
                              📤 Exporter
                            </button>
                          </div>
                        </div>
                        
                        <div className="results-content">
                          {scanResults.length === 0 ? (
                            <div className="no-results">
                              <div className="no-results-icon">🔍</div>
                              <h5>Aucun scan effectué</h5>
                              <p>Lancez un scan pour voir les résultats ici</p>
                            </div>
                          ) : (
                            <div className="results-list">
                              {scanResults.map(scan => (
                                <div key={scan.id} className={`result-item ${scan.status}`}>
                                  <div className="result-header">
                                    <div className="result-info">
                                      <span className="result-target">{scan.target}</span>
                                      <span className="result-tool">{scan.tool.toUpperCase()}</span>
                                    </div>
                                    <span className={`result-status ${scan.status}`}>
                                      {scan.status === 'running' ? '🔄 En cours' :
                                       scan.status === 'completed' ? '✅ Terminé' : '❌ Erreur'}
                                    </span>
                                  </div>
                                  <div className="result-details">
                                    <span className="result-type">{scan.scan_type}</span>
                                    <span className="result-time">
                                      {new Date(scan.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  {scan.result && (
                                    <div className="result-output">
                                      <div 
                                        dangerouslySetInnerHTML={{ 
                                          __html: colorizeNmapOutput(scan.result) 
                                        }} 
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeNetworkTool === 'masscan' && (
                  <div className="masscan-tool">
                    <div className="tool-header">
                      <h3>⚡ Masscan - Scan ultra-rapide</h3>
                      <p>Scanner de ports à très haute vitesse</p>
                    </div>
                    <div className="coming-soon-tool">
                      <span className="tool-status">🚧 En développement</span>
                      <p>Ce module sera bientôt disponible !</p>
                    </div>
                  </div>
                )}

                {activeNetworkTool === 'fingerprint' && (
                  <div className="fingerprint-tool">
                    <div className="tool-header">
                      <h3>👆 Fingerprinting - Identification des systèmes</h3>
                      <p>Détection des systèmes d'exploitation et services</p>
                    </div>
                    <div className="coming-soon-tool">
                      <span className="tool-status">🚧 En développement</span>
                      <p>Ce module sera bientôt disponible !</p>
                    </div>
                  </div>
                )}

                {activeNetworkTool === 'discovery' && (
                  <div className="discovery-tool">
                    <div className="tool-header">
                      <h3>🔎 Découverte - Découverte d'hôtes</h3>
                      <p>Découverte automatique d'hôtes sur le réseau</p>
                    </div>
                    <div className="coming-soon-tool">
                      <span className="tool-status">🚧 En développement</span>
                      <p>Ce module sera bientôt disponible !</p>
                    </div>
                  </div>
                )}
              </div>
            </div>


          </div>
        )}

        {activeTab !== 'network' && (
          <div className="coming-soon">
            <h2>🚧 Module en développement</h2>
            <p>Ce module sera bientôt disponible !</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
