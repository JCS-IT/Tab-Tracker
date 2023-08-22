import { auth } from "firebase-functions";

export const beforeCreate = auth.user().beforeCreate(async (user) => {
  if (!user.email?.endsWith("@educbe.ca")) {
    const { HttpsError } = await import("firebase-functions/v1/auth");
    throw new HttpsError(
      "permission-denied",
      "You must be in the educbe.ca domain to create an account"
    );
  }
});

export const onCreate = auth.user().onCreate(async (user) => {
  const { email, displayName, photoURL } = user;

  const { firestore } = await import("firebase-admin");

  await firestore().doc(`users/${user.uid}`).set({
    info: {
      email,
      displayName,
      photoURL,
    },
    tab: [],
    roles: {},
  });

  await firestore()
    .doc("admin/_index")
    .update({
      users: firestore.FieldValue.arrayUnion({
        uid: user.uid,
        email,
        displayName,
        photoURL,
      }),
    });

  return true;
});

export const onDelete = auth.user().onDelete(async (user) => {
  const { firestore } = await import("firebase-admin");
  await firestore().doc(`users/${user.uid}`).delete();
  await firestore()
    .doc("admin/_index")
    .update({
      users: firestore.FieldValue.arrayRemove({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }),
    });
  return true;
});
