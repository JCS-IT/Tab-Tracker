<template>
  <v-container fluid align="center">
    <v-row>
      <v-col>
        <v-progress-circular indeterminate />
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="json">
{
  "path": "/",
  "name": "Home",
  "meta": {
    "requiresAuth": false
  }
}
</route>

<script setup lang="ts">
// router
const router = useRouter();

definePage({
  path: "/",
  name: "Index",
});

// computed
auth.onAuthStateChanged((user) => {
  if (user) {
    router.push("/user");
  } else {
    router.push("/login");
  }
});
</script>
