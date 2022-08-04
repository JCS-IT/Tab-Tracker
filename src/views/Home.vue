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
import { defineComponent } from "vue";
import { auth } from "@/firebase";

export default defineComponent({
  name: "Home",
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$router.push(`/user/${user.uid}`);
      } else {
      }
    });
  },
});
</script>
