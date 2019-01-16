import { AsyncStorage } from 'react-native';

import { TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
import startMainTabs from '../../screens/MainTabs/startMainTabs';
import App from '../../../App';

export const tryAuth = (authData, authMode) => {
    return dispatch => {
        dispatch(uiStartLoading());
        const apiKey = "AIzaSyCnhp5LGiSau6IYbepgSSsfruLp_Oa0iZ4";
        let url = "https://bimo-backend.herokuapp.com/api/mobile/auth";
        if (authMode === 'signup') {
            url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + apiKey;
        }
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: authData.email,
                password: authData.password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .catch(err => {
                //alert(err);
                alert("Authentication failed, please try again!");
                dispatch(uiStopLoading());
            })
            //.then(res => res.json())
            .then(parsedRes => {
                dispatch(uiStopLoading());
                if (!parsedRes.headers.map['x-auth-token']) {
                    alert("Authentication failed, please try again!");
                } else {
                    dispatch(authStoreToken(parsedRes.headers.map['x-auth-token']));
                    startMainTabs();
                }
            });
    }
};

export const authStoreToken = token => {
    return dispatch => {
        dispatch(authSetToken(token));
        AsyncStorage.setItem("bimo:auth:token", token);
    }
}

export const authSetToken = token => {
    return {
        type: AUTH_SET_TOKEN,
        token: token
    }
}

export const authGetToken = () => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => {
            const token = getState().auth.token;
            if (!token) {
                AsyncStorage.getItem("bimo:auth:token")
                    .catch(err => {
                        reject();
                    })
                    .then(tokenFromStorage => {
                        if (!tokenFromStorage) {
                            reject();
                            return;
                        }

                        dispatch(authSetToken(tokenFromStorage));
                        resolve(tokenFromStorage);
                    })
                    ;
            } else {
                resolve(token);
            }
        });
        promise.catch(err => {
            dispatch(authClearStorage());
        })
        return promise;
    };
};

export const authAutoSignin = () => {
    return dispatch => {
        dispatch(authGetToken())
            .then(token => {
                startMainTabs();
            })
            .catch(err => {
                //alert('failed to fetch token')
            })
            ;
    }
};

export const authClearStorage = () => {
    return dispatch => {
        AsyncStorage.removeItem("bimo:auth:token");
    };
};

export const authLogout = () => {
    return dispatch => {
        dispatch(authClearStorage());
        App();
        dispatch(authRemoveToken());
    };
};

export const authRemoveToken = () => {
    return {
        type: AUTH_REMOVE_TOKEN
    };
};