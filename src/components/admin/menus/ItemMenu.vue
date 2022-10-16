<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { auth, db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { Item } from "@/types";

const AddItem = defineAsyncComponent(
  () => import("../components/prompt/items/AddItem.vue")
);
const ItemComponent = defineAsyncComponent(
  () => import("../components/ItemComponent.vue")
);

let items = ref<Item[]>([]);

const itemSnap = onSnapshot(doc(db, "admin/items"), (doc) => {
  if (doc.exists()) {
    items.value = doc.data().food as Item[];
  }
});

if (!auth.currentUser) {
  itemSnap();
}
</script>

<template>
  <VContainer fluid align="center">
    <VRow>
      <VCol>
        <AddItem />
      </VCol>
    </VRow>
    <VRow>
      <VCol v-for="item in items" :key="item.name">
        <ItemComponent :input="item" :items="items" />
      </VCol>
    </VRow>
  </VContainer>
</template>
