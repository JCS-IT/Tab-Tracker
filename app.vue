<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <div class="flex flex-col h-screen">
    <header class="navbar sticky top-0 p-4 z-[1] shadow-xl bg-base-100">
      <div class="navbar-start"></div>
      <div class="navbar-center">
        <button
          class="btn btn-ghost normal-case text-xl"
          @click="router.push('/user')"
        >
          JCSTabs
        </button>
      </div>
      <div class="navbar-end">
        <UserProfile />
      </div>
    </header>
    <main class="flex-grow p-0 sm:p-3">
      <Suspense>
        <NuxtPage />
      </Suspense>
    </main>
  </div>
</template>
