<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title>JCS Tabs</v-toolbar-title>
      <v-spacer />
      <UserMenu v-if="loggedIn" />
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { auth } from "@/firebase";

export default defineComponent({
  name: "App",
  components: {
    UserMenu: defineAsyncComponent(() => import("@/components/UserMenu.vue")),
  },
  data() {
    return {
      loggedIn: false,
    };
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
        this.$router.push("/login");
      }
    });
  },
});
</script>

<style>
* {
  text-decoration: none;
}
</style>
