<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { auth } from "@/firebase";

const UserMenu = defineAsyncComponent(
  () => import("@/components/public/UserMenu.vue")
);
</script>

<template>
  <VApp>
    <VAppBar color="blue-lighten-2">
      <VAppBarNavIcon @click="$router.push({ name: 'Home' })" icon="mdi-home" />
      <VToolbarTitle>JCS Tabs</VToolbarTitle>
      <UserMenu
        v-if="
          auth.onAuthStateChanged((user) => {
            return user ? true : false;
          })
        "
      />
    </VAppBar>
    <VMain>
      <RouterView />
    </VMain>
  </VApp>
</template>
