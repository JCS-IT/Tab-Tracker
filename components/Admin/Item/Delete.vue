<script setup lang="ts">
import type { Item } from "@/types";
import { useToast } from "vue-toastification";

const { item } = defineProps<{
  item: Item;
  class?: string;
}>();

const toast = useToast();

const dialog = ref<HTMLDialogElement | null>(null);
const loading = ref(false);

// methods
const deleteItem = async () => {
  try {
    await callCloudFunction("deleteItem", { item });

    toast.success(`'${item.name}' deleted successfully`);
    close();
  } catch (err) {
    toast.error(`${err}`);
  }
};

const close = () => {
  dialog.value?.close();
  loading.value = false;
};
</script>

<template>
  <button
    class="btn btn-sm btn-ghost rounded-none rounded-r-xl"
    @click="dialog?.showModal()"
  >
    <Icon name="mdi:delete" class="text-red-500" size="24" />
  </button>
  <dialog ref="dialog" class="modal">
    <form method="dialog" class="modal-box w-[20rem] grid gap-4">
      <h3 class="font-bold text-lg">
        Are you sure you want to delete
        <span class="font-weight-bold">{{ item.name }}</span
        >?
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <button class="btn btn-error" @click="deleteItem()">Confirm</button>
        <button class="btn btn-success" @click="close()">Cancel</button>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop" @submit="close()">
      <button>close</button>
    </form>
  </dialog>
</template>
