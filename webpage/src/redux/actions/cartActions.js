import axios from "axios";
import { CART_ACTIONS } from "./types";

import { API_URL } from "../../apiConfig";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchCart = () => async (dispatch) => {
    dispatch({ type: CART_ACTIONS.FETCH_CART_REQUEST });
    try {
        const res = await axios.get(`${API_URL}/cart/`, getAuthHeader());
        dispatch({ type: CART_ACTIONS.FETCH_CART_SUCCESS, payload: res.data.cart });
    } catch (err) {
        dispatch({ type: CART_ACTIONS.FETCH_CART_FAILURE, payload: err.message });
    }
};

export const addToCart = (productId, quantity = 1) => async (dispatch) => {
    try {
        await axios.post(`${API_URL}/cart/add`, { product_id: productId, quantity }, getAuthHeader());
        dispatch({ type: CART_ACTIONS.ADD_TO_CART_SUCCESS });
        dispatch(fetchCart());
    } catch (err) {
        console.error("Failed to add to cart:", err);
    }
};

export const updateCartItem = (productId, quantity) => async (dispatch) => {
    try {
        await axios.put(`${API_URL}/cart/update`, { product_id: productId, quantity }, getAuthHeader());
        dispatch(fetchCart());
    } catch (err) {
        console.error("Failed to update cart:", err);
    }
};

export const removeFromCart = (productId) => async (dispatch) => {
    try {
        await axios.delete(`${API_URL}/cart/remove`, {
            ...getAuthHeader(),
            data: { product_id: productId },
        });
        dispatch(fetchCart());
    } catch (err) {
        console.error("Failed to remove from cart:", err);
    }
};

export const clearCart = () => async (dispatch) => {
    try {
        await axios.delete(`${API_URL}/cart/clear`, getAuthHeader());
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
    } catch (err) {
        console.error("Failed to clear cart:", err);
    }
};
