import { TabItem } from "../types";

/**
 * Calculates the total price of all tabs in the input array.
 * @param {TabItem} input An array of TabItem objects.
 * @return {number} The total price of all tabs.
 */
export const getTabTotal = (input: TabItem[]) => {
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    total += input[i].price;
  }

  return total;
};
