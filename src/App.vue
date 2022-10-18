<template>
  <VApp>
    <VMain>
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
