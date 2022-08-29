import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

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

export const setUpFirestore = functions.auth
  .user()
  .onCreate((user, context) => {
    if (context == null) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Unknown origin"
      );
    }
    const batch = admin.firestore().batch();
    batch.set(admin.firestore().doc(`users/${user.uid}`), {
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      tab: [],
      roles: {},
    });
    batch.update(admin.firestore().doc(`admin/users`), {
      index: {
        [user.uid]: {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      },
    });
    return batch.commit();
  });

export const purgeUser = functions.auth.user().onDelete((user) => {
  const batch = admin.firestore().batch();
  batch.delete(admin.firestore().doc(`users/${user.uid}`));
  return batch.commit();
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
  if (!(typeof data.uid === "string")) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "invalid argument passed to function"
    );
  }
  if (data.uid === context.auth?.uid) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You cannot delete yourself"
    );
  }
  return await admin.auth().deleteUser(data.uid);
});

export const makeAdmin = functions.https.onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError("permission-denied", "Unknown origin");
  }
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be an admin to make an admin"
    );
  }
  if (!(typeof data.uid === "string")) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "invalid argument passed to function"
    );
  }
  const batch = admin.firestore().batch();
  batch.update(admin.firestore().doc(`users/${data.uid}`), {
    roles: {
      admin: true,
    },
  });
  return await admin.auth().setCustomUserClaims(data.uid, { admin: true });
});
