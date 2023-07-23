<script setup lang="ts">
import { functions } from "@/firebase";
import { ItemSchema } from "@jcstabs/shared";
import { httpsCallable } from "firebase/functions";
import { useToast } from "vue-toastification";

// composables
const toast = useToast();

// data
const dialog = ref(false);
const loading = ref(false);
const error = ref(null as string | null);
const rules = {
  name: [(v: string) => !!v || "Item name is required"],
  price: [
    (v: any) => !isNaN(v) || "Item price must be a number",
    (v: number) => !!v || "Item price is required",
    (v: number) => v > 0 || "Item price must be greater than 0",
  ],
};

const input = ref({
  name: "" as string,
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
    const item = ItemSchema.parse({
      name: input.value.name,
      price: Number(input.value.price),
    });

    const addItem = httpsCallable(functions, "addItem");
    await addItem({
      item,
    });

    toast.success(`'${input.value.name}' added successfully`);
    close();
  } catch (err) {
    console.error(err);
    toast.error(`${err}`);
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

<template>
  <VBtn @click="dialog = true"> New Item </VBtn>
  <VDialog v-model="dialog" width="300px" @click:outside="close()">
    <VCard :loading="loading" :disabled="loading">
      <VAlert v-if="error" type="error">
        <VAlertTitle>Error Occurred</VAlertTitle>
        {{ error }}
      </VAlert>
      <VCardTitle>
        <span class="headline">New Item</span>
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
        <VBtn color="green" @click="addItem"> Submit </VBtn>
        <VBtn color="red" @click="close()"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
