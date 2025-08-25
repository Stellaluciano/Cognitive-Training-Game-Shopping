
import React from 'react';
import { GameSession, ShoppingItem } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';

interface CheckoutScreenProps {
    session: GameSession;
    onConfirm: () => void;
    onGoBack: () => void;
}

const CheckoutListItem: React.FC<{ item: ShoppingItem, found: boolean }> = ({ item, found }) => (
    <li className={`flex items-center justify-between p-3 rounded-lg ${found ? 'bg-green-100' : 'bg-red-100'}`}>
        <div className="flex items-center">
            <span className="text-3xl mr-4">{item.emoji}</span>
            <span className={`font-bold ${found ? 'text-green-800' : 'text-red-800'}`}>{item.name}</span>
        </div>
        {found ? <CheckIcon className="text-green-600" /> : <XIcon className="text-red-600" />}
    </li>
);

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ session, onConfirm, onGoBack }) => {
    const { shoppingList, basket } = session;

    const itemsInBasketButNotOnList = basket.filter(basketItem => !shoppingList.some(listItem => listItem.name === basketItem.name));

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in w-full max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-brand-primary mb-6">Checkout</h1>
            <p className="text-center text-lg mb-6">Let's see how you did. Here's a comparison of your list and what's in your basket.</p>

            <div className="grid md:grid-cols-1 gap-6">
                <div>
                    <h2 className="text-xl font-bold mb-3 text-brand-primary-dark">Your Shopping List</h2>
                    <ul className="space-y-2">
                        {shoppingList.map(item => (
                            <CheckoutListItem key={item.name} item={item} found={basket.some(b => b.name === item.name)} />
                        ))}
                    </ul>
                </div>

                {itemsInBasketButNotOnList.length > 0 && (
                     <div>
                        <h2 className="text-xl font-bold mb-3 text-brand-accent">Extra Items in Basket</h2>
                        <ul className="space-y-2">
                            {itemsInBasketButNotOnList.map(item => (
                                <li key={item.name} className="flex items-center p-3 rounded-lg bg-yellow-100 text-yellow-800">
                                    <span className="text-3xl mr-4">{item.emoji}</span>
                                    <span className="font-bold">{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={onGoBack}
                    className="flex-1 bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-yellow-600 transition-colors"
                >
                    Go Back & Correct
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 bg-brand-success text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-600 transition-colors"
                >
                    Finish Shopping
                </button>
            </div>
        </div>
    );
};

export default CheckoutScreen;
