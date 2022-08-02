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
import { useDataStore } from "../stores/tabs";
import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc } from "@firebase/firestore";

const store = useDataStore();
export default {
  data() {
    return {
      loggedIn: false,
      admin: false,
      userID: "",
    };
  },
  methods: {
    async init(user) {
      if (docSnap.exists()) {
        this.$router.push(`/user/${user.uid}`);
      } else {
        await setDoc(docRef, {
          name: user.displayName,
          tab: [],
          admin: false,
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
        this.admin = false;
      }
    });
  },
};
</script>
