<script>
import { defineStore } from "pinia";
import { auth, db } from "../firebase";
import { onSnapshot, doc, setDoc } from "firebase/firestore";

export const useDataStore = defineStore({
  id: "items",
  state: () => ({
    items: [],
    user: null,
  }),
  getters: {
    getItems() {
      onSnapshot(doc(db, "items/foods"), (snapshot) => {
        this.items = snapshot.data().items;
      });
    },
    getUser() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          onSnapshot(doc(db, "users", user.uid), async (snapshot) => {
            if (snapshot.exists()) {
              console.log("User data: ", snapshot.data());
              this.user = snapshot.data();
            } else {
              await setDoc(docRef, {
                name: user.displayName,
                tab: [],
                admin: false,
              });
            }
          });
        } else {
          this.user = null;
        }
      });
    },
  },
});
</script>
