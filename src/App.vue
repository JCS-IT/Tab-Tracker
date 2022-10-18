<template>
  <VApp>
    <VToolbar color="blue-lighten-2">
      <VToolbarTitle> JCS Tabs </VToolbarTitle>
    </VToolbar>
    <VMain>
      <notifications class="ma-4" />
      <RouterView />
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { auth } from "utils/firebase";
import { useRouter } from "vue-router";

const router = useRouter();

auth.onAuthStateChanged((user) => {
  if (user) {
    router.push("/user");
  } else {
    router.push("/login");
  }
});
</script>
