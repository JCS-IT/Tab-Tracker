<template>
  <v-app>
    <nav-bar />
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
    NavBar: defineAsyncComponent(
      () => import("@/components/public/NavBar.vue")
    ),
  },
});
</script>
