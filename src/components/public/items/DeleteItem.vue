<script setup lang="ts">
import { ref, defineProps } from "vue";
import { auth, db } from "@/firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import type { TabItem } from "@/types";

const dialog = ref(false);
const loading = ref(false);
const error = ref({
  status: false,
  message: "",
});

const props = defineProps<{
  item: TabItem;
}>();

const deleteItem = async () => {
  loading.value = true;
  try {
    await updateDoc(doc(db, `users/${auth.currentUser?.uid}`), {
      tab: arrayRemove(props.item),
    });
  } catch (err) {
    error.value = {
      // @ts-ignore
      status: err.code,
      // @ts-ignore
      message: err.message,
    };
    console.error(err);
  } finally {
    loading.value = false;
    dialog.value = false;
  }
};
</script>

<template>
  <VBtn color="red" :loading="dialog" :disabled="dialog" @click="dialog = true">
    <VIcon>mdi-delete</VIcon>
  </VBtn>
  <VDialog
    v-model="dialog"
    overlay
    transition="dialog-transition"
    max-width="400px"
  >
    <VCard class="text-center">
      <VAlert
        v-if="error.status"
        type="error"
        :value="error"
        dismissible
        @input="error.status = false"
      >
        {{ error.message }}
      </VAlert>
      <VCardTitle>
        <span class="headline">Delete Item</span>
      </VCardTitle>
      <VCardSubtitle>
        {{ item?.name }} at {{ props.item?.date.toDate().toLocaleString() }}
      </VCardSubtitle>
      <VCardText>
        <span> Are you sure you want to delete this item? </span>
      </VCardText>
      <VCardActions>
        <VBtn
          color="green"
          @click="deleteItem"
          :loading="loading"
          :disabled="loading"
        >
          Delete
        </VBtn>
        <VBtn color="red" @click="dialog = false"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
