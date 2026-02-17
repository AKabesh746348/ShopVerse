import { CART_ACTIONS } from "../actions/types";

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case CART_ACTIONS.FETCH_CART_REQUEST:
            return { ...state, loading: true };

        case CART_ACTIONS.FETCH_CART_SUCCESS:
            return { ...state, loading: false, items: action.payload };

        case CART_ACTIONS.FETCH_CART_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case CART_ACTIONS.CLEAR_CART:
            return { ...state, items: [] };

        default:
            return state;
    }
};

export default cartReducer;
