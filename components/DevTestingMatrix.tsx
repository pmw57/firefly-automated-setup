import React, { useState, useMemo } from 'react';
import { generateTestingMatrixCsv, generateCoverageReport } from '../utils/testing';

interface DevTestingMatrixProps {
    onClose: () => void;
}

export const DevTestingMatrix: React.FC<DevTestingMatrixProps> = ({ onClose }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');
    const [excludeNoSetupDescription, setExcludeNoSetupDescription] = useState(false);
    const [mode, setMode] = useState<'matrix' | 'coverage'>('matrix');

    const content = useMemo(() => {
        if (mode === 'coverage') {
            return generateCoverageReport();
        }
        return generateTestingMatrixCsv({ excludeNoSetupDescription });
    }, [excludeNoSetupDescription, mode]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            setCopyButtonText('Error!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-gray-600">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Testing Tools</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                
                <div className="flex gap-2 mb-4 border-b border-gray-700 pb-4">
                    <button 
                        onClick={() => setMode('matrix')}
                        className={`px-4 py-2 rounded text-sm font-bold ${mode === 'matrix' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        CSV Matrix
                    </button>
                    <button 
                        onClick={() => setMode('coverage')}
                        className={`px-4 py-2 rounded text-sm font-bold ${mode === 'coverage' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        Minimal Coverage Report
                    </button>
                </div>

                {mode === 'matrix' && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">
                            Generates a CSV spreadsheet of <strong className="text-green-400">every compatible</strong> combination of Setup and Story cards.
                        </p>
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={excludeNoSetupDescription}
                                onChange={(e) => setExcludeNoSetupDescription(e.target.checked)}
                                className="w-4 h-4 rounded bg-gray-700 border-gray-500 text-blue-500 focus:ring-blue-600"
                            />
                            Exclude story cards that have no setup description
                        </label>
                    </div>
                )}
                
                {mode === 'coverage' && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-400">
                            Generates a text report grouping stories by the <strong className="text-green-400">minimum number of configurations</strong> required to view them all without repeats.
                        </p>
                    </div>
                )}

                <textarea
                    readOnly
                    value={content}
                    className="w-full flex-1 bg-black p-4 rounded text-xs font-mono border border-gray-600 custom-scrollbar whitespace-pre"
                />
                <div className="mt-4 flex justify-end gap-4">
                    <button
                        onClick={handleCopy}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    >
                        {copyButtonText}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
