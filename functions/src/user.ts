import { auth, firestore } from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import {
  FunctionsErrorCode,
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";
import type { ClearHistory, ClearTab, ToggleRole } from "../../src/types";
import { TabItem } from "@/types";

export const clearTab = onCall<ClearTab>(
  { enforceAppCheck: true },
  async (event) => {
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

      await firestore().runTransaction(async (t) => {
        const currentTab: TabItem[] = await t.get(userRef).then((doc) => {
          return doc.data()?.tab;
        });

        const tabTotal = currentTab
          .filter((i) => i.paid)
          .reduce((acc, item) => acc + item.price, 0);

        currentTab
          .filter((item) => !item.paid)
          .forEach((item) => {
            item.paid = true;
          });

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
      });
      return true;
    } catch (error) {
      const { code, message } = error as {
        code: FunctionsErrorCode;
        message: string;
      };
      throw new HttpsError(code, message);
    }
  },
);

export const clearHistory = onCall<ClearHistory>(
  { enforceAppCheck: true },
  async (event) => {
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

export const toggleRole = onCall<ToggleRole>(
  { enforceAppCheck: true },
  async (event) => {
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
