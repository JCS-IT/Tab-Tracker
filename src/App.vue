<template>
  <v-app>
    <v-app-bar color="blue-lighten-2">
      <v-toolbar-title>JCS Tab Tracker</v-toolbar-title>
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
      <UserMenu />
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { useTheme } from "vuetify";

export default defineComponent({
  name: "App",
  components: {
    UserMenu: defineAsyncComponent({
      loader: () => import("./components/UserMenu.vue"),
    }),
  },
  setup() {
    const theme = useTheme();
    return {
      theme,
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
    this.theme.global.name.value = localStorage.getItem("theme") || "light";
  },
});
</script>

<style>
* {
  text-decoration: none;
}
</style>
