import { auth, firestore } from "firebase-admin";
import * as functions from "firebase-functions";

export const toggleRole = functions.https.onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Unknown origin"
    );
  }
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be an admin"
    );
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
    throw new functions.https.HttpsError(error.code, error.message);
  }
});
