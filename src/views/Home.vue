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
import { useDataStore } from "../stores/tabs.vue";
import { auth } from "@/firebase";

const store = useDataStore();
export default {
  data() {
    return {
      loggedIn: false,
      admin: false,
    };
  },
  async mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
      this.admin = auth.currentUser.admin;
    });
  },
};
</script>
