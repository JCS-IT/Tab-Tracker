<template>
  <router-view v-slot="{ Component }">
    <v-slide-x-transition>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </v-slide-x-transition>
  </router-view>
  <v-bottom-navigation>
    <v-tabs v-model="page">
      <v-tab value="staff">
        <v-icon>mdi-account-school</v-icon>
        Staff
      </v-tab>
      <v-tab value="items">
        <v-icon>mdi-package</v-icon>
        Items
      </v-tab>
    </v-tabs>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const page = ref("staff");

router.push("/admin/staff");

watch(
  () => page.value,
  (value) => {
    router.push(`/admin/${value}`);
  }
);
</script>
