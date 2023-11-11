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
            measurement: `${BASE_URL}/type/measurement`,
            ingredientes: `${BASE_URL}/ingredient/stock`,//pendiente
        }
    },
    urlReservation: {
        reservations: {
            reservation: `${BASE_URL}/reservation`,
            table: `${BASE_URL}/table`,
            cancelar: `${BASE_URL}/sale/pay`,
        }
    },
    urlOrder: {
        orders: {
            order: `${BASE_URL}/order`,//pendiente
            typeorder: `${BASE_URL}/type/order`,//pendiente
            pay: `${BASE_URL}/sale/pay`,//pendiente
        }
    },
};