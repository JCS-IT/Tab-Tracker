import { Timestamp } from "firebase-admin/firestore";
import { CallableRequest } from "firebase-functions/v2/https";
export interface Props<T> extends CallableRequest {
  data: T;
}

export type TabItem = {
  name: string;
  price: number;
  date: Timestamp;
  paid: boolean;
  clearedBy?: string;
};

export type Item = {
  name: string;
  price: number;
};
