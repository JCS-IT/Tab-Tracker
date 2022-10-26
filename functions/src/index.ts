import {initializeApp} from "firebase-admin";

initializeApp();

// user functions
export {clearTab, toggleRole} from "./user/user";

// auth functions
export {beforeCreate, onCreate, onDelete} from "./user/auth";

// item functions
export {addItem, deleteItem, updateItem} from "./items";
