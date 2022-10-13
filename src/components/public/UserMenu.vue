<script setup lang="ts">
import { ref } from "vue";
import { auth } from "@/firebase";
import type { User } from "firebase/auth";

const user = ref<User | null>(null);
const admin = ref(false);
auth.onAuthStateChanged((currentUser) => {
  currentUser?.getIdTokenResult().then((idTokenResult) => {
    admin.value = idTokenResult.claims.admin;
  });
  user.value = currentUser;
});
</script>

<template>
  <VMenu rounded>
    <template v-slot:activator="{ props }">
      <VBtn icon v-bind="props">
        <VAvatar>
          <VImg :src="(user?.photoURL as string)" alt="Avatar" />
        </VAvatar>
      </VBtn>
    </template>
    <VCard>
      <VCardText class="mx-auto text-center">
        <VAvatar size="large">
          <VImg :src="(user?.photoURL as string)" alt="Avatar" />
        </VAvatar>
        <h3>{{ user?.displayName }}</h3>
        <p class="text-caption mt-1">{{ user?.email }}</p>
        <template v-if="admin">
          <VDivider class="my-3" />
          <VBtn rounded variant="text" @click="$router.push({ name: 'Admin' })">
            admin menu
          </VBtn>
        </template>
        <VDivider class="my-3" />
        <VBtn rounded variant="text" @click="auth.signOut"> logout </VBtn>
      </VCardText>
    </VCard>
  </VMenu>
</template>
