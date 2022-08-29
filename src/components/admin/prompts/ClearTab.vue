<template>
  <div class="text-center">
    <v-dialog
      v-model="clearTabMenu"
      scrollable
      fullscreen
      :overlay="true"
      max-width="300px"
      max-height="120px"
      transition="dialog-transition"
    >
      <template v-slot:activator="{ props }">
        <v-btn color="error" v-bind="props">
          <v-icon>mdi-close-circle</v-icon> Clear All
        </v-btn>
      </template>
      <v-card>
        <v-card-title> Clear this tab? </v-card-title>
        <v-card-subtitle> This action cannot be undone. </v-card-subtitle>
        <v-card-actions>
          <v-btn color="success" @click="clearTab()"> Yes </v-btn>
          <v-btn color="error" @click="clearTabMenu = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ClearTab",
  data() {
    return {
      clearTabMenu: false,
    };
  },
  props: {
    uid: {
      type: String,
      required: true,
    },
  },
  methods: {
    async clearTab() {
      this.clearTabMenu = false;
      const docRef = doc(db, `users/${this.uid}`);
      await updateDoc(docRef, {
        tab: [],
      });
    },
  },
});
</script>
