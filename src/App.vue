<template>
  <VApp>
    <VToolbar color="blue-lighten-2">
      <VToolbarTitle> JCS Tabs </VToolbarTitle>
    </VToolbar>
    <VMain>
      <RouterView />
    </VMain>
    <VFooter app color="blue-lighten-2" height="64px">
      <VContainer>
        <VRow justify="center" no-gutters>
          <FeedBack />
        </VRow>
      </VContainer>
    </VFooter>
  </VApp>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { auth } from "utils/firebase";
import { useRouter } from "vue-router";

const FeedBack = defineAsyncComponent(
  () => import("@/components/FeedBack.vue")
);

const router = useRouter();

auth.onAuthStateChanged((user) => {
  if (user) {
    router.push("/user");
  } else {
    router.push("/login");
  }
});
</script>
