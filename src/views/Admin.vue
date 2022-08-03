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
            :color="active == 'users' ? 'success' : 'info'"
            @click="active = 'users'"
            width="140"
            class="mb-5"
          >
            <v-icon>mdi-account</v-icon>
            Users Menu
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
  <UsersMenu v-if="active == 'users'" />
  <ItemMenu v-if="active == 'item'" />
</template>

<script>
import { auth } from "../firebase";
import UsersMenu from "@/components/admin/UsersMenu.vue";
import ItemMenu from "@/components/admin/ItemMenu.vue";

export default {
  data() {
    return {
      active: "users",
      userID: auth.currentUser.uid,
    };
  },
  components: {
    UsersMenu,
    ItemMenu,
  },
};
</script>
