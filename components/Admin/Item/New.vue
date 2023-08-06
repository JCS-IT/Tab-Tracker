<script setup lang="ts">
import { useToast } from "vue-toastification";

const toast = useToast();

const dialog = ref<HTMLDialogElement | null>(null);
const loading = ref(false);
const input = ref({ name: "", price: null });

// methods
const addItem = async () => {
  loading.value = true;
  try {
    const item = {
      name: String(input.value.name),
      price: Number(input.value.price),
    };

    await callCloudFunction("addItem", { item });

    toast.success(`'${input.value.name}' added successfully`);
    close();
  } catch (err) {
    toast.error(`${err}`);
  } finally {
    loading.value = false;
  }
};

const close = () => {
  input.value.name = "";
  input.value.price = null;
  dialog.value?.close();
};
</script>

<template>
  <button class="btn btn-success" @click="dialog?.showModal()">New Item</button>
  <dialog ref="dialog" class="modal">
    <form
      method="dialog"
      class="modal-box w-[20rem] grid gap-4"
      @submit.prevent
    >
      <h3 class="font-bold text-lg">New Item</h3>
      <div class="grid justify-center gap-2">
        <input
          v-model="input.name"
          type="text"
          id="name"
          name="name"
          required
          placeholder="Item Name"
          class="input input-bordered"
        />
        <input
          v-model="input.price"
          type="number"
          id="price"
          name="price"
          required
          placeholder="Item Price"
          class="input input-bordered"
        />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button class="btn btn-success" @click="addItem()">Submit</button>
        <button class="btn btn-error" @click="close()">Cancel</button>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop" @submit="close()">
      <button>close</button>
    </form>
  </dialog>
</template>
