import type { Timestamp } from "@firebase/firestore";

export type User = {
  info: {
    email: string;
    displayName: string;
    photoURL: string;
    createdAt: Timestamp;
  };
  tab: [
    {
      name: string;
      price: number;
      date: Timestamp;
    }
  ];
  roles: {
    [key: string]: boolean;
  };
};

export type Item = {
  name: string;
  price: number;
};

export type TabItem = {
  name: string;
  price: number;
  date: Timestamp;
};
