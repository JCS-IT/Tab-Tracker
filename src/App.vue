<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import { auth } from "utils/firebase";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const loggedIn = ref(false);

auth.onAuthStateChanged((user) => {
  if (user) {
    router.push("/user");
    loggedIn.value = true;
  } else {
    router.push("/login");
    loggedIn.value = false;
  }
});

const FeedBack = defineAsyncComponent(
  () => import("@/components/FeedBack.vue")
);

const UserProfile = defineAsyncComponent(
  () => import("@/components/UserProfile.vue")
);
</script>

<template>
  <VApp>
    <VAppBar color="blue-lighten-2">
      <VAppBarNavIcon @click="$router.push('/')" icon="mdi-home" />
      <VAppBarTitle> JCS Tabs </VAppBarTitle>
      <UserProfile v-if="loggedIn" />
    </VAppBar>
    <VMain>
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </VMain>
    <VFadeTransition>
      <VFooter
        app
        color="blue-lighten-2"
        height="64px"
        v-if="loggedIn && route.path === '/user'"
      >
        <VContainer>
          <VRow justify="center" no-gutters>
            <FeedBack />
          </VRow>
        </VContainer>
      </VFooter>
    </VFadeTransition>
  </VApp>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
