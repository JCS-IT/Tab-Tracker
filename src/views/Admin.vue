<template>
  <v-navigation-drawer permanent>
    <v-container grid-list-xs align="space-between">
      <v-row>
        <v-col>
          <router-link to="/">
            <v-btn color="error"> Home </v-btn>
          </router-link>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            :color="active == 'staff' ? 'success' : 'info'"
            @click="active = 'staff'"
          >
            Staff Menu
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            :color="active == 'item' ? 'success' : 'info'"
            @click="active = 'item'"
          >
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
import StaffMenu from "../components/StaffMenu.vue";
import ItemMenu from "../components/ItemMenu.vue";
export default {
  data() {
    return {
      active: "staff",
    };
  },
  components: {
    StaffMenu,
    ItemMenu,
  },
};
</script>
