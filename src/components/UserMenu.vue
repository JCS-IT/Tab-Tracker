<template>
  <v-menu rounded>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar>
          <v-img :src="user?.photoURL" alt="Avatar" />
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <div class="mx-auto text-center">
          <v-avatar size="large">
            <v-img :src="user?.photoURL" alt="Avatar" />
          </v-avatar>
          <h3>{{ user?.displayName }}</h3>
          <p class="text-caption mt-1">{{ user?.email }}</p>
          <div v-if="admin">
            <v-divider class="my-3" />
            <router-link
              to="/admin"
              style="text-decoration: none; color: inherit"
            >
              <v-btn rounded variant="text">admin menu</v-btn>
            </router-link>
          </div>
          <v-divider class="my-3" />
          <v-btn rounded variant="text" @click="logout()"> logout </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/firebase";

export default defineComponent({
  name: "UserMenu",
  data() {
    return {
      user: null as any,
      admin: false as unknown,
    };
  },
  methods: {
    logout() {
      auth.signOut();
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
