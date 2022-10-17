<script setup lang="ts">
import { ref } from "vue";
import { functions } from "@/firebase";
import { httpsCallable } from "@firebase/functions";
import type { Item } from "@/types";

const loading = ref({
  pending: false,
  confirm: false,
});
const dialog = ref(false);
const error = ref(null as string | null);

const props = defineProps<{
  item: Item;
}>();

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

<template>
  <VDialog v-model="dialog" max-width="350px" align="center">
    <template v-slot:activator>
      <VBtn
        color="red"
        :loading="loading.pending"
        @click="
          dialog = true;
          loading.pending = true;
        "
      >
        Delete
      </VBtn>
    </template>
    <VCard :loading="loading.confirm" :disabled="loading.confirm">
      <VAlert v-if="error != null">
        {{ error }}
      </VAlert>
      <VCardTitle> Are you sure? </VCardTitle>
      <VCardSubtitle> This will permanently delete this item. </VCardSubtitle>
      <VCardActions>
        <VBtn @click="deleteItem()" color="red" :loading="loading.confirm">
          Delete
        </VBtn>
        <VBtn
          @click="
            dialog = false;
            loading.pending = false;
          "
          color="green"
        >
          Cancel
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
