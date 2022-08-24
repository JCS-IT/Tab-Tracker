<template>
  <v-theme-provider :theme="theme.global.name.value" root>
    <v-app>
      <v-app-bar color="primary">
        <v-toolbar-title>JCS Tabs</v-toolbar-title>
        <v-spacer />
        <v-tooltip v-if="theme.global.name.value == 'light'">
          <template v-slot:activator="{ props }">
            <v-btn @click="toggleTheme()">
              <v-icon v-bind="props">mdi-white-balance-sunny</v-icon>
            </v-btn>
          </template>
          <span>Toggle Dark Mode</span>
        </v-tooltip>
        <v-tooltip v-else>
          <template v-slot:activator="{ props }">
            <v-btn @click="toggleTheme()">
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
import { useTheme } from "vuetify";

export default defineComponent({
  name: "App",
  components: {
    UserMenu: defineAsyncComponent(() => import("@/components/UserMenu.vue")),
  },
  setup() {
    const theme = useTheme();
    return {
      theme,
    };
  },
  data() {
    return {
      loggedIn: false,
    };
  },
  methods: {
    toggleTheme() {
      this.theme.global.name.value = this.theme.global.current.value.dark
        ? "light"
        : "dark";
      localStorage.setItem("theme", this.theme.global.name.value);
    },
  },
  mounted() {
    const theme = localStorage.getItem("theme");
    if (theme) {
      this.theme.global.name.value = theme;
    }
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
