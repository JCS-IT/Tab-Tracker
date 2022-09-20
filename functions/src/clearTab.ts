import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

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
