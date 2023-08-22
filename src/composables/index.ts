import type {
  AddItem,
  ClearHistory,
  ClearTab,
  DeleteItem,
  ToggleRole,
  UpdateItem,
} from "@/types";
import { httpsCallable, getFunctions } from "firebase/functions";

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
  target: T,
  data: CloudFunctionData<T>
) => {
  try {
    const functions = getFunctions(useFirebaseApp());
    const callable = httpsCallable(functions, target);
    return callable(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
