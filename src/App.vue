<template>
  <VApp>
    <VAppBar color="blue-lighten-2">
      <VAppBarNavIcon @click="$router.push({ name: 'Home' })" icon="mdi-home" />
      <VToolbarTitle>JCS Tabs</VToolbarTitle>
      <UserMenu v-if="loggedIn" />
    </VAppBar>
    <VMain>
      <RouterView />
    </VMain>
  </VApp>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { auth } from "./firebase";

export default defineComponent({
  name: "App",
  components: {
    UserMenu: defineAsyncComponent(
      () => import("@/components/public/UserMenu.vue")
    ),
  },
  data() {
    return {
      loggedIn: false,
    };
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
  },
});
</script>
