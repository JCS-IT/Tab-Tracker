<script setup lang="ts">
const router = useRouter();
const route = useRoute("admin");

const changeTarget = (newTarget: string) => {
  router.push(`/admin/${newTarget}`);
};
</script>

<template>
  <div>
    <RouterView />
    <div class="btm-nav">
      <button
        :class="route.fullPath.includes('staff') ? 'active' : ''"
        @click="changeTarget('staff')"
      >
        <Icon name="mdi:account-cog" />
        Staff
      </button>
      <button
        :class="route.fullPath.includes('items') ? 'active' : ''"
        @click="changeTarget('items')"
      >
        <Icon name="mdi:food" />
        Menu
      </button>
    </div>
  </div>
</template>
