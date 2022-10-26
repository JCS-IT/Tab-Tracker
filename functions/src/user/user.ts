import {HttpsError, onCall} from "firebase-functions/v1/https";

export const clearTab = onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new HttpsError("permission-denied", "Unknown origin");
  }
  if (!context?.auth?.token.admin) {
    throw new HttpsError(
        "permission-denied",
        "You must be an admin to clear the tab"
    );
  }

  const {firestore, auth} = await import("firebase-admin");
  let user = null;
  if (data.uid == undefined) {
    user = await auth().getUserByEmail(data.email);
  } else {
    user = await auth().getUser(data.uid);
  }
  return firestore().doc(`users/${user.uid}`).update({
    tab: [],
  });
});

export const toggleRole = onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new HttpsError("failed-precondition", "Unknown origin");
  }
  if (!context.auth?.token.admin) {
    throw new HttpsError("permission-denied", "You must be an admin");
  }
  if (data.uid == undefined) {
    throw new HttpsError("invalid-argument", "Missing uid");
  }

  const {auth, firestore} = await import("firebase-admin");

  const {uid, role} = data;

  const user = await auth().getUser(uid);

  return async () => {
    await auth().setCustomUserClaims(user.uid, {
      [role]: !user.customClaims?.[role],
    });
    await firestore()
        .doc(`users/${user.uid}`)
        .update({
          roles: {
            [role]: !user.customClaims?.[role],
          },
        });
  };
});
