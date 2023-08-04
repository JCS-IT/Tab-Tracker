import type {
  AddItem,
  ClearHistory,
  ClearTab,
  DeleteItem,
  ToggleRole,
  UpdateItem,
  UpdateTokenData,
  UpdateTopicsData,
} from "@jcstabs/shared";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

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
  : T extends "updateTokenData"
  ? UpdateTokenData
  : T extends "updateTopicsData"
  ? UpdateTopicsData
  : never;

export const callCloudFunction = async <T extends CloudFunctionName>(
  target: T,
  data: CloudFunctionData<T>,
) => {
  try {
    const callable = httpsCallable(functions, target);
    return callable(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
