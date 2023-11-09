export interface FoodType {
    _id: string;
    name: string;
    color: string;
    sheduleStart: number;
    sheduleEnd: number;
}

export interface Food {
    _id: string;
    name: string;
    desc: string;
    price: number;
    img: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    cantidad: number;
}
export interface FoodDetails {
    food: Food;
    recipe: {
        _id: string;
        food: string;
        ingredient: {
            _id: string;
            name: string;
            desc: string;
            stock: number;
            stockFlag: number;
            unit: string;
            createdAt: string;
            updatedAt: string;
        };
        process: {
            _id: string;
            name: string;
        };
        amount: number;
    }[];
}
export interface Unit {
    _id: string;
    name: string;
}




