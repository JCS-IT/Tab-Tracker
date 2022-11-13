<template>
  <v-dialog v-model="dialog" max-width="400px" align="center">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="red" depressed @click="dialog = true">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
    <v-card :loading="loading" :disabled="loading">
      <v-alert
        v-if="error.code !== null"
        type="error"
        variant="outlined"
        prominent
        class="text-center"
        elevation="2"
      >
        <v-alert-title>
          {{ error.code }}
        </v-alert-title>
        {{ error.message }}
      </v-alert>
      <v-card-title class="text-center">
        <span>Delete Item</span>
      </v-card-title>
      <v-card-subtitle>
        {{ props.item?.name }} at
        {{ props.item?.date.toDate().toLocaleString() }}
      </v-card-subtitle>
      <v-card-text>
        <span> Are you sure you want to delete this item? </span>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="green"
          @click="deleteItem"
          :loading="loading"
          :disabled="loading"
        >
          Delete
        </v-btn>
        <v-btn color="red" @click="cancel()"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { auth, db } from "utils/firebase";
import { updateDoc, doc, arrayRemove } from "firebase/firestore";
import type { TabItem } from "@/types";

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
