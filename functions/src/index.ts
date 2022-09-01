import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

import {addItem, removeItem, updateItem} from "./items";

export {addItem, removeItem, updateItem};

export const beforeCreate = functions.auth
    .user()
    .beforeCreate((user, context) => {
      if (context == null) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Unknown origin"
        );
      }

      if (!user.email?.endsWith("@educbe.ca")) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "You must be in the educbe.ca domain to create an account"
        );
      }
    });

export const onCreate = functions.auth.user().onCreate((user) => {
  return admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        data: {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        tab: [],
        roles: {},
      });
});

export const onDelete = functions.auth.user().onDelete((user) => {
  return admin.firestore().doc(`users/${user.uid}`).delete();
});

export const deleteUser = functions.https.onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError("permission-denied", "Unknown origin");
  }
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "You must be an admin to delete a user"
    );
  }
  if (!(typeof data.email === "string")) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "invalid argument passed to function"
    );
  }
  if (data.email === context.auth?.token.email) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "You cannot delete yourself"
    );
  }

  const user = await admin.auth().getUserByEmail(data.email);
  return admin.auth().deleteUser(user.uid);
});

export const clearTab = functions.https.onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError("permission-denied", "Unknown origin");
  }
  if (context.auth == undefined) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "You must be logged in"
    );
  }
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "You must be an admin to clear the tab"
    );
  }
  const user = await admin.auth().getUserByEmail(data.email);
  return admin
      .firestore()
      .doc(`users/${user.uid}`)
      .update({
        tab: [],
      })
      .then(() => {
        return {
          message: "Tab cleared",
        };
      });
});

export const toggleAdmin = functions.https.onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError("permission-denied", "Unknown origin");
  }
  if (context.auth == undefined) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "You must be logged in"
    );
  }
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "You must be an admin to toggle admin status"
    );
  }
  const user = await admin.auth().getUserByEmail(data.email);
  try {
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: !user.customClaims?.admin,
    });
    await admin
        .firestore()
        .doc(`users/${user.uid}`)
        .update({
          roles: {
            admin: !user.customClaims?.admin,
          },
        });
  } catch (e) {
    throw new functions.https.HttpsError(
        "unknown",
        "An unknown error occurred"
    );
  }
});
