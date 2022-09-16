<template>
  <v-menu rounded>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props" :disabled="user == null">
        <v-avatar>
          <v-img :src="(user?.photoURL as string)" alt="Avatar" />
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
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
            @click="$router.push({ name: 'Admin' })"
          >
            admin menu
          </v-btn>
        </template>
        <v-divider class="my-3" />
        <v-btn rounded variant="text" @click="logout()"> logout </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
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
