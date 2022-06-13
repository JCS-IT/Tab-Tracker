<template>
  <v-navigation-drawer permanent width="190">
    <v-container grid-list-xs align="space-between">
      <v-row>
        <v-col>
          <router-link to="/">
            <v-btn color="error" width="140" class="mb-5">
              <v-icon>mdi-home</v-icon> Home
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
    <template v-slot:append>
      <div class="pa-2">
        <v-btn color="success" @click="source">
          <v-icon class="mr-4">mdi-github</v-icon>
          <span>Source Code</span>
        </v-btn>
      </div>
    </template>
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
  methods: {
    source() {
      window.open("https://github.com/LeaderbotX400/JCSTabs", "_blank");
    },
  },
};
</script>
