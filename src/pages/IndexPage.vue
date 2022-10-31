<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { auth } from "utils/firebase";

const router = useRouter();

auth.onAuthStateChanged((user) => {
  if (user) {
    router.push("/user");
  } else {
    router.push("/login");
  }
});
</script>
