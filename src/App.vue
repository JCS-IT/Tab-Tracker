<template>
  <v-app>
    <v-app-bar color="blue-lighten-2">
      <v-toolbar-title @click="$router.push({ name: 'Home' })">
        JCS Tab Tracker
      </v-toolbar-title>
      <user-menu />
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    UserMenu: defineAsyncComponent(
      () => import("@/components/public/UserMenu.vue")
    ),
  },
});
</script>
