import { SET_PLACES, REMOVE_PLACE, SET_PLACE_DETAIL } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken, authLogout } from './index';

export const addPlace = (placeName, location, image) => {
    return dispatch => {
        dispatch(uiStartLoading());

        dispatch(authGetToken())
            .catch(() => {
                alert('no token');
            })
            .then(token => {
                const placeData = {
                    name: placeName,
                    location: location,
                    image: 'parsedRes.imageUrl'
                };
                return fetch("https://bimo-app-227815.firebaseio.com/places.json?auth=" + token, {
                    method: "POST",
                    body: JSON.stringify(placeData)
                })
            })

            .then(res => res.json())
            .then(parsedRes => {
                //alert(JSON.stringify(parsedRes));
                dispatch(uiStopLoading());
            })
            .catch(err => {
                alert(JSON.stringify(err));
                dispatch(uiStopLoading());
            });
    };
};

export const getPlaces = (lat, lng) => {
    return dispatch => {
        dispatch(authGetToken())
            .then(token => {
                //alert(token)
                return fetch("https://bimo-backend.herokuapp.com/api/mobile/branch?distance=1&latitude=" + lat + "&longitude="+lng, {
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
                const places = [];
                for (let key in parsedRes.branchList) {
                    places.push({
                        id: parsedRes.branchList[key].id,
                        branchName: parsedRes.branchList[key].branchName,
                        companyName: parsedRes.branchList[key].companyName,
                        location: {
                            latitude: parsedRes.branchList[key].location.y,
                            longitude: parsedRes.branchList[key].location.x,
                        },
                        key: key
                    });
                }
                dispatch(setPlaces(places));
            })
            .catch(err => {
                alert(err);
                //console.log(err);
            });
    };
};

export const setPlaces = places => {
    return {
        type: SET_PLACES,
        places: places
    }
}

