import { ToastAndroid } from 'react-native'
import { GET_CAMPAING } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken, authLogout } from './index';

export const getCampaign = () => {
    return dispatch => {
        dispatch(authGetToken())
            .then(token => {
                //alert(token)
                return fetch("https://bimo-backend.herokuapp.com/api/mobile/campaign?distance=1&latitude=41.107787&longitude=29.007744", {
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
                    alert('Not found');
                    return;
                }
                dispatch(setCampaign(parsedRes));
            })
            .catch(err => {
                alert(err);
                //console.log(err);
            });
    };
};

export const setCampaign = campaign => {
    return {
        type: GET_CAMPAING,
        campaign: campaign
    }
}

