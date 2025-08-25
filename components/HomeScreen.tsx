
import React, { useState } from 'react';
import { GameSettings, GameSession } from '../types';

interface HomeScreenProps {
    onStartGame: (settings: GameSettings) => void;
    initialSettings: GameSettings;
    history: GameSession[];
    isLoading: boolean;
    error: string | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, initialSettings, history, isLoading, error }) => {
    const [settings, setSettings] = useState<GameSettings>(initialSettings);

    const handleStart = () => {
        onStartGame(settings);
    };

    const calculateAccuracy = (session: GameSession) => {
        const correctItems = session.basket.filter(item => session.shoppingList.some(i => i.name === item.name));
        const accuracy = (correctItems.length / session.shoppingList.length) * 100;
        return Math.round(accuracy);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in text-brand-text">
            <header className="text-center mb-8">
                <h1 className="text-5xl font-bold text-brand-primary">Cognitive Shopping Game</h1>
                <p className="text-lg mt-2 text-gray-600">A fun way to exercise your memory!</p>
            </header>

            {error && (
                <div className="bg-red-100 border-l-4 border-brand-accent text-red-700 p-4 mb-6 rounded-lg" role="alert">
                    <p className="font-bold">Oops!</p>
                    <p>{error}</p>
                </div>
            )}

            <main className="grid md:grid-cols-2 gap-8">
                <section className="bg-brand-light p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-brand-primary-dark">New Shopping Trip</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="listLength" className="block text-md font-bold text-gray-700 mb-2">Shopping List Size: <span className="text-brand-primary font-black">{settings.listLength} items</span></label>
                            <input
                                id="listLength"
                                type="range"
                                min="3"
                                max="10"
                                value={settings.listLength}
                                onChange={(e) => setSettings({ ...settings, listLength: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                            />
                        </div>

                        <div>
                            <label htmlFor="memorizationTime" className="block text-md font-bold text-gray-700 mb-2">Memorization Time: <span className="text-brand-primary font-black">{settings.memorizationTime} seconds</span></label>
                            <input
                                id="memorizationTime"
                                type="range"
                                min="30"
                                max="90"
                                step="5"
                                value={settings.memorizationTime}
                                disabled={!settings.timerEnabled}
                                onChange={(e) => setSettings({ ...settings, memorizationTime: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-secondary disabled:opacity-50"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-md font-bold text-gray-700">Enable Timer</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={settings.timerEnabled} onChange={() => setSettings(s => ({...s, timerEnabled: !s.timerEnabled}))} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                             <span className="text-md font-bold text-gray-700">Enable Hints</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={settings.hintsEnabled} onChange={() => setSettings(s => ({...s, hintsEnabled: !s.hintsEnabled}))} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        disabled={isLoading}
                        className="w-full mt-8 bg-brand-primary text-white font-bold py-4 px-4 rounded-lg text-xl hover:bg-brand-primary-dark transition-colors duration-300 disabled:bg-gray-400 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Trip...
                            </>
                        ) : 'Start Shopping!'}
                    </button>
                </section>

                <section className="bg-brand-light p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-brand-primary-dark">Recent Trips</h2>
                    {history.length > 0 ? (
                        <ul className="space-y-3">
                            {history.map(session => (
                                <li key={session.id} className="bg-white p-3 rounded-md shadow-sm">
                                    <p className="font-bold">{new Date(session.id).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600">
                                        {session.shoppingList.length} items - {calculateAccuracy(session)}% accuracy
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 mt-10">No recent trips. Time to go shopping!</p>
                    )}
                </section>
            </main>
        </div>
    );
};

export default HomeScreen;
