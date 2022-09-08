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
import { defineComponent } from "vue";
import UserMenu from "@/components/public/UserMenu.vue";

export default defineComponent({
  name: "NavBar",
  components: {
    UserMenu,
  },
});
</script>
