<template>
  <RouterView v-slot="{ Component }">
    <VSlideXTransition>
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </VSlideXTransition>
  </RouterView>
  <VBottomNavigation>
    <VTabs v-model="page">
      <VTab value="staff">
        <VIcon>mdi-account-school</VIcon>
        Staff
      </VTab>
      <VTab value="items">
        <VIcon>mdi-package</VIcon>
        Items
      </VTab>
    </VTabs>
  </VBottomNavigation>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const page = ref("staff");

router.push("/admin/staff");

watch(
  () => page.value,
  (value) => {
    router.push(`/admin/${value}`);
  }
);
</script>
