export interface FoodType {
    _id: string;
    name: string;
    color: string;
    sheduleStart: number;
    sheduleEnd: number;
}
export interface Food {
    id: string;
    name: string;
    desc: string;
    price: number;
    img: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}