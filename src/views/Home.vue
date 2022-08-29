<template>
  <v-container align="center" justify="center">
    <v-card width="200" height="200">
      <v-card-text>
        Redirecting
        <br />
        Please wait...
      </v-card-text>
      <v-progress-circular indeterminate />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/firebase";
export default defineComponent({
  name: "Home",
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$router.push(`/user`);
      } else {
        this.$router.push("/login");
      }
    });
  },
});
</script>
