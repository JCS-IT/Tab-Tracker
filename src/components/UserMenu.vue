<template>
  <v-menu rounded>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar>
          <v-img :src="user.photoURL" alt="Avatar" />
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <div class="mx-auto text-center">
          <v-avatar size="large">
            <v-img :src="user.photoURL" alt="Avatar" />
          </v-avatar>
          <h3>{{ user.displayName }}</h3>
          <p class="text-caption mt-1">{{ user.email }}</p>
          <v-divider class="my-3" />
          <v-btn rounded variant="text" @click="$emit('logout')">
            logout
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "UserMenu",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>
