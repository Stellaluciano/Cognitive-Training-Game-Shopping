
export enum GameState {
    HOME = 'HOME',
    GENERATING = 'GENERATING',
    MEMORIZING = 'MEMORIZING',
    SHOPPING = 'SHOPPING',
    CHECKOUT = 'CHECKOUT',
    SUMMARY = 'SUMMARY',
}

export interface GameSettings {
    listLength: number;
    memorizationTime: number; // in seconds
    timerEnabled: boolean;
    hintsEnabled: boolean;
}

export interface ShoppingItem {
    name: string;
    emoji: string;
}

export interface GameSession {
    id: number;
    settings: GameSettings;
    scenario: string;
    shoppingList: ShoppingItem[];
    distractors: ShoppingItem[];
    storeItems: ShoppingItem[];
    basket: ShoppingItem[];
    startTime: number; // timestamp
    endTime: number; // timestamp
    hintsUsed: number;
}
