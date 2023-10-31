const BASE_URL = 'https://chefcito-back-production.up.railway.app'
export const url = {
    urlSesion: {
        sesion: {
            login: `${BASE_URL}/login`,
            signup: `${BASE_URL}/signup`,
        },
    },
    urlFood: {
        foods: {
            food: `${BASE_URL}/food`,
            typefood: `${BASE_URL}/type/food`,
        }
    },
    urlReservation: {
        reservations: {
            reservation: `${BASE_URL}/reservation`,
        }
    },
    urlOrder: {
        orders: {
            order: `${BASE_URL}/order`,
            typeorder: `${BASE_URL}/type/order`,
        }
    },
};