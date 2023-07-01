import type { Timestamp } from "firebase/firestore";
import type { VDataTable } from "vuetify/labs/VDataTable";

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
};

export type User = {
  info: UserInfo;
  tab: TabItem[];
  roles: {
    [key: string]: boolean;
  };
  topics: string[];
};

export type UserInfo = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Timestamp;
};

export type VDataTableHeaderProps = Extract<
  VDataTable["$props"]["headers"],
  { key: string }
>;
