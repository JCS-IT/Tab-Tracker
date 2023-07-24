<script setup lang="ts">
import { functions } from "@/firebase";
import { type Item, type UpdateItem } from "@jcstabs/shared";
import { mdiPencil } from "@mdi/js";
import { httpsCallable } from "firebase/functions";

// composables
const props = defineProps<{
  input: Item;
  items: Item[];
}>();

// data
const loading = ref(false);
const dialog = ref(false);

const price = ref(props.input.price);

const error = ref(null as string | null);
const rules = {
  price: [
    (v: number) => !!v || "Price is required",
    (v: number) => v > 0 || "Price must be greater than 0",
    (v: any) => !isNaN(v) || "Price must be a number",
  ],
};

// methods
const updateItem = async () => {
  loading.value = true;
  try {
    const newItems = props.items.map((item) => {
      if (item.name === props.input.name) {
        return {
          ...item,
          price: Number(price.value),
        };
      }
      return item;
    });

    await httpsCallable<UpdateItem>(
      functions,
      "updateItem",
    )({
      items: newItems,
    });
  } catch (err) {
    console.error(err);
    error.value = err as string;
  } finally {
    loading.value = false;
    dialog.value = false;
  }
};
</script>

<template>
  <VDialog align="center" max-width="300px" v-model="dialog">
    <template #activator="{ props }">
      <VBtn v-bind="props" :icon="mdiPencil" variant="text" color="green" />
    </template>
    <VCard>
      <VCardTitle>
        {{ input.name }}
      </VCardTitle>
      <VCardText>
        <VForm>
          <VTextField
            label="Price"
            variant="outlined"
            type="number"
            v-model="price"
            prefix="$"
            :rules="rules.price"
            @keyup.enter="updateItem()"
          />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn
          color="green"
          variant="text"
          @click="updateItem()"
          :loading="loading"
        >
          Update
        </VBtn>
        <VBtn @click="dialog = false" color="red"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
