import { auth, firestore } from "firebase-admin";
import {
  FunctionsErrorCode,
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";
import { Props, TabItem } from "./types";
import { getTabTotal } from "./utils";
import { Timestamp } from "firebase-admin/firestore";

export const clearTab = onCall(
  { enforceAppCheck: true },
  async (event: Props<{ email: string }>) => {
    if (
      !event?.auth?.token.admin ||
      event?.auth?.token.email !== event.data.email
    ) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to clear the tab",
      );
    }

    try {
      const user = await auth().getUserByEmail(event.data.email);
      const userRef = firestore().collection("users").doc(user.uid);

      return await firestore().runTransaction(async (t) => {
        const currentTab: TabItem[] = await t.get(userRef).then((doc) => {
          return doc.data()?.tab;
        });

        currentTab
          .filter((item) => !item.paid)
          .forEach((item) => {
            item.paid = true;
          });

        const tabTotal = getTabTotal(currentTab);

        const clearedTabItem: TabItem = {
          name: `Tab cleared by ${user.displayName}`,
          price: tabTotal * -1,
          date: Timestamp.now(),
          clearedBy: user.displayName,
          paid: true,
        };

        currentTab.push(clearedTabItem);

        t.update(userRef, {
          tab: currentTab,
        });

        return { message: "Tab cleared successfully" };
      });
    } catch (error) {
      const { code, message } = error as {
        code: FunctionsErrorCode;
        message: string;
      };
      throw new HttpsError(code, message);
    }
  },
);

export const clearHistory = onCall(
  { enforceAppCheck: true },
  async (event: Props<{ email: string }>) => {
    if (!event?.auth?.token.admin) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to clear the history",
      );
    }

    try {
      const user = await auth().getUserByEmail(event.data.email);
      return firestore().doc(`users/${user.uid}`).update({
        tab: [],
      });
    } catch (error) {
      const { code, message } = error as {
        code: FunctionsErrorCode;
        message: string;
      };
      throw new HttpsError(code, message);
    }
  },
);

export const toggleRole = onCall(
  { enforceAppCheck: true },
  async (event: Props<{ email: string; role: string }>) => {
    if (!event?.auth?.token.admin) {
      throw new HttpsError(
        "permission-denied",
        "You must be an admin to toggle roles",
      );
    }

    const { email, role } = event.data;

    try {
      const user = await auth().getUserByEmail(email);
      await auth()
        .setCustomUserClaims(user.uid, {
          [role]: !user.customClaims?.[role],
        })
        .catch((error) => {
          throw new HttpsError("unknown", error.message);
        });

      await firestore()
        .collection("users")
        .doc(user.uid)
        .update({
          roles: {
            [role]: !user.customClaims?.[role],
          },
        })
        .then(() => {
          return { message: `Success! ${email} is now ${role}` };
        });
    } catch (error) {
      const { code, message } = error as {
        code: FunctionsErrorCode;
        message: string;
      };
      throw new HttpsError(code, message);
    }
  },
);
