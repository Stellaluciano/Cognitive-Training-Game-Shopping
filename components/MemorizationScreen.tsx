
import React, { useState, useEffect, useCallback } from 'react';
import { GameSession } from '../types';

interface MemorizationScreenProps {
    session: GameSession;
    onComplete: () => void;
}

const MemorizationScreen: React.FC<MemorizationScreenProps> = ({ session, onComplete }) => {
    const { settings, shoppingList, scenario } = session;
    const [timeLeft, setTimeLeft] = useState(settings.memorizationTime);

    const handleComplete = useCallback(() => {
        onComplete();
    }, [onComplete]);

    useEffect(() => {
        if (!settings.timerEnabled) return;
        
        if (timeLeft <= 0) {
            handleComplete();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, settings.timerEnabled, handleComplete]);
    
    const progressPercentage = (timeLeft / settings.memorizationTime) * 100;

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in w-full max-w-lg mx-auto text-brand-text">
            <h1 className="text-3xl font-bold text-center text-brand-primary mb-4">Time to Go Shopping!</h1>
            <p className="text-lg text-center text-gray-600 mb-6">{scenario}</p>
            
            <div className="bg-brand-light p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Your Shopping List</h2>
                <ul className="space-y-3">
                    {shoppingList.map(item => (
                        <li key={item.name} className="flex items-center bg-white p-3 rounded-lg shadow-sm text-xl">
                            <span className="text-3xl mr-4">{item.emoji}</span>
                            <span className="font-bold">{item.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            {settings.timerEnabled && (
                <div className="mt-6">
                    <p className="text-center text-lg font-bold">Time remaining: {timeLeft}s</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div className="bg-brand-secondary h-4 rounded-full transition-all duration-1000 linear" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>
            )}
            
            <button
                onClick={handleComplete}
                className="w-full mt-8 bg-brand-primary text-white font-bold py-4 px-4 rounded-lg text-xl hover:bg-brand-primary-dark transition-colors duration-300"
            >
                I'm Ready to Shop!
            </button>
        </div>
    );
};

export default MemorizationScreen;
