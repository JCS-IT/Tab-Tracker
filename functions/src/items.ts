import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const addItem = functions.https.onCall(async (data, context) => {
  if (context.auth == undefined) {
    throw new functions.https.HttpsError("permission-denied", "Unknown origin");
  }
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "You must be an admin to add an item"
    );
  }

  // add an item to the foods array in admin/items document
  return admin
      .firestore()
      .doc("admin/items")
      .update({
        food: admin.firestore.FieldValue.arrayUnion(data.item),
      });
});

export const removeItem = functions.https.onCall(async (data, context) => {
  if (context.auth == undefined) {
    throw new functions.https.HttpsError("permission-denied", "Unknown origin");
  }
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "You must be an admin to remove an item"
    );
  }
  console.log(data.name);
  // remove an item from the foods array in admin/items document
  return admin
      .firestore()
      .doc("admin/items")
      .update({
        food: admin.firestore.FieldValue.arrayRemove(data.item),
      });
});
