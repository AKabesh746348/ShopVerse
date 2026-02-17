import axios from "axios";
import { AUTH_ACTIONS } from "./types";

import { API_URL } from "../../apiConfig";

export const signup = (name, email, password) => async (dispatch) => {
    dispatch({ type: AUTH_ACTIONS.SIGNUP_REQUEST });
    try {
        const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: AUTH_ACTIONS.SIGNUP_SUCCESS, payload: { token, user } });
        return { success: true };
    } catch (err) {
        const errorMsg = err.response?.data?.error || "Signup failed";
        dispatch({ type: AUTH_ACTIONS.SIGNUP_FAILURE, payload: errorMsg });
        return { success: false, error: errorMsg };
    }
};

export const login = (email, password) => async (dispatch) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_REQUEST });
    try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { token, user } });
        return { success: true };
    } catch (err) {
        const errorMsg = err.response?.data?.error || "Login failed";
        dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: errorMsg });
        return { success: false, error: errorMsg };
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
};

export const clearError = () => ({ type: AUTH_ACTIONS.CLEAR_ERROR });
