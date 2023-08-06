import type { TabItem } from "@/types";

/**
 * Counts the number of unpaid items in a tab, grouped by item name.
 * @param tab - The array of TabItems to be counted.
 * @returns An object with the count of unpaid items for each item name.
 */
export const countItemsInTab = (tab: TabItem[]) => {
  return tab.reduce(
    (count: Record<string, number>, { name, paid }: TabItem) => {
      if (!count[name]) {
        count[name] = 0;
      }
      if (!paid) {
        count[name]++;
      }
      return count;
    },
    {}
  );
};

/**
 * Removes duplicate items from an array of TabItems based on their name property.
 * @param arr - The array of TabItems to be deduplicated.
 * @returns A new array of TabItems without duplicates.
 */
export const dedupeArray = (arr: TabItem[]) => {
  const seen = new Set();
  return arr.filter((item) => {
    const duplicate = seen.has(item.name);
    seen.add(item.name);
    return !duplicate;
  });
};

/**
 * Returns a new array of TabItems with the same properties as the input array, but in reverse order.
 * @param tab - The array of TabItems to be reversed.
 * @returns A new array of TabItems in reverse order.
 */
export const reverseTab = (arr: TabItem[]): TabItem[] =>
  arr.map((item) => ({ ...item })).reverse();

/**
 * Returns the total price of all items in a tab.
 * @param input - The array of TabItems to be totaled.
 * @returns The total price of all items in the tab.
 **/
export const sumTab = (input: TabItem[]) => {
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    total += input[i].price;
  }

  return total;
};

/**
 * Formats a number as a currency string in Canadian dollars.
 * @param amount The number to format.
 * @returns The formatted currency string.
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
};
