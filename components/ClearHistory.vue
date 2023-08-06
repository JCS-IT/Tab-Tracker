<script setup lang="ts">
import { useToast } from "vue-toastification";

const { email, name } = defineProps<{
  email: string;
  name: string;
}>();

// Composables
const toast = useToast();

// Data
const dialog = ref<HTMLDialogElement | null>(null);
const loading = ref(false);

// Methods
const clear = async () => {
  loading.value = true;
  try {
    await callCloudFunction("clearHistory", { email });

    dialog.value?.close();

    toast.success(`${name}'s history has been cleared.`);
  } catch (err) {
    console.log(err);
    const { code, message } = err as { code: string; message: string };

    toast.error(`${code}: ${message}`);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <button class="btn btn-ghost text-red-500" @click="dialog?.showModal()">
    Clear History
  </button>

  <dialog ref="dialog" class="modal">
    <form method="dialog" class="modal-box max-w-2xl" @submit.prevent>
      <h3 class="text-2xl">
        Are you sure you want to delete all history for
        <span class="font-bold">{{ name }}</span>
      </h3>
      <p>This action cannot be undone.</p>
      <div class="grid grid-cols-2 gap-2 mt-3">
        <button :class="`btn btn-error`" @click="clear" :disabled="loading">
          <span class="loading loading-infinity loading-lg" v-if="loading" />
          <span v-else>Confirm</span>
        </button>
        <button
          class="btn btn-success"
          @click="
            dialog?.close();
            loading = false;
          "
          :disabled="loading"
        >
          Cancel
        </button>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop" @submit="loading = false">
      <button>close</button>
    </form>
  </dialog>
</template>
