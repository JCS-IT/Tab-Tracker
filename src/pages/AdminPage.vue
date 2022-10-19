<template>
  <!-- <KeepAlive>
    <RouterView v-slot="{ Component }">
      <VSlideXTransition>
        <component :is="Component" />
      </VSlideXTransition>
    </RouterView>
  </KeepAlive> -->

  <VWindow v-model="page">
    <VWindowItem value="staff">
      <Staff />
    </VWindowItem>
    <VWindowItem value="items">
      <Items />
    </VWindowItem>
  </VWindow>
  <VBottomNavigation>
    <VTabs v-model="page">
      <VTab value="staff">
        <VIcon>mdi-account-school</VIcon>
        Staff
      </VTab>
      <VTab value="items">
        <VIcon>mdi-package</VIcon>
        Items
      </VTab>
    </VTabs>
  </VBottomNavigation>
</template>

<script setup lang="ts">
import { ref, watch, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";

const page = ref("staff");
const router = useRouter();

// router.push("/admin/staff");

const Staff = defineAsyncComponent(() => import("./views/AdminStaffView.vue"));
const Items = defineAsyncComponent(() => import("./views/AdminItemsView.vue"));

// if the page is changed, push the new page to the router
// watch(page, (newPage: string) => {
//   router.push(`/admin/${newPage}`);
// });
</script>
