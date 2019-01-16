import { ToastAndroid } from 'react-native'
import { PLACE_ORDER } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken, authLogout } from './index';

export const placeOrder = (basketId, cardHolderName, cardNumber, cvc, expireMonth, expireYear, registerCard) => {
    return dispatch => {
        dispatch(uiStartLoading());

        dispatch(authGetToken())
            .catch(() => {
                alert('no token');
            })
            .then(token => {
                const orderData = {
                    basketId: basketId,
                    cardHolderName: cardHolderName,
                    cardNumber: cardNumber,
                    cvc: cvc,
                    expireMonth: expireMonth,
                    expireYear: expireYear,
                    registerCard: registerCard
                };

                return fetch("https://bimo-backend.herokuapp.com/api/mobile/order", {
                    method: "POST",
                    body: JSON.stringify(orderData),
                    headers: {
                        "X-Auth-Token": token,
                        "Content-Type": "application/json"
                    }
                })
            })

            .then(res => res.json())
            .then(parsedRes => {
                if (parsedRes.status == 401) {
                    dispatch(authLogout());
                    return;
                } else if (parsedRes.status == 404) {
                    alert('Not found');
                    return;
                }
                dispatch(placeOrderAction(parsedRes));
            })
            .catch(err => {
                alert(err);
                //console.log(err);
            });
    };
};


export const placeOrderAction = order => {
    return {
        type: PLACE_ORDER,
        order: order
    }
}