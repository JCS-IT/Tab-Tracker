import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

exports.beforeCreate = functions.auth.user().beforeCreate((user, context) => {
  if (context != null) {
    // dont allow user unless they are in the allowed domain
    if (!user.email?.endsWith("@educbe.ca")) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You must be in the educbe.ca domain to create an account"
      );
    }
  } else {
    throw new functions.https.HttpsError("permission-denied", "Unknown origin");
  }
});

export const setUpFirestore = functions.auth
  .user()
  .onCreate((user, context) => {
    if (context != null) {
      return () => {
        admin
          .firestore()
          .collection("users")
          .doc(user.uid)
          .set({
            name: user.displayName,
            tab: [],
          })
          .catch((err) => {
            return err;
          });
      };
    } else {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Unknown origin"
      );
    }
  });

export const setUpUserClaims = functions.auth
  .user()
  .onCreate((user, context) => {
    if (context != null) {
      return () => {
        admin
          .auth()
          .setCustomUserClaims(user.uid, { admin: false })
          .catch((err) => {
            return err;
          });
      };
    } else {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Unknown origin"
      );
    }
  });
