import type { Item } from ".";

// user functions

export interface ClearTab {
  email: string;
}
export interface ClearHistory {
  email: string;
}

export interface ToggleRole {
  email: string;
  role: "admin" | "dev";
}

// item functions

export interface AddItem {
  item: Item;
}

export interface DeleteItem {
  item: Item;
}

export interface UpdateItem {
  items: Item[];
}
