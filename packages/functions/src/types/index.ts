import { Timestamp } from "firebase-admin/firestore";
import { CallableRequest } from "firebase-functions/v2/https";

export interface Props<T> extends CallableRequest {
  data: T;
}

export interface TabItem {
  name: string;
  price: number;
  date: Timestamp;
  paid: boolean;
  clearedBy?: string;
}
