<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator>
      <v-btn
        color="red"
        :loading="loading.pending"
        @click="
          dialog = true;
          loading.pending = true;
        "
      >
        Delete
      </v-btn>
    </template>
    <v-card :loading="loading.confirm" :disabled="loading.confirm">
      <v-alert v-if="error != null">
        {{ error }}
      </v-alert>
      <v-card-title> Are you sure? </v-card-title>
      <v-card-subtitle>
        This will permanently delete this item.
      </v-card-subtitle>
      <v-card-actions>
        <v-btn @click="deleteItem()" color="red" :loading="loading.confirm">
          Delete
        </v-btn>
        <v-btn
          @click="
            dialog = false;
            loading.pending = false;
          "
          color="green"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { functions } from "@/firebase";
import { httpsCallable } from "@firebase/functions";
import type { Item } from "@/types";
export default defineComponent({
  data() {
    return {
      loading: {
        pending: false,
        confirm: false,
      },
      dialog: false,
      error: null as string | null,
    };
  },
  props: {
    item: {
      type: Object as () => Item,
      required: true,
    },
  },
  methods: {
    async deleteItem() {
      try {
        const deleteItem = httpsCallable(functions, "deleteItem");
        await deleteItem({ item: this.item });
        this.dialog = false;
      } catch (error) {
        console.log(error);
        this.error = error as string;
      } finally {
        this.loading = {
          pending: false,
          confirm: false,
        };
      }
    },
  },
});
</script>
