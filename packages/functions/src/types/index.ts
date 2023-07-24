import { Timestamp } from "firebase-admin/firestore";
import { TabItem as SharedTabItem, Item as SharedItem } from "@jcstabs/shared";

export interface TabItem extends Omit<SharedTabItem, "date"> {
  date: Timestamp;
}

export interface Item extends SharedItem {}
