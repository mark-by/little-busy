const initialState = {
    list: [],
    hasMore: true,
    page: 1
}

export const paginateReducer = (setType, incType) => {
    return (state = initialState, action) => {
        switch (action.type) {
            case setType:
                if (action.payload.hasMore) {
                    return {...state, list: [...state.list, ...action.payload.list], hasMore: true};
                } else {
                    return {...state, hasMore: false};
                }
            case incType:
                return {...state, page: state.page + 1};
            default:
                return state;
        }
    }
}