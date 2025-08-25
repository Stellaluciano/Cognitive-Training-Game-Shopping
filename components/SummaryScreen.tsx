
import React from 'react';
import { GameSession } from '../types';

interface SummaryScreenProps {
    session: GameSession;
    onPlayAgain: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ session, onPlayAgain }) => {
    const { shoppingList, basket, startTime, endTime, hintsUsed } = session;

    const correctItems = basket.filter(item => shoppingList.some(i => i.name === item.name)).length;
    const accuracy = shoppingList.length > 0 ? (correctItems / shoppingList.length) * 100 : 0;
    const timeTakenSeconds = Math.round((endTime - startTime) / 1000);
    const timeTakenMinutes = Math.floor(timeTakenSeconds / 60);
    const remainingSeconds = timeTakenSeconds % 60;
    
    const encouragement = accuracy >= 80 ? "Excellent work! Your memory is sharp!" :
                           accuracy >= 50 ? "Great effort! Keep practicing!" :
                           "Good try! Every attempt helps your brain.";

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in w-full max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-brand-primary mb-4">Trip Complete!</h1>
            <p className="text-xl text-gray-600 mb-8">{encouragement}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
                <div className="bg-brand-light p-4 rounded-lg">
                    <p className="text-lg font-bold text-gray-700">Time Taken</p>
                    <p className="text-3xl font-black text-brand-primary">{`${timeTakenMinutes}m ${remainingSeconds}s`}</p>
                </div>
                <div className="bg-brand-light p-4 rounded-lg">
                    <p className="text-lg font-bold text-gray-700">Accuracy</p>
                    <p className="text-3xl font-black text-brand-primary">{`${Math.round(accuracy)}%`}</p>
                    <p className="text-sm text-gray-500">({correctItems}/{shoppingList.length} items)</p>
                </div>
                <div className="bg-brand-light p-4 rounded-lg">
                    <p className="text-lg font-bold text-gray-700">Hints Used</p>
                    <p className="text-3xl font-black text-brand-primary">{hintsUsed}</p>
                </div>
            </div>

            <button
                onClick={onPlayAgain}
                className="w-full max-w-sm mx-auto mt-6 bg-brand-primary text-white font-bold py-4 px-4 rounded-lg text-xl hover:bg-brand-primary-dark transition-colors"
            >
                Play Again
            </button>
        </div>
    );
};

export default SummaryScreen;
