<template>
  <v-container>
    <v-row>
      <v-col align="center">
        <h1>Please login to use this app</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
<<<<<<< Updated upstream
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
=======
import { defineComponent } from "vue";
import { auth } from "@/firebase";

export default defineComponent({
  name: "Home",
  methods: {
    async mounted() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.$router.push(`/user/${user.uid}`);
        }
      });
    },
  },
});
>>>>>>> Stashed changes
</script>
