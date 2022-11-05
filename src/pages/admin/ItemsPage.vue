<template>
  <v-container v-if="items.length">
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
    <v-row>
      <v-col align="center">
        <h1>Fetching items...</h1>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="12">
        <v-progress-linear indeterminate />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Item } from "@/types";

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

<route lang="json">
{
  "name": "ItemsPage",
  "path": "/admin/items",
  "component": "./ItemsPage.vue",
  "meta": {
    "requiresAuth": true,
    "requiresAdmin": true
  }
}
</route>
