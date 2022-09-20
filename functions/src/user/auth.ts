import { auth } from "firebase-functions";
import { apps } from "firebase-admin";

export const beforeCreated = auth.user().beforeCreate(async (event) => {
  const { email } = event;
  if (!email?.endsWith("@educbe.ca")) {
    const { HttpsError } = await import("firebase-functions/v1/auth");
    throw new HttpsError(
      "permission-denied",
      "You must be in the educbe.ca domain to create an account"
    );
  }
});

export const onCreate = auth.user().onCreate(async (user) => {
  const { email, displayName, photoURL } = user;

  if (apps.length === 0) {
    const { initializeApp } = await import("firebase-admin");
    initializeApp();
  }

  const { firestore } = await import("firebase-admin");

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
  const { firestore } = await import("firebase-admin");
  return firestore().doc(`users/${user.uid}`).delete();
});
