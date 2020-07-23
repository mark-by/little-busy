import {combineReducers} from "redux";
import appReducer from "./appReducer";
import scheduleReducer from "./scheduleReducer";
import {messageReducer} from "../../component/Common/Message/redux/reducer";

export const rootReducer = combineReducers({
    app: appReducer,
    schedule: scheduleReducer,
    message: messageReducer,
})