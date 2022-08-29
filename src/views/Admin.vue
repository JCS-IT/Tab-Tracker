<template>
  <v-navigation-drawer permanent width="190">
    <v-container>
      <v-tabs direction="vertical" v-model="active">
        <v-btn color="error" @click="$router.push('/')">
          <v-icon>mdi-home</v-icon>
          <span>Home</span>
        </v-btn>
        <v-tab value="staff">
          <v-icon>mdi-account-school</v-icon>
          <span>Staff</span>
        </v-tab>
        <v-tab value="items">
          <v-icon>mdi-package</v-icon>
          <span>Items</span>
        </v-tab>
      </v-tabs>
    </v-container>
  </v-navigation-drawer>
  <v-window v-model="active">
    <v-window-item value="staff">
      <v-container fluid>
        <v-row>
          <v-col>
            <StaffMenu />
          </v-col>
        </v-row>
      </v-container>
    </v-window-item>
    <v-window-item value="items">
      <v-container fluid>
        <v-row>
          <v-col>
            <ItemMenu />
          </v-col>
        </v-row>
      </v-container>
    </v-window-item>
  </v-window>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
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
