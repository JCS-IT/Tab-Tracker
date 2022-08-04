<template>
  <v-navigation-drawer permanent width="190">
    <v-container grid-list-xs align="space-between">
      <v-row>
        <v-col>
          <router-link :to="`/user/${userID}`">
            <v-btn color="error" width="140" class="mb-5">
              <v-icon>mdi-home</v-icon> Your Tab
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            :color="active == 'staff' ? 'success' : 'info'"
            @click="active = 'staff'"
            width="140"
            class="mb-5"
          >
            <v-icon>mdi-account</v-icon>
            Staff Menu
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            :color="active == 'item' ? 'success' : 'info'"
            @click="active = 'item'"
            width="140"
          >
            <v-icon class="mr-2">mdi-food</v-icon>
            Item Menu
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
  <StaffMenu v-if="active == 'staff'" />
  <ItemMenu v-if="active == 'item'" />
</template>

<script>
import { auth } from "../firebase";
import StaffMenu from "/src/components/admin/StaffMenu.vue";
import ItemMenu from "@/components/admin/ItemMenu.vue";

export default {
  data() {
    return {
      active: "staff",
      userID: auth.currentUser.uid,
    };
  },
  components: {
    StaffMenu,
    ItemMenu,
  },
};
</script>
