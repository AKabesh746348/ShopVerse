import axios from "axios";
import { ORDER_ACTIONS, CART_ACTIONS } from "./types";

import { API_URL } from "../../apiConfig";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const checkout = (deliveryInfo) => async (dispatch) => {
    dispatch({ type: ORDER_ACTIONS.CHECKOUT_REQUEST });
    try {
        const res = await axios.post(`${API_URL}/orders/checkout`, deliveryInfo, getAuthHeader());
        dispatch({ type: ORDER_ACTIONS.CHECKOUT_SUCCESS, payload: res.data });
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
        return { success: true, data: res.data };
    } catch (err) {
        const errorMsg = err.response?.data?.error || "Checkout failed";
        dispatch({ type: ORDER_ACTIONS.CHECKOUT_FAILURE, payload: errorMsg });
        return { success: false, error: errorMsg };
    }
};

export const clearOrderSuccess = () => ({ type: ORDER_ACTIONS.CLEAR_ORDER_SUCCESS });
