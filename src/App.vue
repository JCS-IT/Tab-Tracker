<template>
  <v-app>
    <v-app-bar color="blue-lighten-2">
      <v-app-bar-nav-icon
        @click="$router.push({ name: 'Home' })"
        icon="mdi-home"
      />
      <v-toolbar-title> JCS Tab Tracker </v-toolbar-title>
      <user-menu v-if="loggedIn" />
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { auth } from "./firebase";

export default defineComponent({
  name: "App",
  components: {
    UserMenu: defineAsyncComponent(
      () => import("@/components/public/UserMenu.vue")
    ),
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
      }
    });
  },
});
</script>
