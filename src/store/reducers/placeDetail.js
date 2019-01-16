import { SET_PLACE_DETAIL } from "../actions/actionTypes";

const initialState = {
  placeDetail: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLACE_DETAIL:
      return {
        ...state,
        placeDetail: action.placeDetail
      };
    default:
      return state;
  }
};

export default reducer;
