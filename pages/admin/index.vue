<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});

const router = useRouter();
router.push("/admin/staff");
</script>

<template>
  <div class="h-full flex flex-col justify-center items-center">
    <span class="loading loading-infinity loading-lg" />
  </div>
</template>
