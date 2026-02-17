import { AUTH_ACTIONS } from "../actions/types";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

const initialState = {
    token: token || null,
    user: user || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_REQUEST:
        case AUTH_ACTIONS.SIGNUP_REQUEST:
            return { ...state, loading: true, error: null };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
        case AUTH_ACTIONS.SIGNUP_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                token: action.payload.token,
                user: action.payload.user,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_FAILURE:
        case AUTH_ACTIONS.SIGNUP_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return { ...state, error: null };

        default:
            return state;
    }
};

export default authReducer;
