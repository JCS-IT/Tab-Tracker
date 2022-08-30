import type { Timestamp } from "@firebase/firestore";

export type User = {
  data: {
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

export type Tab = {
  name: string;
  date: Timestamp;
};

export type Item = {
  name: string;
  price: number;
};