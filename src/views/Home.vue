<template>
  <v-container>
    <v-row v-if="!loggedIn">
      <v-col align="center">
        <h1>Please login to use this app</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "@firebase/firestore";

export default {
  data() {
    return {
      loggedIn: false,
      isAdmin: false,
      userID: "",
    };
  },
  methods: {
    async init(user) {
      const docRef = doc(db, `staff/${user.uid}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.$router.push(`/user/${user.uid}`);
      } else {
        await setDoc(docRef, {
          name: user.displayName,
          tab: [],
          isAdmin: false,
        });
        this.$router.push(`/user/${user.uid}`);
      }
    },
  },
  async mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
        this.init(user);
      } else {
        this.loggedIn = false;
        this.isAdmin = false;
      }
    });
  },
};
</script>
