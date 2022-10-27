<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { auth } from "@/firebase";

const UserMenu = defineAsyncComponent(
  () => import("@/components/public/UserMenu.vue")
);

const FeedBack = defineAsyncComponent(
  () => import("@/components/public/FeedBack.vue")
);

const mode = import.meta.env.MODE;
</script>

<template>
  <VApp>
    <VAppBar color="blue-lighten-2">
      <VAppBarNavIcon @click="$router.push({ name: 'Home' })" icon="mdi-home" />
      <VToolbarTitle>
        JCS Tabs
        <template v-if="mode === 'development'">
          <VChip label small>DEV</VChip>
        </template>
      </VToolbarTitle>
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
    <VFooter absolute app inset color="blue-lighten-2">
      <VRow>
        <VCol cols="12" class="text-center">
          <FeedBack />
        </VCol>
      </VRow>
    </VFooter>
  </VApp>
</template>
