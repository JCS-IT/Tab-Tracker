<template>
  <VDialog v-model="dialog" max-width="400px" align="center">
    <template v-slot:activator="{ props }">
      <VBtn v-bind="props" color="red" depressed @click="dialog = true">
        <VIcon>mdi-delete</VIcon>
      </VBtn>
    </template>
    <VCard :loading="loading" :disabled="loading">
      <VAlert
        v-if="error.code !== null"
        type="error"
        variant="outlined"
        prominent
        class="text-center"
        elevation="2"
      >
        <VAlertTitle>
          {{ error.code }}
        </VAlertTitle>
        {{ error.message }}
      </VAlert>
      <VCardTitle class="text-center">
        <span>Delete Item</span>
      </VCardTitle>
      <VCardSubtitle>
        {{ props.item?.name }} at
        {{ props.item?.date.toDate().toLocaleString() }}
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
        <VBtn color="red" @click="cancel()"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { auth, db } from "utils/firebase";
import { updateDoc, doc, arrayRemove } from "firebase/firestore";
import type { TabItem } from "types";

const dialog = ref(false);
const loading = ref(false);
const error = ref({
  code: null as string | null,
  message: null as string | null,
});

const props = defineProps<{
  item: TabItem;
}>();

const deleteItem = async () => {
  loading.value = true;
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not logged in");
    }
    const userDoc = doc(db, "users", user.uid);
    await updateDoc(userDoc, {
      tab: arrayRemove(props.item),
    });
    dialog.value = false;
  } catch (err) {
    // extract error code and message
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  dialog.value = false;
  loading.value = false;
  error.value = {
    code: null,
    message: null,
  };
};
</script>
