import { initializeApp } from "firebase-admin";

initializeApp();

import { addItem, removeItem, updateItem } from "./items";
import { onCreate, onDelete, beforecreated } from "./auth";
import { clearTab } from "./clearTab";
import { toggleRole } from "./roles";

export {
  addItem,
  removeItem,
  updateItem,
  beforecreated,
  onCreate,
  onDelete,
  clearTab,
  toggleRole,
};
