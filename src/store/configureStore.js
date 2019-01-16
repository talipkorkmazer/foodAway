import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import placesReducer from './reducers/places';
import uiReducer from './reducers/ui';
import authReducer from "./reducers/auth";
import placeDetailReducer from "./reducers/placeDetail";
import cartReducer from './reducers/cart';
import campaignReducer from './reducers/campaign';
import orderReducer from './reducers/order';
import ordersReducer from './reducers/orders'


const rootReducer = combineReducers({
    places: placesReducer,
    ui: uiReducer,
    auth: authReducer,
    placeDetail: placeDetailReducer,
    cart: cartReducer,
    campaign: campaignReducer,
    order: orderReducer,
    orders: ordersReducer
});

let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

}

const configureStore = () => {
    return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;
