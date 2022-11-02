<template>
  <router-view v-slot="{ Component }">
    <Transition name="slide-x-transition" mode="out-in">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </Transition>
  </router-view>
  <v-bottom-navigation>
    <v-tabs v-model="page">
      <v-tab value="staff">
        <v-icon icon="mdi-account-school" />
        Staff
      </v-tab>
      <v-tab value="items">
        <v-icon icon="mdi-package" />
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
