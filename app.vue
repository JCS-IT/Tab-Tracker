<script setup lang="ts">
import { themeChange } from "theme-change";
themeChange();

const router = useRouter();
</script>

<template>
  <div class="flex flex-col h-screen">
    <header class="navbar sticky top-0 p-4 z-[1] shadow-xl">
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

<style>
body {
  @apply h-screen;
}

:root {
  @apply h-screen w-full;
}

body {
  @apply min-h-screen;
}

h1 {
  @apply font-bold;
}

h2 {
  @apply font-medium;
}

.divider {
  @apply my-5;
}
</style>
