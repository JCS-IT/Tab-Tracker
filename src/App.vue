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
  <v-app>
    <v-app-bar color="blue-lighten-2">
      <v-app-bar-nav-icon @click="$router.push('/')" icon="mdi-home" />
      <v-app-bar-title> JCS Tabs </v-app-bar-title>
      <user-profile v-if="loggedIn" />
    </v-app-bar>
    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
    <v-fade-transition>
      <v-footer
        app
        color="blue-lighten-2"
        height="64px"
        v-if="loggedIn && route.path === '/user'"
      >
        <v-container>
          <v-row justify="center" no-gutters>
            <feed-back />
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
