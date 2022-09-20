import { auth } from "firebase-functions";
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

export const onCreate = auth.user().onCreate(async (user) => {
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

export const onDelete = auth.user().onDelete(async (user) => {
  return firestore().doc(`users/${user.uid}`).delete();
});
