<template>
  <div class="text-center">
    <v-dialog
      v-model="clearTabMenu"
      scrollable
      fullscreen
      :overlay="true"
      max-width="300px"
      max-height="220px"
      transition="dialog-transition"
    >
      <template v-slot:activator="{ props }">
        <v-btn color="error" v-bind="props">
          <v-icon>mdi-close-circle</v-icon> Clear All
        </v-btn>
      </template>
      <v-card>
        <v-card-title> Are you sure you want to clear the tab? </v-card-title>
        <v-card-text> Note: This action can not be undone </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="clearTab()"> Yes </v-btn>
          <v-btn color="error" @click="clearTabMenu = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default {
  name: "ClearTab",
  data() {
    return {
      clearTabMenu: false,
    };
  },
  methods: {
    async clearTab() {
      this.clearTabMenu = false;
      const docRef = doc(db, `staff/${this.$route.params.id}`);
      await updateDoc(docRef, {
        tab: [],
      });
    },
  },
};
</script>
