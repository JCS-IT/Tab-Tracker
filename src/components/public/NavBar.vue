<template>
  <v-app-bar color="blue-lighten-2">
    <v-toolbar-title>
      <span class="text-h5">JCS Tab Tracker</span>
    </v-toolbar-title>
    <v-spacer />
    <user-menu />
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "NavBar",
  components: {
    UserMenu: defineAsyncComponent(() => import("./UserMenu.vue")),
  },
});
</script>
