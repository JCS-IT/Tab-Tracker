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
        <VBtn rounded variant="text" @click="logout()"> logout </VBtn>
      </VCardText>
    </VCard>
  </VMenu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/firebase";
import type { User } from "firebase/auth";

export default defineComponent({
  name: "UserMenu",
  data() {
    return {
      user: null as User | null,
      admin: false as unknown,
    };
  },
  methods: {
    logout() {
      auth.signOut();
      this.$router.push({ name: "Login" });
    },
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      this.user = user;
      user?.getIdTokenResult().then((token) => {
        this.admin = token.claims.admin;
      });
    });
  },
});
</script>
