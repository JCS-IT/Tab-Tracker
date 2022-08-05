import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

export const beforeCreate = functions.auth
    .user()
    .beforeCreate((user, context) => {
      if (context != null) {
        if (!user.email?.endsWith("@educbe.ca")) {
          throw new functions.https.HttpsError(
              "permission-denied",
              "You must be in the educbe.ca domain to create an account"
          );
        }
      } else {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Unknown origin"
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
        name: user.displayName,
        tab: [],
      });
      batch.update(admin.firestore().doc("admin/users"), {
        index: [
          {
            name: user.displayName,
            uid: user.uid,
          },
        ],
      });
      return batch.commit();
    });

export const setUpUserClaims = functions.auth
    .user()
    .onCreate((user, context) => {
      if (context == null) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Unknown origin"
        );
      }
      return admin
          .auth()
          .setCustomUserClaims(user.uid, {admin: false})
          .catch((err) => {
            return err;
          });
    });

export const purgeUser = functions.auth.user().onDelete((user) => {
  const batch = admin.firestore().batch();
  batch.delete(admin.firestore().doc(`users/${user.uid}`));
  batch.update(admin.firestore().doc("admin/users"), {
    index: admin.firestore.FieldValue.arrayRemove({
      name: user.displayName,
      uid: user.uid,
    }),
  });
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
  if (!(typeof data.email === "string")) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "invalid argument passed to function"
    );
  }
  return admin.auth().deleteUser(data.uid);
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
  return admin.auth().setCustomUserClaims(data.uid, {admin: true});
});
