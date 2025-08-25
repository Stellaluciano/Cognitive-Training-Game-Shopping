
import React, { useState, useEffect } from 'react';
import { GameSession, ShoppingItem } from '../types';
import LightbulbIcon from './icons/LightbulbIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

interface ShoppingScreenProps {
    session: GameSession;
    onComplete: (basket: ShoppingItem[], hintsUsed: number) => void;
}

const ItemCard: React.FC<{ item: ShoppingItem; onSelect: () => void; isSelected: boolean }> = ({ item, onSelect, isSelected }) => (
    <button
        onClick={onSelect}
        className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md transition-all duration-200 aspect-square
            ${isSelected ? 'bg-brand-success text-white ring-4 ring-green-300' : 'bg-white hover:bg-brand-light'}`}
    >
        <span className="text-5xl">{item.emoji}</span>
        <span className="text-center font-bold mt-2 text-sm">{item.name}</span>
    </button>
);

const ShoppingScreen: React.FC<ShoppingScreenProps> = ({ session, onComplete }) => {
    const [basket, setBasket] = useState<ShoppingItem[]>(session.basket);
    const [hintsUsed, setHintsUsed] = useState(session.hintsUsed);
    const [showHint, setShowHint] = useState(false);
    const [hintCooldown, setHintCooldown] = useState(false);

    const toggleItemInBasket = (item: ShoppingItem) => {
        setBasket(prev =>
            prev.some(i => i.name === item.name)
                ? prev.filter(i => i.name !== item.name)
                : [...prev, item]
        );
    };
    
    const handleUseHint = () => {
        if (!session.settings.hintsEnabled || hintCooldown) return;
        
        setShowHint(true);
        setHintsUsed(prev => prev + 1);
        setHintCooldown(true);
        
        setTimeout(() => setShowHint(false), 5000); // Show hint for 5 seconds
        setTimeout(() => setHintCooldown(false), 10000); // Cooldown for 10 seconds
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in w-full">
            <h1 className="text-3xl font-bold text-center text-brand-primary mb-6">Find the items on your list!</h1>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 mb-6">
                {session.storeItems.map(item => (
                    <ItemCard
                        key={item.name}
                        item={item}
                        isSelected={basket.some(i => i.name === item.name)}
                        onSelect={() => toggleItemInBasket(item)}
                    />
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-brand-primary-dark p-4 shadow-2xl text-white">
                <div className="container mx-auto max-w-4xl flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                         <ShoppingCartIcon />
                        <span className="font-bold text-xl">Basket: {basket.length} item(s)</span>
                    </div>
                     <div className="flex items-center space-x-4">
                        {session.settings.hintsEnabled && (
                            <button onClick={handleUseHint} disabled={hintCooldown} className="flex items-center space-x-2 bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                                <LightbulbIcon />
                                <span>{hintCooldown ? 'Wait...' : 'Hint'}</span>
                            </button>
                        )}
                        <button onClick={() => onComplete(basket, hintsUsed)} className="bg-brand-success text-white font-bold py-2 px-6 rounded-lg text-lg hover:bg-green-600 transition-colors">
                            Done
                        </button>
                    </div>
                </div>
            </div>

            {showHint && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold text-brand-primary mb-4 text-center">Shopping List</h2>
                        <ul className="space-y-2">
                             {session.shoppingList.map(item => (
                                <li key={item.name} className="flex items-center text-lg p-2 bg-brand-light rounded-md">
                                    <span className="text-2xl mr-3">{item.emoji}</span>
                                    <span>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                         <p className="text-center mt-4 text-gray-500 text-sm">This will disappear in a few seconds...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingScreen;
