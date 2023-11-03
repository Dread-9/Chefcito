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
}
export interface FoodDetails {
    food: Food;
    recipe: any[];
}




