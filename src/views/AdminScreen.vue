<template>
  <VWindow v-model="active">
    <VWindowItem value="staff">
      <StaffMenu />
    </VWindowItem>
    <VWindowItem value="items">
      <ItemMenu />
    </VWindowItem>
  </VWindow>
  <VBottomNavigation>
    <VTabs v-model="active">
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

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "Admin-view",
  data() {
    return {
      active: "staff",
    };
  },
  components: {
    StaffMenu: defineAsyncComponent(
      () => import("@/components/admin/menus/StaffMenu.vue")
    ),
    ItemMenu: defineAsyncComponent(
      () => import("@/components/admin/menus/ItemMenu.vue")
    ),
  },
});
</script>
