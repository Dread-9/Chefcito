
export interface Reservation {
    table: string;
    user: string;
    active: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface Sale {
    _id: string;
    reservation: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}
