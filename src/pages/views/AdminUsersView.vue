<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { db } from "utils/firebase";
import { doc, collection, onSnapshot } from "@firebase/firestore";
import type { User, Item } from "@/types";
import { onBeforeRouteLeave } from "vue-router";

const users = ref<User[]>([]);
const panels = ref<string[]>([]);
const items = ref<Item[]>([]);

const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as string[];

// components
const UserComponent = defineAsyncComponent(
  () => import("@/components/admin/User/UserComponent.vue")
);

// firestore snapshots
const usersSnap = onSnapshot(collection(db, "users"), (snap) => {
  users.value = [];
  snap.forEach((doc) => {
    users.value.push(doc.data() as User);
  });
});

const itemSnap = onSnapshot(doc(db, "admin/items"), (doc) => {
  if (doc.exists()) {
    items.value = doc.data().food as Item[];
  }
});

onBeforeRouteLeave(() => {
  usersSnap();
  itemSnap();
});

// methods
const filterUsers = (letter: string) => {
  return users?.value.filter((user: User) => {
    return user.info.displayName
      .split(" ")[1]
      ?.toLowerCase()
      .startsWith(letter);
  });
};
</script>

<template>
  <VExpansionPanels v-model="panels">
    <template v-for="letter in letters" :key="letter">
      <VExpansionPanel
        :id="letter"
        :value="letter"
        class="mb-2"
        v-if="filterUsers(letter).length > 0"
      >
        <VExpansionPanelTitle>
          <VRow>
            <VCol cols="12" class="text-center">
              <b class="text-h5">{{ letter.toUpperCase() }}</b>
            </VCol>
          </VRow>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <UserComponent
            v-for="user in filterUsers(letter)"
            :key="user.info.uid"
            :user="user"
            :items="items"
            v-provide="user"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
    </template>
  </VExpansionPanels>
</template>
