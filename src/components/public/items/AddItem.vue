<script setup lang="ts">
import { ref, defineProps } from "vue";
import { auth, db } from "@/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import type { Item } from "@/types";
import { useDisplay } from "vuetify";

const { mobile, width } = useDisplay();
const props = defineProps<{
  items: Item[];
}>();

let dialog = ref(false);
let loading = ref({} as Record<string, boolean>);
let error = ref({
  code: null,
  message: null,
});

props.items.forEach((item) => {
  loading.value[item.name] = false;
});

const addItem = async (item: Item) => {
  loading.value[item.name] = true;
  try {
    await updateDoc(doc(db, `users/${auth.currentUser?.uid}`), {
      tab: arrayUnion({
        ...item,
        date: Timestamp.now(),
      }),
    });
  } catch (err) {
    error.value = {
      // @ts-ignore
      code: err.code,
      // @ts-ignore
      message: err.message,
    };
    console.error(err);
  } finally {
    loading.value[item.name] = false;
    dialog.value = false;
  }
};
</script>

<template>
  <VBtn
    color="green-lighten-2"
    :loading="dialog"
    :disabled="dialog"
    @click="dialog = true"
  >
    Add Item
  </VBtn>
  <VDialog
    v-model="dialog"
    :fullscreen="mobile"
    :maxWidth="mobile ? width : '500px'"
    minWidth="330px"
  >
    <VAlert color="error" v-if="error.code">
      <VAlertTitle>{{ error.code }}</VAlertTitle>
      {{ error.message }}
    </VAlert>
    <VCard>
      <VCardTitle align="center">
        <span class="headline">Add Item</span>
      </VCardTitle>
      <VCardText>
        <VBtn
          color="green-accent-1"
          v-for="(item, index) in items"
          :key="index"
          :loading="loading[item.name]"
          :disabled="loading[item.name]"
          @click="addItem(item)"
          class="ma-1"
          width="100%"
        >
          {{ item.name }}:
          {{
            new Intl.NumberFormat("en-CA", {
              style: "currency",
              currency: "CAD",
            }).format(item.price)
          }}
        </VBtn>
      </VCardText>
      <VCardActions>
        <VBtn color="red" @click="dialog = false"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
