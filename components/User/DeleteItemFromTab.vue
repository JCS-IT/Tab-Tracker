<script setup lang="ts">
import type { TabItem } from "@/types";
import { error } from "console";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { useToast } from "vue-toastification";

// composables
const auth = useFirebaseAuth();
const db = useFirestore();
const toast = useToast();

// props
const { item } = defineProps<{
  item: TabItem;
}>();

// data
const dialog = ref<HTMLDialogElement | null>(null);
const loading = ref(false);

// methods
const deleteItem = async () => {
  loading.value = true;
  try {
    const user = auth?.currentUser;
    if (!user) {
      throw new Error("User not logged in");
    }

    const userDoc = doc(db, "users", user.uid);
    await updateDoc(userDoc, {
      tab: arrayRemove(item),
    });

    toast.success(`${item.name} deleted from tab`);
    dialog.value?.close();
  } catch (err) {
    const { code, message } = err as { code: string; message: string };

    const errorMessage = `${code}: ${message}`;

    toast.error(errorMessage);
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  dialog.value?.close();
  loading.value = false;
};
</script>

<template>
  <button class="btn" @click="dialog?.showModal()">
    <Icon name="mdi:delete" />
  </button>
  <dialog class="modal" ref="dialog">
    <div class="modal-box">
      <div class="modal-content">
        <div class="p-5">
          <h2 class="text-2xl font-bold">Delete Item</h2>
          <p class="text-lg">
            Are you sure you want to delete {{ item.name }} from your tab?
          </p>
        </div>
        <div class="modal-action">
          <button class="btn btn-error" @click="deleteItem" :disabled="loading">
            <Icon name="mdi:delete" />
            Delete
          </button>
          <button class="btn" @click="cancel" :disabled="loading">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>
