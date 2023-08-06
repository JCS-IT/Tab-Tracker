import { Timestamp } from "firebase-admin/firestore";

export type TabItem = {
  name: string;
  price: number;
  date: Timestamp;
  paid: boolean;
  clearedBy?: string;
};
