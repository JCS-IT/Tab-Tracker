<template>
  <v-container v-if="items.length > 0">
    <v-row class="text-center">
      <v-col>
        <AddItem />
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col v-for="(item, index) in items" :key="index" align="center">
        <ItemCard :items="items" :input="item" />
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
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
import type { Item } from "@/types";

// components
const AddItem = defineAsyncComponent(
  () => import("@/components/admin/Item/AddItem.vue")
);
const ItemCard = defineAsyncComponent(
  () => import("@/components/admin/Item/ItemCard.vue")
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
