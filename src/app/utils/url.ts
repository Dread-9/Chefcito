const BASE_URL = 'https://chefcito-back-production.up.railway.app'
export const url = {
    urlSesion: {
        sesion: {
            login: `${BASE_URL}/login`,
            signup: `${BASE_URL}/signup`,
            verify: `${BASE_URL}/verify`,
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
    urlCard: {
        card: {
            createCard: `${BASE_URL}/card`,
            deleteCard: `${BASE_URL}/card`,
            getCard: `${BASE_URL}/card`,
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
            order: `${BASE_URL}/order`,
            orderbysale: `${BASE_URL}/order/sale`,
            typeorder: `${BASE_URL}/type/order`,
            pay: `${BASE_URL}/sale/pay`,
        }
    },
};