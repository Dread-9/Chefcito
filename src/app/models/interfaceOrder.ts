export interface Order {
    _id: string;
    food: {
        _id: string;
        name: string;
        desc: string;
        price: number;
        img: string;
        type: string;
        createdAt: string;
        updatedAt: string;
    };
    sale: string;
    status: string;
    desc: string;
}
export interface OrderStatus {
    _id: string;
    name: string;
}