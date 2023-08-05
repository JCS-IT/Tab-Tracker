<script setup lang="ts">
const router = useRouter();
const auth = useFirebaseAuth();

// Methods
const logout = async () => {
  await auth?.signOut();
  router.push("/");
};
</script>

<template>
  <button
    class="btn btn-ghost"
    v-if="!auth?.currentUser"
    @click="router.push('/login')"
  >
    Login
  </button>
  <menu class="menu" v-else> </menu>
</template>
