import * as functions from "firebase-functions";
import { HttpsError, beforeUserCreated } from "firebase-functions/v2/identity";
import { firestore } from "firebase-admin";

export const beforecreated = beforeUserCreated((event) => {
  const { email } = event.data;
  if (!email?.endsWith("@educbe.ca")) {
    throw new HttpsError(
      "permission-denied",
      "You must be in the educbe.ca domain to create an account"
    );
  }
});

export const onCreate = functions.auth.user().onCreate(async (user) => {
  const { email, displayName, photoURL } = user;

  return firestore().doc(`users/${user.uid}`).set({
    data: {
      email,
      displayName,
      photoURL,
    },
    tab: [],
    roles: {},
  });
});

export const onDelete = functions.auth.user().onDelete(async (user) => {
  return firestore().doc(`users/${user.uid}`).delete();
});

// export const onCreate = functions.auth.user().onCreate((user) => {
//   const batch = firestore().batch();
//   batch.set(firestore().doc(`users/${user.uid}`), {
//     data: {
//       email: user.email,
//       displayName: user.displayName,
//       photoURL: user.photoURL,
//       createdAt: firestore.FieldValue.serverTimestamp(),
//     },
//     tab: [],
//     roles: {},
//   });
//   return batch.commit();
// });

// export const onDelete = functions.auth.user().onDelete((user) => {
//   return admin.firestore().doc(`users/${user.uid}`).delete();
// });

// export const deleteUser = functions.https.onCall(async (data, context) => {
//   if (context.app == undefined) {
//     throw new functions.https.HttpsError("permission-denied", "Unknown origin");
//   }
//   if (!context.auth?.token.admin) {
//     throw new functions.https.HttpsError(
//       "permission-denied",
//       "You must be an admin to delete a user"
//     );
//   }
//   if (!(typeof data.email === "string")) {
//     throw new functions.https.HttpsError(
//       "invalid-argument",
//       "invalid argument passed to function"
//     );
//   }
//   if (data.email === context.auth?.token.email) {
//     throw new functions.https.HttpsError(
//       "permission-denied",
//       "You cannot delete yourself"
//     );
//   }

//   const user = await admin.auth().getUserByEmail(data.email);
//   return admin.auth().deleteUser(user.uid);
// });
