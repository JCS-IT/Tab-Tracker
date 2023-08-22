<script setup lang="ts">
import { mdiCog } from "@mdi/js";
import { useTheme } from "vuetify";

// composables
const theme = useTheme();
const prefersDark = usePreferredDark();
const auth = useFirebaseAuth();
const router = useRouter();
// const route = useRoute();

// data
const loggedIn = ref(false);

// computed
auth?.onAuthStateChanged((user) => {
  if (!user) {
    router.push("/login");
  }

  loggedIn.value = !!user;
});

if (prefersDark.value) {
  theme.global.name.value = "dark";
} else {
  theme.global.name.value = "light";
}
</script>

<template>
  <VApp>
    <VAppBar app>
      <VAppBarTitle>
        <RouterLink to="/user"> JCS Tabs </RouterLink>
      </VAppBarTitle>
      <UserProfile />
    </VAppBar>
    <VMain>
      <VContainer fluid>
        <Suspense>
          <RouterView v-slot="{ Component, route }">
            <Transition
              :name="(route.meta.transition as string) || ''"
              mode="out-in"
              appear
            >
              <div :key="route?.name?.toString()">
                <component :is="Component" />
              </div>
            </Transition>
          </RouterView>
        </Suspense>
      </VContainer>
    </VMain>
  </VApp>
</template>

<style scoped>
a {
  color: white;
  text-decoration: none;
}
</style>
