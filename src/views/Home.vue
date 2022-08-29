<template>
  <v-container align="center">
    <v-row>
      <v-col>
        <v-card color="blue-lighten-2" width="300px">
          <v-card-title> Please wait... </v-card-title>
          <v-card-text>
            <v-progress-circular indeterminate />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/firebase";

export default defineComponent({
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.$router.push("/login");
      } else {
        this.$router.push("/user");
      }
    });
  },
});
</script>
