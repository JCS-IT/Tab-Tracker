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

const mode = import.meta.env.MODE;
</script>

<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon @click="$router.go(0)" icon="mdi-home" />
      <v-app-bar-title>
        JCS Tabs
        <template v-if="mode === 'development'">
          <v-chip color="info" label>DEV</v-chip>
        </template>
      </v-app-bar-title>
      <UserProfile v-if="loggedIn" />
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
    <v-fade-transition>
      <v-footer
        app
        color="primary"
        height="64px"
        v-if="loggedIn && route.path === '/user'"
      >
        <v-container>
          <v-row justify="center" no-gutters>
            <FeedBack />
          </v-row>
        </v-container>
      </v-footer>
    </v-fade-transition>
  </v-app>
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
