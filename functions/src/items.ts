import { firestore } from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import type { AddItem, DeleteItem, UpdateItem } from "../../src/types";

export const addItem = onCall<AddItem>(
  {
    enforceAppCheck: true,
  },
  async (event) => {
    if (!event.auth?.token.admin) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to add an item"
      );
    }

    await firestore()
      .doc("admin/items")
      .update({
        food: FieldValue.arrayUnion(event.data.item),
      })
      .catch((error) => {
        throw new HttpsError("unknown", error.message);
      });

    return true;
  }
);

export const deleteItem = onCall<DeleteItem>(
  {
    enforceAppCheck: true,
  },
  async (event) => {
    if (!event.auth?.token.admin) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to delete an item"
      );
    }

    await firestore()
      .doc("admin/items")
      .update({
        food: FieldValue.arrayRemove(event.data.item),
      })
      .catch((error) => {
        throw new HttpsError("unknown", error.message);
      });

    return true;
  }
);

export const updateItem = onCall<UpdateItem>(
  {
    enforceAppCheck: true,
  },
  async (event) => {
    if (!event.auth?.token.admin) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to update an item"
      );
    }
    await firestore()
      .runTransaction(async (t) => {
        const doc = await t.get(firestore().doc("admin/items"));
        const food = doc.data()?.food;

        const { before, after } = event.data;

        food.splice(food.indexOf(before), 1, after);

        t.update(firestore().doc("admin/items"), {
          food,
        });
      })
      .catch((error) => {
        throw new HttpsError("unknown", error.message);
      });

    return true;
  }
);
