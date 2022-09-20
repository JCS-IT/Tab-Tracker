import { auth, firestore } from "firebase-admin";
// import * as functions from "firebase-functions";
import { onCall, HttpsError } from "firebase-functions/v1/https";

export const toggleRole = onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new HttpsError("failed-precondition", "Unknown origin");
  }
  if (!context.auth?.token.admin) {
    throw new HttpsError("permission-denied", "You must be an admin");
  }
  const { email, role } = data;
  const user = await auth().getUserByEmail(email);

  try {
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
  } catch (error) {
    throw new HttpsError(error.code, error.message);
  }
});
