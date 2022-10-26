<template>
  <v-container fluid v-if="items.length > 0 && visibleItems().length > 0">
    <v-row class="text-center">
      <v-col>
        <add-item />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col v-for="(item, index) in visibleItems()" :key="index">
        <item-component :items="items" :input="item" />
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else fluid>
    <v-row align="center">
      <v-col cols="12">
        <v-progress-linear indeterminate />
      </v-col>
    </v-row>
  </v-container>
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
