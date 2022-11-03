<template>
  <v-menu rounded v-if="user !== null">
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar>
          <v-img :src="(user?.photoURL as string)" />
        </v-avatar>
      </v-btn>
    </template>
    <v-card color="user">
      <v-card-text class="mx-auto text-center">
        <v-avatar size="large">
          <v-img :src="(user?.photoURL as string)" alt="Avatar" />
        </v-avatar>
        <h3>{{ user?.displayName }}</h3>
        <p class="text-caption mt-1">{{ user?.email }}</p>
        <template v-if="admin">
          <v-divider class="my-3" />
          <v-btn
            rounded
            variant="text"
            color="auto"
            @click="router.push('/admin/staff')"
            prepend-icon="admin_panel_settings"
          >
            admin menu
          </v-btn>
        </template>
        <v-divider class="my-3" />
        <v-btn
          rounded
          variant="text"
          color="auto"
          @click="logout()"
          prepend-icon="logout"
        >
          logout
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import type { User } from "firebase/auth";

// data
const user = ref<User | null>(null);
const admin = ref(false);
const router = useRouter();
// eslint-disable-next-line no-undef

auth.onAuthStateChanged((currentUser) => {
  if (currentUser) {
    currentUser?.getIdTokenResult().then((idTokenResult) => {
      admin.value = idTokenResult.claims.admin;
    });
    user.value = currentUser;
  } else {
    user.value = null;
  }
});

// methods
const logout = () => {
  auth.signOut();
};
</script>
