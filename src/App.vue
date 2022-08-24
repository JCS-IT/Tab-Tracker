<template>
  <v-theme-provider :theme="theme" root>
    <v-app>
      <v-app-bar color="primary">
        <v-toolbar-title>JCS Tabs</v-toolbar-title>
        <v-spacer />
        <v-tooltip v-if="theme == 'light'">
          <template v-slot:activator="{ props }">
            <v-btn @click="theme = 'dark'">
              <v-icon v-bind="props">mdi-white-balance-sunny</v-icon>
            </v-btn>
          </template>
          <span>Toggle Dark Mode</span>
        </v-tooltip>
        <v-tooltip v-else>
          <template v-slot:activator="{ props }">
            <v-btn @click="theme = 'light'">
              <v-icon v-bind="props">mdi-weather-night</v-icon>
            </v-btn>
          </template>
          <span>Toggle Light Mode</span>
        </v-tooltip>
        <UserMenu v-if="loggedIn" />
      </v-app-bar>
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </v-theme-provider>
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
      theme: "light",
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
