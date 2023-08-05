import type {
  AddItem,
  ClearHistory,
  ClearTab,
  DeleteItem,
  TabItem,
  ToggleRole,
  UpdateItem,
} from "@/types";
import { Functions, httpsCallable } from "firebase/functions";

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
export const virtualTab = (tab: TabItem[]): TabItem[] =>
  tab.map((item) => ({ ...item })).reverse();

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

type CloudFunctionName =
  | "clearTab"
  | "clearHistory"
  | "toggleRole"
  | "addItem"
  | "deleteItem"
  | "updateItem"
  | "updateTokenData"
  | "updateTopicsData";

type CloudFunctionData<T extends CloudFunctionName> = T extends "clearTab"
  ? ClearTab
  : T extends "clearHistory"
  ? ClearHistory
  : T extends "toggleRole"
  ? ToggleRole
  : T extends "addItem"
  ? AddItem
  : T extends "deleteItem"
  ? DeleteItem
  : T extends "updateItem"
  ? UpdateItem
  : never;

/**
 * Calls a cloud function with the given data.
 * @param functions The Firebase Functions instance.
 * @param target The name of the cloud function to call.
 * @param data The data to pass to the cloud function.
 */
export const callCloudFunction = async <T extends CloudFunctionName>(
  functions: Functions,
  target: T,
  data: CloudFunctionData<T>
) => {
  try {
    const callable = httpsCallable(functions, target);
    return callable(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
