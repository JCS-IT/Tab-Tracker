<template>
  <VContainer>
    <VRow>
      <RouterView v-slot="{ Component }">
        <VSlideXTransition>
          <component :is="Component" />
        </VSlideXTransition>
      </RouterView>
    </VRow>
    <VRow>
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
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const page = ref("staff");

router.push("/admin", page.value);
</script>
