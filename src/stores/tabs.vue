<script>
import { defineStore } from "pinia";
import { auth, db } from "../firebase";
import { onSnapshot, doc, setDoc } from "firebase/firestore";

export const useDataStore = defineStore({
  id: "items",
  state: () => ({
    items: [],
    user: {
      name: "",
      tab: "",
    },
  }),
  getters: {
    getItems() {
      onSnapshot(doc(db, "items/foods"), (snapshot) => {
        this.items = snapshot.data().items;
      });
    },
    getCurrentUser() {
      onSnapshot(doc(db, "staff", auth.currentUser.uid), (snapshot) => {
        if (snapshot.exists()) {
        this.user.name = snapshot.data().name;
        this.user.tab = snapshot.data().tab;
        } else {
          await setDoc(docRef, {
          name: user.displayName,
          tab: [],
          admin: false,
        });
        }
      });
    },
  },
});
</script>
