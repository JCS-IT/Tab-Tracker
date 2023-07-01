<script setup lang="ts">
import { functions } from "@/firebase";
import type { Item } from "@/types";
import { mdiTrashCan } from "@mdi/js";
import { httpsCallable } from "firebase/functions";
import { useToast } from "vue-toastification";

// props
const props = defineProps<{
  item: Item;
}>();

// composables
const toast = useToast();

// data
const loading = ref(false);
const dialog = ref(false);
const error = ref(null as string | null);

// methods
const deleteItem = async () => {
  try {
    loading.value = true;
    const deleteItem = httpsCallable(functions, "deleteItem");
    await deleteItem({ item: props.item });

    toast.success(`'${props.item.name}' deleted successfully`);

    dialog.value = false;
  } catch (err) {
    console.log(err);

    toast.error(`${err}`);
    error.value = err as string;
  } finally {
    loading.value = false;
  }
};

// lifecycle
onUnmounted(() => {
  dialog.value = false;
  loading.value = false;
});
</script>

<template>
  <VDialog v-model="dialog" max-width="300px" align="center">
    <template #activator="{ props }">
      <VBtn v-bind="props" color="red" variant="text" :icon="mdiTrashCan" />
    </template>
    <VCard :loading="loading" :disabled="loading">
      <VAlert v-if="error != null">
        {{ error }}
      </VAlert>
      <VCardTitle class="text-wrap">
        Are you sure you want to delete
        <span class="font-weight-bold">{{ item.name }}</span
        >?
      </VCardTitle>
      <VCardSubtitle class="text-wrap">
        This will permanently delete
        <span class="font-weight-bold">{{ item.name }}</span> from the database.
        <br />
        <br />
        This action cannot be undone.
      </VCardSubtitle>
      <VCardActions>
        <VBtn @click="deleteItem()" color="red" :loading="loading"> Yes </VBtn>
        <VBtn
          @click="
            dialog = false;
            loading = false;
          "
          color="green"
        >
          No
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
