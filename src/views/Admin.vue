<template>
  <v-window v-model="active">
    <v-window-item value="staff">
      <StaffMenu />
    </v-window-item>
    <v-window-item value="items">
      <ItemMenu />
    </v-window-item>
  </v-window>
  <v-bottom-navigation>
    <v-tabs v-model="active">
      <v-tab @click="$router.push({ name: 'Home' })">
        <v-icon>mdi-home</v-icon>
        Home
      </v-tab>
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
