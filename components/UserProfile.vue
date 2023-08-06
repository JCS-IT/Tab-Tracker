<script setup lang="ts">
const user = useCurrentUser();
const auth = useFirebaseAuth();
const router = useRouter();
const route = useRoute();

const claims = ref({
  admin: false,
  ward: "",
});

auth?.onAuthStateChanged(async (user) => {
  if (!user) {
    claims.value = {
      admin: false,
      ward: "",
    };
    return;
  }
  await user?.getIdTokenResult().then((result) => {
    const { admin, ward } = result.claims as { admin: boolean; ward: string };
    claims.value = {
      admin: admin || false,
      ward,
    };
  });
});
</script>

<template>
  <div class="dropdown dropdown-end" v-if="user">
    <button
      tabindex="0"
      class="btn btn-circle btn-ghost avatar"
      title="user profile"
    >
      <div class="w-10 rounded-full">
        <img :src="(user.photoURL as string)" referrerpolicy="no-referrer" />
      </div>
    </button>
    <div
      tabindex="0"
      class="dropdown-content z-[1] menu shadow bg-base-200 rounded-box w-[8rem]"
    >
      <div v-if="!!claims.admin">
        <button class="btn btn-ghost w-full" @click="$router.push('/admin')">
          <Icon name="mdi:shield" />
          Admin
        </button>
      </div>
      <button
        class="btn btn-ghost"
        @click="
          auth?.signOut();
          router.push('/');
        "
      >
        <Icon name="mdi:logout" />
        Logout
      </button>
    </div>
  </div>
  <div v-else>
    <button
      class="btn btn-ghost"
      @click="router.push(`/login?r=${route.fullPath}`)"
    >
      Login
    </button>
  </div>
</template>
