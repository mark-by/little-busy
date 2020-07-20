import {combineReducers} from "redux";
import appReducer from "./appReducer";
import scheduleReducer from "./scheduleReducer";
import {paginateReducer} from "../../component/Common/paginateReducer";
import {typeIncPageCertificates, typeIncPageFeedback, typeSetCertificates, typeSetFeedback} from "../types";
import {messageReducer} from "../../component/Common/Message/redux/reducer";

export const rootReducer = combineReducers({
    app: appReducer,
    schedule: scheduleReducer,
    certificates: paginateReducer(typeSetCertificates, typeIncPageCertificates),
    feedback: paginateReducer(typeSetFeedback, typeIncPageFeedback),
    message: messageReducer,
})