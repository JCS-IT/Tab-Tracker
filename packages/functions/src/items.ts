import { firestore } from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { Props, Item } from "./types";

export const addItem = onCall(
  {
    enforceAppCheck: true,
  },
  async (event: Props<{ item: Item }>) => {
    if (!event.auth?.token.admin) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to add an item",
      );
    }

    return firestore()
      .doc("admin/items")
      .update({
        food: FieldValue.arrayUnion(event.data.item),
      })
      .catch((error) => {
        throw new HttpsError("unknown", error.message);
      });
  },
);

export const deleteItem = onCall(
  {
    enforceAppCheck: true,
  },
  async (event: Props<{ item: Item }>) => {
    if (!event.auth?.token.admin) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to delete an item",
      );
    }

    return firestore()
      .doc("admin/items")
      .update({
        food: FieldValue.arrayRemove(event.data.item),
      });
  },
);

export const updateItem = onCall(
  {
    enforceAppCheck: true,
  },
  async (event: Props<{ items: Item[] }>) => {
    if (!event.auth?.token.admin) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to update an item",
      );
    }

    return firestore().doc("admin/items").update({
      food: event.data.items,
    });
  },
);
