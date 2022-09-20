import { firestore } from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v1/https";

export const addItem = onCall((data, context) => {
  if (context.app === undefined) {
    throw new HttpsError("failed-precondition", "Unknown origin");
  }
  if (!context.auth?.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to add an item"
    );
  }

  return firestore()
    .doc("admin/items")
    .update({
      food: firestore.FieldValue.arrayUnion(data.item),
    });
});
