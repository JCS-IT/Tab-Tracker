<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon
        @click="$router.push('/')"
        color="auto"
        icon="mdi-home"
      />
      <v-app-bar-title>
        JCS Tabs
        <template v-if="mode">
          <v-chip label>DEV</v-chip>
        </template>
      </v-app-bar-title>
      <v-fade-transition>
        <v-btn icon @click="toggleTheme" color="auto">
          <v-icon>{{
            theme.global.name.value === "light"
              ? "mdi-white-balance-sunny"
              : "mdi-weather-night"
          }}</v-icon>
        </v-btn>
      </v-fade-transition>
      <UserProfile v-if="loggedIn" />
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <Transition name="fade-transition" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </v-container>
    </v-main>
    <v-fade-transition>
      <v-footer
        app
        color="primary"
        height="64px"
        v-if="loggedIn && $route.path === '/user'"
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

<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import { auth } from "utils/firebase";
import { useTheme } from "vuetify";
import { useRouter } from "vue-router";

// data
const loggedIn = ref(false);
const theme = useTheme();
const mode = import.meta.env.DEV;

const router = useRouter();

// computed
auth.onAuthStateChanged((user) => {
  if (user) {
    loggedIn.value = true;
  } else {
    router.push("/login");
    loggedIn.value = false;
  }
});

// methods
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  localStorage.setItem("theme", theme.global.name.value);
};

if (localStorage.getItem("theme")) {
  theme.global.name.value = localStorage.getItem("theme") as string;
}

// components
const FeedBack = defineAsyncComponent(
  () => import("@/components/FeedBack.vue")
);

const UserProfile = defineAsyncComponent(
  () => import("@/components/UserProfile.vue")
);
</script>
