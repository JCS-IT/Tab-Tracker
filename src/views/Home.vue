<template>
  <v-container>
    <v-row v-if="!loggedIn">
      <v-col align="center">
        <h1>Please login to use this app</h1>
      </v-col>
    </v-row>
    <v-container v-if="isAdmin && loggedIn">
      <v-row>
        <v-col align="center">
          <router-link :to="`/user?id=${userID}`">
            <v-btn color="success" width="110px">Your Tab</v-btn>
          </router-link>
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center">
          <router-link to="/admin">
            <v-btn color="error" width="110px">Admin Page</v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
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
        if (docSnap.data().isAdmin) {
          this.userID = user.uid;
          this.isAdmin = true;
        } else {
          this.$router.push(`/user?id=${user.uid}`);
        }
      } else {
        await setDoc(docRef, {
          name: user.displayName,
          tab: [],
          isAdmin: false,
        });
        this.$router.push(`/user?id=${user.uid}`);
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
