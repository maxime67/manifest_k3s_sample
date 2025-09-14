import React, { useState, useEffect } from 'react';

// Composant ultra-simple pour afficher un chart depuis GitHub
const GitHubChart = ({ repo, path, files }) => {
    const [chartFiles, setChartFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeFile, setActiveFile] = useState(0);

    useEffect(() => {
        fetchChartFiles();
    }, [repo, path]);

    const fetchChartFiles = async () => {
        setLoading(true);
        const fileContents = {};

        try {
            // Fetch tous les fichiers en parallèle
            const promises = files.map(async (file) => {
                const url = `https://raw.githubusercontent.com/maxime67/manifest_k3s_sample/refs/heads/master/${path}/${file}`;
                const response = await fetch(url);
                if (response.ok) {
                    const content = await response.text();
                    return { file, content };
                }
                return { file, content: `# Erreur: Fichier ${file} non trouvé` };
            });

            const results = await Promise.all(promises);
            results.forEach(({ file, content }) => {
                fileContents[file] = content;
            });

            setChartFiles(fileContents);
        } catch (error) {
            console.error('Erreur fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (loading) {
        return (
            <div className="border rounded-lg p-6 bg-gray-50">
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Chargement depuis GitHub...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden my-4">
            {/* Header simple */}
            <div className="bg-blue-50 px-4 py-3 border-b">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-blue-900">
                        📦 {path.split('/').pop()}
                    </h3>
                    <a
                        href={`https://github.com/${repo}/tree/main/${path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                    >
                        🔗 GitHub
                    </a>
                </div>
            </div>

            {/* Onglets fichiers */}
            <div className="flex bg-gray-50 border-b overflow-x-auto">
                {files.map((file, index) => (
                    <button
                        key={file}
                        onClick={() => setActiveFile(index)}
                        className={`px-4 py-2 text-sm whitespace-nowrap ${
                            activeFile === index
                                ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        {file}
                    </button>
                ))}
            </div>

            {/* Contenu du fichier */}
            <div className="bg-white">
                <div className="flex justify-between items-center px-4 py-2 bg-gray-50 text-sm">
                    <span className="font-mono">{files[activeFile]}</span>
                    <button
                        onClick={() => copyToClipboard(chartFiles[files[activeFile]] || '')}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                    >
                        📋 Copier
                    </button>
                </div>

                <pre className="p-4 overflow-x-auto text-sm bg-gray-50">
          <code>{chartFiles[files[activeFile]] || 'Chargement...'}</code>
        </pre>
            </div>

            {/* Footer avec commande install */}
            <div className="bg-gray-100 px-4 py-2 text-sm">
                <span className="text-gray-600">💡 Installation: </span>
                <code className="bg-gray-200 px-2 py-1 rounded">
                    helm install my-release ./{path}
                </code>
            </div>
        </div>
    );
};

// Utilisation dans tes docs MDX - ULTRA SIMPLE avec styling
const App = () => {
    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">📦 Mes Charts Helm</h1>
                <p className="text-gray-600 text-lg">Documentation automatiquement synchronisée depuis GitHub</p>
            </div>

            {/* Chart Symfony-MySQL */}
            <GitHubChart
                repo="maxime67/manifest_k3s_sample"
                path="05-Chart/symfony-mysql"
                chartName="Symfony-MySQL"
                description="Chart Helm pour déployer une application Symfony avec base de données MySQL"
                files={[
                    'Chart.yaml',
                    'values.yaml',
                    'templates/deployment.yaml',
                    'templates/service.yaml',
                    'templates/secret.yaml',
                    'templates/mysql-deployment.yaml'
                ]}
            />

            {/* Chart Monitoring */}
            <GitHubChart
                repo="maxime67/manifest_k3s_sample"
                path="04-Monitoring"
                chartName="Monitoring Stack"
                description="Stack Prometheus + Grafana pour monitoring Kubernetes"
                files={[
                    'prometheus-grafana.yml',
                    'README.md'
                ]}
            />

            {/* Chart PostgreSQL */}
            <GitHubChart
                repo="maxime67/manifest_k3s_sample"
                path="01-basics/postgresql_memory"
                chartName="PostgreSQL Memory"
                description="Base de données PostgreSQL en mémoire pour développement"
                files={[
                    'Chart.yaml',
                    'values.yaml',
                    'templates/deployment.yaml',
                    'templates/service.yaml'
                ]}
            />
        </div>
    );
};

export default App;