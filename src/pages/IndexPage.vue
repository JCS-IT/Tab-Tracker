<template>
  <v-container fluid align="center">
    <v-row>
      <v-col>
        <v-progress-circular indeterminate />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const router = useRouter();

auth.onAuthStateChanged((user) => {
  if (user) {
    router.push("/user");
  } else {
    router.push("/login");
  }
});
</script>

<route lang="json">
{
  "path": "/",
  "name": "Index",
  "component": "IndexPage"
}
</route>
