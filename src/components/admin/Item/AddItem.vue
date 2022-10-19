<template>
  <VBtn color="green-lighten-2" @click="dialog = true"> Add Item </VBtn>
  <VDialog v-model="dialog" persistent width="300px">
    <VCard :loading="loading" :disabled="loading">
      <VAlert v-if="error">
        <VAlertTitle>Error Occurred</VAlertTitle>
        {{ error }}
      </VAlert>
      <VCardTitle>
        <span class="headline">Add Item</span>
      </VCardTitle>
      <VCardText>
        <VForm ref="itemInput" lazy-validation>
          <VTextField
            label="Item Name"
            variant="outlined"
            v-model="input.name"
            :rules="rules.name"
            @keyup.enter="addItem"
          />
          <VTextField
            label="Item Price"
            variant="outlined"
            type="number"
            v-model="input.price"
            prefix="$"
            :rules="rules.price"
            @keyup.enter="addItem"
          />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn color="green-lighten-2" @click="addItem" :loading="loading">
          Submit
        </VBtn>
        <VBtn
          color="red"
          @click="
            input.name = '';
            input.price = null;
            dialog = false;
          "
        >
          Cancel
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
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
  ],
};
const input = ref({
  name: "",
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
    input.value.name = "";
    input.value.price = null;
    dialog.value = false;
  } catch (err) {
    console.error(err);
    error.value = err as string;
  } finally {
    loading.value = false;
  }
};
</script>
