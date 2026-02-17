import { PRODUCT_ACTIONS } from "../actions/types";

const initialState = {
    products: [],
    categories: [],
    selectedCategory: "All",
    searchQuery: "",
    loading: false,
    error: null,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case PRODUCT_ACTIONS.FETCH_PRODUCTS_REQUEST:
            return { ...state, loading: true, error: null };

        case PRODUCT_ACTIONS.FETCH_PRODUCTS_SUCCESS:
            return { ...state, loading: false, products: action.payload };

        case PRODUCT_ACTIONS.FETCH_PRODUCTS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case PRODUCT_ACTIONS.FETCH_CATEGORIES_SUCCESS:
            return { ...state, categories: ["All", ...action.payload] };

        case PRODUCT_ACTIONS.SET_CATEGORY_FILTER:
            return { ...state, selectedCategory: action.payload };

        case PRODUCT_ACTIONS.SET_SEARCH_QUERY:
            return { ...state, searchQuery: action.payload };

        default:
            return state;
    }
};

export default productReducer;
