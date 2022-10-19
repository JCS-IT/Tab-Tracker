<template>
  <VContainer fluid align="center">
    <VRow>
      <VCol>
        <AddItem />
      </VCol>
    </VRow>
    <VRow>
      <VCol v-for="(item, index) in items" :key="index">
        <VLazy>
          <ItemComponent :items="items" :input="item" />
        </VLazy>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { auth, db } from "utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { Item } from "types";

// components
const AddItem = defineAsyncComponent(
  () => import("@/components/admin/Item/AddItem.vue")
);
const ItemComponent = defineAsyncComponent(
  () => import("@/components/admin/Item/ItemComponent.vue")
);

// data
const items = ref([] as Item[]);
const itemSnap = onSnapshot(doc(db, "admin/items"), (doc) => {
  if (doc.exists()) {
    items.value = doc.data().food as Item[];
  }
});

if (!auth.currentUser) {
  itemSnap();
}
</script>
