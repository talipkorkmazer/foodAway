import { ToastAndroid } from 'react-native'
import { GET_ORDERS } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken, authLogout } from './index';

export const getOrders = () => {
    return dispatch => {
        dispatch(uiStartLoading());

        dispatch(authGetToken())
            .catch(() => {
                alert('no token');
            })
            .then(token => {
                return fetch("https://bimo-backend.herokuapp.com/api/mobile/order", {
                    method: "GET",
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
                    const orders = false;
                    dispatch(getOrdersAction(orders));
                    return;
                } else if (parsedRes.status == 500) {
                    alert("Lütfen tekrar deneyiniz.");
                    return;
                }
                dispatch(getOrdersAction(parsedRes));
            })
            .catch(err => {
                alert(err);
                //console.log(err);
            });
    };
};


export const getOrdersAction = orders => {
    return {
        type: GET_ORDERS,
        orders: orders
    }
}