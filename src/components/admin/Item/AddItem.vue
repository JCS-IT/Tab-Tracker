<template>
  <v-btn color="secondary" @click="dialog = true"> Add Item </v-btn>
  <v-dialog v-model="dialog" width="300px" @click:outside="close()">
    <v-card :loading="loading" :disabled="loading">
      <v-alert v-if="error" type="error" variant="outlined">
        <v-alert-title>Error Occurred</v-alert-title>
        hello!
        {{ error }}
      </v-alert>
      <v-card-title>
        <span class="headline">Add Item</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="itemInput" lazy-validation>
          <v-text-field
            label="Item Name"
            variant="outlined"
            v-model="input.name"
            :rules="rules.name"
            @keyup.enter="addItem"
          />
          <v-text-field
            label="Item Price"
            variant="outlined"
            type="number"
            v-model="input.price"
            prefix="$"
            :rules="rules.price"
            @keyup.enter="addItem"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green" @click="addItem" :loading="loading">
          Submit
        </v-btn>
        <v-btn color="red" @click="close()"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { functions } from "utils/firebase";
import { httpsCallable } from "@firebase/functions";

// data
const dialog = ref(false);
const loading = ref(false);
const error = ref(null as string | null);
const rules = {
  name: [(v: string) => !!v || "Item name is required"],
  price: [
    (v: number) => !!v || "Item price is required",
    (v: number) => v > 0 || "Item price must be greater than 0",
    (v: any) => !isNaN(v) || "Item price must be a number",
  ],
};

const input = ref({
  name: null as string | null,
  price: null as number | null,
});

const itemInput = ref(null);

// methods
const addItem = async () => {
  // @ts-expect-error
  const inputValidation = await itemInput.value?.validate();
  if (inputValidation.valid === false) return;
  loading.value = true;
  try {
    const addItem = httpsCallable(functions, "addItem");
    await addItem({ item: input.value });
    close();
  } catch (err) {
    console.error(err);
    error.value = err as string;
  } finally {
    loading.value = false;
  }
};

const close = () => {
  input.value.name = "";
  input.value.price = null;
  dialog.value = false;
};
</script>
