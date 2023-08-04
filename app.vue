<script setup lang="ts">
const auth = useFirebaseAuth();

auth?.onAuthStateChanged(() => {});
</script>

<template>
  <div class=""></div>
</template>
