import { TabItem } from "@/types";

/**
 * Returns the total price of all items in a tab.
 * @param input - The array of TabItems to be totaled.
 * @returns The total price of all items in the tab.
 **/
export const getTabTotal = (input: TabItem[]) => {
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    total += input[i].price;
  }

  return total;
};
