import { ORDER_ACTIONS } from "../actions/types";

const initialState = {
    loading: false,
    error: null,
    orderSuccess: null,
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case ORDER_ACTIONS.CHECKOUT_REQUEST:
            return { ...state, loading: true, error: null };

        case ORDER_ACTIONS.CHECKOUT_SUCCESS:
            return { ...state, loading: false, orderSuccess: action.payload };

        case ORDER_ACTIONS.CHECKOUT_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case ORDER_ACTIONS.CLEAR_ORDER_SUCCESS:
            return { ...state, orderSuccess: null };

        default:
            return state;
    }
};

export default orderReducer;
