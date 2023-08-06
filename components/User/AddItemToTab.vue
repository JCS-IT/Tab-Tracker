<script setup lang="ts">
import { Item } from "@/types";
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useToast } from "vue-toastification";

const { items } = defineProps<{
  items: Item[];
}>();

const toast = useToast();
const auth = useFirebaseAuth();
const db = useFirestore();

// Data
const loading = ref<Record<string, boolean>>({});
const dialog = ref<HTMLDialogElement | null>(null);
const error = ref<string | null>(null);

items?.forEach((item) => {
  loading.value[item.name] = false;
});

// Methods
const addItem = async (item: Item) => {
  loading.value[item.name] = true;
  if (!auth?.currentUser) return;
  try {
    await updateDoc(doc(db, "users", auth.currentUser?.uid), {
      tab: arrayUnion({
        ...item,
        date: Timestamp.now(),
        paid: false,
      }),
    });
    toast.success(`${item.name}: ${formatCurrency(item.price)} added to tab`);
    close();
  } catch (err) {
    const { code, message } = err as { code: string; message: string };

    const errorMessage = `${code}: ${message}`;

    toast.error(errorMessage);
  }
};

const close = () => {
  dialog.value?.close();
  loading.value = {};
  error.value = null;
};
</script>

<template>
  <button class="btn btn-success shadow-lg" @click="dialog?.showModal()">
    <Icon name="mdi:plus-thick" />
    Add Item
  </button>
  <dialog class="modal" ref="dialog">
    <form method="dialog" class="modal-box">
      <div class="grid gap-2">
        <button
          v-for="item in items"
          :key="item.name"
          class="btn bg-base-300"
          @click="addItem(item)"
        >
          {{ item.name }}:
          {{ formatCurrency(item.price) }}
        </button>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
