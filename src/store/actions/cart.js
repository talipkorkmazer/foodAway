import { ToastAndroid } from 'react-native'
import { ADD_TO_CART, GET_CART, REMOVE_FROM_CART, REMOVE_CART, SET_PRODUCT_TO_CART } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken, authLogout } from './index';

export const getCart = () => {
    return dispatch => {
        dispatch(authGetToken())
            .then(token => {
                //alert(token)
                return fetch("https://bimo-backend.herokuapp.com/api/mobile/basket/all", {
                    method: "GET",
                    headers: {
                        "X-Auth-Token": token,
                        "Content-Type": "application/json"
                    }
                })

            })
            .catch(() => {
                alert('no token');
            })
            .then(res => res.json())
            .then(parsedRes => {
                //alert(JSON.stringify(parsedRes));
                if (parsedRes.status == 401) {
                    dispatch(authLogout());
                    return;
                } else if (parsedRes.status == 404) {
                    const cart = false;
                    dispatch(setCart(cart));
                    return;
                }
                dispatch(setCart(parsedRes));
            })
            .catch(err => {
                alert(err);
                //console.log(err);
            });
    };
};

export const setCart = cart => {
    return {
        type: GET_CART,
        cart: cart
    }
}


export const addToCart = (branchId, productId, qty, campaignId) => {
    return dispatch => {
        dispatch(uiStartLoading());

        dispatch(authGetToken())
            .catch(() => {
                alert('no token');
            })
            .then(token => {
                const productData = {
                    branchId: branchId,
                    campaignId: campaignId,
                    productId: productId,
                    quantity: qty
                };
                return fetch("https://bimo-backend.herokuapp.com/api/mobile/basket/add-product", {
                    method: "POST",
                    body: JSON.stringify(productData),
                    headers: {
                        "X-Auth-Token": token,
                        "Content-Type": "application/json"
                    }
                })
            })

            //.then(res => res.json())
            .then(parsedRes => {
                addToCartAction(true)
                if (parsedRes.status == 401) {
                    dispatch(authLogout());
                    return;
                } else if (parsedRes.status == 200) {
                    //alert('')
                    ToastAndroid.show('Product Added Successfully!', ToastAndroid.SHORT);

                } else if (parsedRes.status == 404) {
                    alert('Product Branch combination not found')
                }
                dispatch(uiStopLoading());
            })
            .catch(err => {
                addToCartAction(false)
                alert(JSON.stringify(err));
                dispatch(uiStopLoading());
            });
    };
};


export const addToCartAction = status => {
    return {
        type: ADD_TO_CART,
        cart: status
    }
}

export const setProductToCart = (branchId, productId, qty, campaignId) => {
    return dispatch => {
        dispatch(uiStartLoading());

        dispatch(authGetToken())
            .catch(() => {
                alert('no token');
            })
            .then(token => {
                const productData = {
                    branchId: branchId,
                    campaignId: campaignId,
                    productId: productId,
                    quantity: qty
                };
                return fetch("https://bimo-backend.herokuapp.com/api/mobile/basket/set-product", {
                    method: "PUT",
                    body: JSON.stringify(productData),
                    headers: {
                        "X-Auth-Token": token,
                        "Content-Type": "application/json"
                    }
                })
            })

            //.then(res => res.json())
            .then(parsedRes => {
                setProductToCartAction(true)
                if (parsedRes.status == 401) {
                    dispatch(authLogout());
                    return;
                } else if (parsedRes.status == 200) {
                    ToastAndroid.show('Product Updated Successfully!', ToastAndroid.SHORT);

                } else if (parsedRes.status == 404) {
                    ToastAndroid.show('Not found!', ToastAndroid.SHORT);
                }
                dispatch(uiStopLoading());
            })
            .catch(err => {
                setProductToCartAction(false)
                ToastAndroid.show(JSON.stringify(err), ToastAndroid.SHORT);


                dispatch(uiStopLoading());
            });
    };
};


export const setProductToCartAction = status => {
    return {
        type: SET_PRODUCT_TO_CART,
        cart: status
    }
}

export const removeFromCart = (branchId, productId) => {
    return dispatch => {
        dispatch(uiStartLoading());

        dispatch(authGetToken())
            .catch(() => {
                alert('no token');
            })
            .then(token => {
                const productData = {
                    branchId: branchId,
                    productId: productId,
                };
                return fetch("https://bimo-backend.herokuapp.com/api/mobile/basket/delete-product", {
                    method: "DELETE",
                    body: JSON.stringify(productData),
                    headers: {
                        "X-Auth-Token": token,
                        "Content-Type": "application/json"
                    }
                })
            })

            //.then(res => res.json())
            .then(parsedRes => {
                if (parsedRes.status == 401) {
                    dispatch(authLogout());
                    return;
                } else if (parsedRes.status == 200) {
                    ToastAndroid.show('Product Removed Successfully!', ToastAndroid.SHORT);
                    dispatch(getCart());
                    //alert('Product Removed Successfully')
                } else if (parsedRes.status == 404) {
                    alert('Product Branch combination not found')
                }
                removeFromCartAction(true)
                dispatch(uiStopLoading());
            })
            .catch(err => {
                removeFromCartAction(false)
                alert(JSON.stringify(err));
                dispatch(uiStopLoading());
            });
    };
};


export const removeFromCartAction = status => {
    return {
        type: REMOVE_FROM_CART,
        cart: status
    }
}

export const removeCart = (branchId) => {
    return dispatch => {
        dispatch(uiStartLoading());

        dispatch(authGetToken())
            .catch(() => {
                alert('no token');
            })
            .then(token => {
                return fetch("https://bimo-backend.herokuapp.com/api/mobile/basket?branchId=" + branchId, {
                    method: "DELETE",
                    //body: JSON.stringify(productData),
                    headers: {
                        "X-Auth-Token": token,
                        "Content-Type": "application/json"
                    }
                })
            })

            //.then(res => res.json())
            .then(parsedRes => {
                if (parsedRes.status == 401) {
                    dispatch(authLogout());
                    return;
                } else if (parsedRes.status == 200) {
                    ToastAndroid.show('Cart Deleted Successfully!', ToastAndroid.SHORT);
                    dispatch(getCart());
                    //alert('Product Removed Successfully')
                } else if (parsedRes.status == 404) {
                    alert('Not found');
                }
                removeCartAction(true)
                dispatch(uiStopLoading());
            })
            .catch(err => {
                removeCartAction(false)
                alert(JSON.stringify(err));
                dispatch(uiStopLoading());
            });
    };
};


export const removeCartAction = status => {
    return {
        type: REMOVE_CART,
        cart: status
    }
}