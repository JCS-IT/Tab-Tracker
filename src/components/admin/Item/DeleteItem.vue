<template>
  <v-dialog v-model="dialog" max-width="350px" align="center">
    <template #activator>
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

<script setup lang="ts">
import type { Item } from "@/types";

// props
const props = defineProps<{
  item: Item;
}>();

// data
const loading = ref({
  pending: false,
  confirm: false,
});
const dialog = ref(false);
const error = ref(null as string | null);

// methods
const deleteItem = async () => {
  try {
    loading.value.confirm = true;
    const deleteItem = httpsCallable(functions, "deleteItem");
    await deleteItem({ item: props.item });
    dialog.value = false;
  } catch (err) {
    console.log(err);
    error.value = err as string;
  } finally {
    loading.value = {
      pending: false,
      confirm: false,
    };
  }
};
</script>
