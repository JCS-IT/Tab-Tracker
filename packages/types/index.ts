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
});

export const UserInfoSchema = z.object({
  email: z.string(),
  displayName: z.string(),
  photoURL: z.string(),
  createdAt: z.number(),
});

export const UserSchema = z.object({
  info: UserInfoSchema,
  tab: z.array(TabItemSchema),
  roles: z.record(z.boolean()),
  topics: z.array(z.string()),
});

export type Item = z.infer<typeof ItemSchema>;
export type Items = z.infer<typeof ItemsSchema>;
export type TabItem = z.infer<typeof TabItemSchema>;
export type UserInfo = z.infer<typeof UserInfoSchema>;
export type User = z.infer<typeof UserSchema>;
