import React, { useState, useEffect } from 'react';

// Composant GitHubChart - Style Minimaliste
const GitHubChart = ({ repo, path, files }) => {
    const [chartFiles, setChartFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeFile, setActiveFile] = useState(0);

    useEffect(() => {
        fetchChartFiles();
    }, [repo, path, files]);

    const fetchChartFiles = async () => {
        setLoading(true);
        const fileContents = {};

        try {
            const promises = files.map(async (file) => {
                const url = `https://raw.githubusercontent.com/${repo}/refs/heads/documentation/${path}/${file}`;
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

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Erreur de copie:', err);
        }
    };

    if (loading) {
        return (
            <div className="my-8">
                <div className="flex items-center justify-center py-12 text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 mr-3"></div>
                    <span className="text-sm font-medium">Chargement depuis GitHub...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="my-8 bg-white rounded-lg overflow-hidden">
            {/* Onglets - Style navigateur */}
            <div className="bg-blue-50 px-4 pt-2">
                <div className="flex space-x-1 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {files.map((file, index) => (
                        <button
                            key={file}
                            onClick={() => setActiveFile(index)}
                            className={`relative px-4 py-2.5 text-sm border-0 font-medium rounded-t-lg ${
                                activeFile === index
                                    ? 'bg-white text-gray-900 z-10 -mb-px'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800'
                            }`}
                            style={activeFile === index ? { borderBottom: '1px solid white' } : {}}
                        >
                            {file}
                        </button>
                    ))}
                </div>
                <div className="bg-blue-50"></div>
            </div>

            {/* Barre d'actions */}
            <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                <div className="flex justify-start">
                    <button
                        onClick={() => copyToClipboard(chartFiles[files[activeFile]] || '')}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copier
                    </button>
                </div>
            </div>

            {/* Contenu du code */}
            <div className="relative">
                <pre className="p-6 overflow-x-auto text-sm leading-relaxed bg-gray-900 text-gray-100 font-mono">
                    <code>{chartFiles[files[activeFile]] || 'Chargement...'}</code>
                </pre>
            </div>
        </div>
    );
};

export default GitHubChart;