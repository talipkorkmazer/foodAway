import { PLACE_ORDER } from "../actions/actionTypes";

const initialState = {
    order: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case PLACE_ORDER:
            return {
                ...state,
                order: action.order
            };
        default:
            return state;
    }
};

export default reducer;
