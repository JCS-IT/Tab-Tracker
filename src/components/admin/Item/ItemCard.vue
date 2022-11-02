<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-card
    width="200px"
    :loading="loading.update || loading.delete"
    :disabled="loading.update"
  >
    <v-alert v-if="error != null">
      {{ error }}
    </v-alert>
    <v-card-title>
      {{ input.name }}
    </v-card-title>
    <v-card-text class="pb-0">
      <v-form>
        <v-text-field
          label="Price"
          variant="outlined"
          type="number"
          v-model="input.price"
          prefix="$"
          :rules="rules.price"
          @keyup.enter="updateItem()"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="updateItem()" color="green" :loading="loading.update">
        Update
      </v-btn>
      <DeleteItem :item="input" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Item } from "@/types";

// props
const props = defineProps<{
  input: Item;
  items: Item[];
}>();

// data
const loading = ref({
  update: false,
  delete: false,
  dialog: false,
});

const error = ref(null as string | null);
const rules = {
  price: [(v: number) => !!v || "Price is required"],
};

// methods
const updateItem = async () => {
  loading.value.update = true;
  try {
    await httpsCallable(
      functions,
      "updateItem"
    )({
      items: props.items,
    });
  } catch (err) {
    console.error(err);
    error.value = err as string;
  } finally {
    loading.value.update = false;
  }
};
</script>
