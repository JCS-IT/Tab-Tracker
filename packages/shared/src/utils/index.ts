import { TabItem } from "../types";
import { Timestamp as AdminTimestamp } from "firebase-admin/firestore";

type InputTabItem =
  | TabItem
  | (Omit<TabItem, "date"> & { date: AdminTimestamp });

/**
 * Calculates the total price of all items in a tab.
 * @param input - The array of TabItems to calculate the total price from.
 * @returns The total price of all items in the tab.
 */
export const getTabTotal = (input: InputTabItem[]) => {
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    total += input[i].price;
  }

  return total;
};
