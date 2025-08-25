
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, GameSettings, ShoppingItem, GameSession } from './types';
import { generateShoppingScenario } from './services/geminiService';
import { ALL_GROCERY_ITEMS } from './constants';
import HomeScreen from './components/HomeScreen';
import MemorizationScreen from './components/MemorizationScreen';
import ShoppingScreen from './components/ShoppingScreen';
import CheckoutScreen from './components/CheckoutScreen';
import SummaryScreen from './components/SummaryScreen';
import { shuffleArray } from './utils';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.HOME);
    const [settings, setSettings] = useState<GameSettings>({
        listLength: 4,
        memorizationTime: 45,
        timerEnabled: true,
        hintsEnabled: true,
    });
    const [gameSession, setGameSession] = useState<GameSession | null>(null);
    const [gameHistory, setGameHistory] = useState<GameSession[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('shoppingGameHistory');
            if (savedHistory) {
                setGameHistory(JSON.parse(savedHistory));
            }
        } catch (e) {
            console.error("Failed to load game history:", e);
        }
    }, []);

    const updateHistory = (session: GameSession) => {
        const newHistory = [session, ...gameHistory].slice(0, 10); // Keep last 10 sessions
        setGameHistory(newHistory);
        try {
            localStorage.setItem('shoppingGameHistory', JSON.stringify(newHistory));
        } catch (e) {
            console.error("Failed to save game history:", e);
        }
    };

    const handleStartGame = useCallback(async (newSettings: GameSettings) => {
        setSettings(newSettings);
        setGameState(GameState.GENERATING);
        setError(null);
        try {
            const scenario = await generateShoppingScenario(newSettings.listLength);
            
            const shoppingListItems: ShoppingItem[] = scenario.shoppingList.map(name => {
                return ALL_GROCERY_ITEMS.find(item => item.name.toLowerCase() === name.toLowerCase()) || { name, emoji: '🛒' };
            }).filter(Boolean);

            const distractorItems: ShoppingItem[] = scenario.distractors.map(name => {
                return ALL_GROCERY_ITEMS.find(item => item.name.toLowerCase() === name.toLowerCase()) || { name, emoji: '🛒' };
            }).filter(Boolean);

            if (shoppingListItems.length < newSettings.listLength) {
                 throw new Error("Could not generate a full shopping list. Please try again.");
            }

            setGameSession({
                id: Date.now(),
                settings: newSettings,
                scenario: scenario.scenario,
                shoppingList: shoppingListItems,
                distractors: distractorItems,
                storeItems: shuffleArray([...shoppingListItems, ...distractorItems]),
                basket: [],
                startTime: 0,
                endTime: 0,
                hintsUsed: 0,
            });
            setGameState(GameState.MEMORIZING);
        } catch (err) {
            console.error(err);
            setError('Failed to create a new shopping trip. Please check your connection or API key and try again.');
            setGameState(GameState.HOME);
        }
    }, []);

    const handleMemorizationComplete = useCallback(() => {
        setGameSession(prev => prev ? { ...prev, startTime: Date.now() } : prev);
        setGameState(GameState.SHOPPING);
    }, []);

    const handleShoppingComplete = useCallback((basket: ShoppingItem[], hintsUsed: number) => {
        setGameSession(prev => prev ? { ...prev, basket, hintsUsed } : prev);
        setGameState(GameState.CHECKOUT);
    }, []);

    const handleCheckoutComplete = useCallback(() => {
        const sessionWithEndTime = { ...gameSession!, endTime: Date.now() };
        setGameSession(sessionWithEndTime);
        updateHistory(sessionWithEndTime);
        setGameState(GameState.SUMMARY);
    }, [gameSession]);
    
    const handleReturnToShopping = useCallback(() => {
        setGameState(GameState.SHOPPING);
    }, []);

    const handlePlayAgain = useCallback(() => {
        setGameSession(null);
        setGameState(GameState.HOME);
    }, []);

    const renderScreen = () => {
        switch (gameState) {
            case GameState.HOME:
            case GameState.GENERATING:
                return <HomeScreen onStartGame={handleStartGame} initialSettings={settings} history={gameHistory} isLoading={gameState === GameState.GENERATING} error={error} />;
            case GameState.MEMORIZING:
                return gameSession && <MemorizationScreen session={gameSession} onComplete={handleMemorizationComplete} />;
            case GameState.SHOPPING:
                return gameSession && <ShoppingScreen session={gameSession} onComplete={handleShoppingComplete} />;
            case GameState.CHECKOUT:
                return gameSession && <CheckoutScreen session={gameSession} onConfirm={handleCheckoutComplete} onGoBack={handleReturnToShopping} />;
            case GameState.SUMMARY:
                return gameSession && <SummaryScreen session={gameSession} onPlayAgain={handlePlayAgain} />;
            default:
                return <HomeScreen onStartGame={handleStartGame} initialSettings={settings} history={gameHistory} isLoading={false} error={null} />;
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-4xl mx-auto">
                {renderScreen()}
            </div>
        </div>
    );
};

export default App;
