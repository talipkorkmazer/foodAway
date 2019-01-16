import { GET_CART, ADD_TO_CART, REMOVE_FROM_CART, SET_PRODUCT_TO_CART, REMOVE_CART } from "../actions/actionTypes";

const initialState = {
    cart: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CART:
            return {
                ...state,
                cart: action.cart
            };
        case ADD_TO_CART:
            return {
                ...state,
                cart: action.cart
            };
        case REMOVE_FROM_CART:
            return {
                ...state,
                cart: state.cart.filter(place => {
                    return place.key !== action.key;
                })
            };
        case SET_PRODUCT_TO_CART:
            return {
                ...state,
                cart: action.cart
            };
        case REMOVE_CART:
            return {
                ...state,
                cart: action.cart
            };
        default:
            return state;
    }
};

export default reducer;
