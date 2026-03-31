import React, { useState } from 'react';
import { migrateStoriesToFirestore, migrateSetupCardsToFirestore, migrateLocationsToFirestore } from '../migrate';
import { User } from 'firebase/auth';

interface DevMigrationToolsProps {
    user: User | null;
    onClose: () => void;
}

export const DevMigrationTools: React.FC<DevMigrationToolsProps> = ({ user, onClose }) => {
    const [isMigrating, setIsMigrating] = useState(false);
    const [migrationResult, setMigrationResult] = useState<{ success: number, error: number, total: number, type: string } | null>(null);

    const handleMigrateStories = async () => {
        if (!user) return;
        setIsMigrating(true);
        setMigrationResult(null);
        try {
            const result = await migrateStoriesToFirestore();
            setMigrationResult({ success: result.successCount, error: result.errorCount, total: result.total, type: 'Stories' });
        } catch (error) {
            console.error("Story migration failed:", error);
            setMigrationResult({ success: 0, error: 1, total: 1, type: 'Stories' });
        } finally {
            setIsMigrating(false);
        }
    };

    const handleMigrateSetup = async () => {
        if (!user) return;
        setIsMigrating(true);
        setMigrationResult(null);
        try {
            const result = await migrateSetupCardsToFirestore();
            setMigrationResult({ success: result.successCount, error: result.errorCount, total: result.total, type: 'Setup Cards' });
        } catch (error) {
            console.error("Setup migration failed:", error);
            setMigrationResult({ success: 0, error: 1, total: 1, type: 'Setup Cards' });
        } finally {
            setIsMigrating(false);
        }
    };

    const handleMigrateLocations = async () => {
        if (!user) return;
        setIsMigrating(true);
        setMigrationResult(null);
        try {
            const result = await migrateLocationsToFirestore();
            setMigrationResult({ success: result.successCount, error: result.errorCount, total: result.total, type: 'Locations' });
        } catch (error) {
            console.error("Location migration failed:", error);
            setMigrationResult({ success: 0, error: 1, total: 1, type: 'Locations' });
        } finally {
            setIsMigrating(false);
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-[9999] bg-gray-800/95 backdrop-blur-md text-white p-4 rounded-lg shadow-2xl w-80 border border-gray-600">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800/95 pb-2 z-10">
                <h3 className="font-bold text-lg">Migration Tools</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white p-2 -mr-2 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="space-y-4">
                <div className="bg-orange-900/30 border border-orange-500/50 p-3 rounded text-xs text-orange-200 mb-4">
                    <p className="font-bold mb-1">⚠️ Warning</p>
                    <p>Migration overwrites existing data in Firestore. Only use this if you have updated static data and want to re-sync.</p>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleMigrateStories}
                        disabled={isMigrating || !user}
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold py-2 rounded transition-all disabled:opacity-50"
                    >
                        {isMigrating ? 'Migrating...' : 'Migrate Stories'}
                    </button>
                    <button
                        onClick={handleMigrateSetup}
                        disabled={isMigrating || !user}
                        className="w-full bg-orange-700 hover:bg-orange-600 text-white text-sm font-bold py-2 rounded transition-all disabled:opacity-50"
                    >
                        {isMigrating ? 'Migrating...' : 'Migrate Setup Cards'}
                    </button>
                    <button
                        onClick={handleMigrateLocations}
                        disabled={isMigrating || !user}
                        className="w-full bg-orange-800 hover:bg-orange-700 text-white text-sm font-bold py-2 rounded transition-all disabled:opacity-50"
                    >
                        {isMigrating ? 'Migrating...' : 'Migrate Locations'}
                    </button>
                </div>

                {migrationResult && (
                    <div className="text-xs bg-gray-900 p-3 rounded border border-gray-700 font-mono mt-4">
                        <div className="flex justify-between text-gray-400 mb-2">
                            <span className="font-bold">{migrationResult.type} Result:</span>
                            <button onClick={() => setMigrationResult(null)} className="hover:text-white">✕</button>
                        </div>
                        <div className="flex justify-between text-lg">
                            <span className="text-green-400" title="Success">S: {migrationResult.success}</span>
                            <span className="text-red-400" title="Error">E: {migrationResult.error}</span>
                            <span className="text-blue-400" title="Total">T: {migrationResult.total}</span>
                        </div>
                    </div>
                )}

                {!user && (
                    <p className="text-[10px] text-red-400 text-center mt-2">Login required to perform migration.</p>
                )}

                <button
                    onClick={onClose}
                    className="w-full mt-4 bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold py-2 rounded transition-colors"
                >
                    Back to Dev Panel
                </button>
            </div>
        </div>
    );
};
