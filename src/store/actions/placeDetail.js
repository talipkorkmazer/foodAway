import { SET_PLACE_DETAIL } from './actionTypes';
import { authGetToken, authLogout } from './index';

export const getPlaceDetail = (id) => {
    return dispatch => {
        dispatch(authGetToken())
            .then(token => {
                return fetch("https://bimo-backend.herokuapp.com/api/mobile/menu?branchId=" + id, {
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
                if (parsedRes.status == 401) {
                    dispatch(authLogout());
                    return;
                }
                const placesDetails = [];
                for (let key in parsedRes) {
                    placesDetails.push({
                        companyName: parsedRes.companyName,
                        companyLogoUrl: {
                            uri: parsedRes.companyLogoUrl
                        },
                        menuList: parsedRes.menuList,
                        key: key
                    });
                }
                dispatch(setPlaceDetail(placesDetails));
            })
            .catch(err => {
                alert(err);
            });
    };
};

export const setPlaceDetail = placeDetail => {
    return {
        type: SET_PLACE_DETAIL,
        placeDetail: placeDetail
    };
};