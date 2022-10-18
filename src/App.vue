<template>
  <VApp>
    <VToolbar color="blue-lighten-2">
      <VToolbarTitle> JCS Tabs </VToolbarTitle>
    </VToolbar>
    <VMain>
      <RouterView />
    </VMain>
    <VFooter absolute app color="blue-lighten-2">
      <VContainer>
        <VRow>
          <VCol cols="12" class="text-center">
            <FeedBack />
          </VCol>
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
