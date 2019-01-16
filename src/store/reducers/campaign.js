import { GET_CAMPAING } from "../actions/actionTypes";

const initialState = {
    campaign: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CAMPAING:
            return {
                ...state,
                campaign: action.campaign
            };
        
        default:
            return state;
    }
};

export default reducer;
