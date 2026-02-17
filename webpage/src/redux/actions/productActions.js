import axios from "axios";
import { PRODUCT_ACTIONS } from "./types";

import { API_URL } from "../../apiConfig";

export const fetchProducts = (category, search) => async (dispatch) => {
    dispatch({ type: PRODUCT_ACTIONS.FETCH_PRODUCTS_REQUEST });
    try {
        let url = `${API_URL}/products/`;
        const params = new URLSearchParams();
        if (category && category !== "All") params.append("category", category);
        if (search) params.append("search", search);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await axios.get(url);
        dispatch({ type: PRODUCT_ACTIONS.FETCH_PRODUCTS_SUCCESS, payload: res.data.products });
    } catch (err) {
        dispatch({ type: PRODUCT_ACTIONS.FETCH_PRODUCTS_FAILURE, payload: err.message });
    }
};

export const fetchCategories = () => async (dispatch) => {
    try {
        const res = await axios.get(`${API_URL}/products/categories`);
        dispatch({ type: PRODUCT_ACTIONS.FETCH_CATEGORIES_SUCCESS, payload: res.data.categories });
    } catch (err) {
        console.error("Failed to fetch categories:", err);
    }
};

export const setCategoryFilter = (category) => ({
    type: PRODUCT_ACTIONS.SET_CATEGORY_FILTER,
    payload: category,
});

export const setSearchQuery = (query) => ({
    type: PRODUCT_ACTIONS.SET_SEARCH_QUERY,
    payload: query,
});
