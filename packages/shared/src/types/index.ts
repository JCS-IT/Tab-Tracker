import type { Timestamp } from "firebase/firestore";

export type UserInfo = {
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: number;
};

export type User = {
  info: UserInfo;
  tab: TabItem[];
  roles: Record<string, boolean>;
  topics: string[];
};

export type Item = {
  name: string;
  price: number;
};

export type Items = {
  food: Item[];
};
export type TabItem = {
  name: string;
  price: number;
  date: Timestamp;
  paid: boolean;
  clearedBy?: string;
};
