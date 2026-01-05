import React, { useState, useMemo } from 'react';
import { generateTestingMatrixCsv } from '../utils/testing';

interface DevTestingMatrixProps {
    onClose: () => void;
}

export const DevTestingMatrix: React.FC<DevTestingMatrixProps> = ({ onClose }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

    const csvData = useMemo(() => generateTestingMatrixCsv(), []);

    const handleCopy = () => {
        navigator.clipboard.writeText(csvData).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        }).catch(err => {
            console.error('Failed to copy matrix: ', err);
            setCopyButtonText('Error!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-gray-600">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Setup/Story Compatibility Matrix</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                    This CSV lists every possible combination of Setup and Story cards. The 'Compatibility' column shows if the combination is valid (1) or not (0). Two empty columns, 'Test Status' and 'Notes', are included for you to track your testing progress.
                </p>
                <textarea
                    readOnly
                    value={csvData}
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