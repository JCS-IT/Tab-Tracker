import { onCall, HttpsError } from "firebase-functions/v1/https";
import { firestore, auth } from "firebase-admin";

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
  const user = await auth().getUserByEmail(data.email);
  return firestore().doc(`users/${user.uid}`).update({
    tab: [],
  });
});
