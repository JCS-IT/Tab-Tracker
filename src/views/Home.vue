<template>
  <v-container align="center">
    <v-row>
      <v-col>
        <v-card color="blue-lighten-2" width="300px">
          <v-card-title> Please wait... </v-card-title>
          <v-card-text>
            <v-progress-circular indeterminate />
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              @click="$router.push({ name: 'User' })"
            >
              stuck? click here
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/firebase";

export default defineComponent({
  name: "Home-view",
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.$router.push({ name: "Login" });
      } else {
        this.$router.push({ name: "User" });
      }
    });
  },
});
</script>
