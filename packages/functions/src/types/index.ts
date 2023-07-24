import { Timestamp } from "firebase-admin/firestore";
import { CallableRequest } from "firebase-functions/v2/https";
import { TabItem as SharedTabItem, Item as SharedItem } from "@jcstabs/shared";
export interface Props<T> extends CallableRequest {
  data: T;
}

export interface TabItem extends Omit<SharedTabItem, "date"> {
  date: Timestamp;
}

export interface Item extends SharedItem {}
