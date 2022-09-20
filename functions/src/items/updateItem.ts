import { onCall, HttpsError } from "firebase-functions/v1/https";
import { firestore } from "firebase-admin";

export const updateItem = onCall((data, context) => {
  if (context.auth == undefined) {
    throw new HttpsError("permission-denied", "Unknown origin");
  }
  if (!context.auth.token.admin) {
    throw new HttpsError(
      "permission-denied",
      "You must be an admin to update an item"
    );
  }
  return firestore().doc("admin/items").update({
    food: data.items,
  });
});
