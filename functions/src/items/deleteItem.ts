import { onCall, HttpsError } from "firebase-functions/v1/https";
import { firestore } from "firebase-admin";

export const deleteItem = onCall(async (data, context) => {
  if (context.app === undefined) {
    throw new HttpsError("failed-precondition", "Unknown origin");
  }
  if (!context.auth?.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to delete an item"
    );
  }

  return firestore()
    .doc("admin/items")
    .update({
      food: firestore.FieldValue.arrayRemove(data.item),
    });
});
