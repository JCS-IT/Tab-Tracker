<script setup lang="ts">
import { useToast } from "vue-toastification";
import type { Item } from "@/types";

const { item } = defineProps<{
  item: Item;
}>();

const toast = useToast();
const dialog = ref<HTMLDialogElement | null>(null);
const loading = ref(false);

const edit = ref<Item | null>(null);

onMounted(() => {
  edit.value = { ...item };
});

// methods
const updateItem = async () => {
  if (!edit.value) return;
  try {
    loading.value = true;
    await callCloudFunction("updateItem", { before: item, after: edit.value });

    toast.success(`'${item.name}' updated successfully`);
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
    class="btn btn-sm btn-ghost rounded-none rounded-l-xl"
    @click="dialog?.showModal()"
  >
    <Icon name="mdi:pencil" class="text-green-500" size="24" />
  </button>
  <dialog ref="dialog" class="modal" v-if="edit">
    <form
      method="dialog"
      class="modal-box w-[20rem] grid gap-4"
      @submit.prevent
    >
      <h3 class="font-bold text-lg text-center">
        {{ item.name }}
      </h3>
      <div class="grid justify-center">
        <div class="form-control w-full">
          <div class="relative">
            <Icon
              name="mdi:dollar"
              color="gray"
              size="20"
              class="absolute mt-[5.7%]"
            />
            <input
              type="number"
              placeholder="Price"
              class="input input-bordered w-full max-w-xs pl-[1.2rem] text-lg"
              v-model="edit.price"
            />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button class="btn btn-error" @click="updateItem()" :disabled="loading">
          <span v-if="loading">
            <span class="loading loading-infinity loading-lg" />
          </span>
          <span v-else>Confirm</span>
        </button>
        <button class="btn btn-success" @click="close()" :disabled="loading">
          Cancel
        </button>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop" @submit="close()">
      <button>close</button>
    </form>
  </dialog>
</template>
