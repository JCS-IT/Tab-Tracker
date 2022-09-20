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
  return admin
    .firestore()
    .doc("admin/items")
    .update({
      food: admin.firestore.FieldValue.arrayRemove(data.item),
    });
});

export const updateItem = functions.https.onCall(async (data, context) => {
  if (context.auth == undefined) {
    throw new functions.https.HttpsError("permission-denied", "Unknown origin");
  }
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be an admin to update an item"
    );
  }
  return admin.firestore().doc("admin/items").update({
    food: data.items,
  });
});
