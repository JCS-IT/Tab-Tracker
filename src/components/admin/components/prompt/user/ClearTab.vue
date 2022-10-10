<template>
  <v-dialog v-model="dialog" max-width="300px">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="red" :loading="dialog"> Clear Tab </v-btn>
    </template>
    <v-card :disabled="loading" :loading="loading">
      <v-card-title>Are you sure?</v-card-title>
      <v-card-subtitle>this action cannot be undone.</v-card-subtitle>
      <v-card-text>
        Are you sure you want to clear the tab for <strong>{{ name }}</strong
        >?
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          @click="clearTab()"
          :disabled="loading"
          :loading="loading"
        >
          Confirm
        </v-btn>
        <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { functions } from "@/firebase";
import { httpsCallable } from "@firebase/functions";

export default defineComponent({
  name: "ClearTab",
  props: {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      error: "",
    };
  },
  methods: {
    async clearTab() {
      this.loading = true;
      try {
        const clearTab = httpsCallable(functions, "clearTab");
        await clearTab({ email: this.email });
        this.dialog = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
