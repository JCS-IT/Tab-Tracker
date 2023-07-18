import { z } from "zod";

import { Timestamp } from "firebase/firestore";

export const ItemSchema = z.object({
  name: z.string(),
  price: z.number(),
});

export const ItemsSchema = z.object({
  food: z.array(ItemSchema),
});

export const TabItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  date: z.instanceof(Timestamp),
  paid: z.boolean(),
  clearedBy: z.string().optional(),
});

export const UserInfoSchema = z.object({
  email: z.string(),
  displayName: z.string(),
  photoURL: z.string(),
  createdAt: z.number(),
});

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

export type Item = z.infer<typeof ItemSchema>;
export type Items = z.infer<typeof ItemsSchema>;
export type TabItem = z.infer<typeof TabItemSchema>;
