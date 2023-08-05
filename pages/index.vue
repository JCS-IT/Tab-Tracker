<script setup lang="ts">
const auth = useFirebaseAuth();
const router = useRouter();

auth?.onAuthStateChanged((user) => {
  if (user) {
    router.push("/user");
  } else {
    router.push("/login");
  }
});
</script>

<template>
  <div class="h-full flex flex-col justify-center items-center">
    <span class="loading loading-infinity loading-lg" />
  </div>
</template>
