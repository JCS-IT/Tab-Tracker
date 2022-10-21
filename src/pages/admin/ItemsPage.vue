<template>
  <VContainer fluid v-if="items.length > 0 && visibleItems().length > 0">
    <VRow class="text-center">
      <VCol>
        <AddItem />
      </VCol>
    </VRow>
    <VRow align="center">
      <VCol v-for="(item, index) in visibleItems()" :key="index">
        <ItemComponent :items="items" :input="item" />
      </VCol>
    </VRow>
  </VContainer>
  <VContainer v-else fluid>
    <VRow align="center">
      <VCol cols="12">
        <VProgressLinear indeterminate />
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
const page = ref(1);
const perPage = ref(20);

const visibleItems = () => {
  return items.value.slice(
    (page.value - 1) * perPage.value,
    page.value * perPage.value
  );
};

const itemSnap = onSnapshot(doc(db, "admin/items"), (doc) => {
  if (doc.exists()) {
    items.value = doc.data().food as Item[];
  }
});

if (!auth.currentUser) {
  itemSnap();
}
</script>
