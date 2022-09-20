import { initializeApp } from "firebase-admin";

initializeApp();

import { addItem, deleteItem, updateItem } from "./items";
import {
  clearTab,
  onCreate,
  onDelete,
  toggleRole,
  beforecreated,
} from "./user";

export {
  addItem,
  deleteItem,
  updateItem,
  clearTab,
  onCreate,
  onDelete,
  toggleRole,
  beforecreated,
};
