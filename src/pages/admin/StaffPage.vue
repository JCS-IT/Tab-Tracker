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
  <VContainer fluid v-if="users !== null && items !== null">
    <VRow>
      <VExpansionPanels v-model="panels" multiple>
        <template v-for="letter in letters" :key="letter">
          <VExpansionPanel
            :id="letter"
            :value="letter"
            class="mb-2"
            v-if="filterUsers(letter).length > 0"
          >
            <VExpansionPanelTitle>
              <VRow>
                <VCol cols="12">
                  <b class="text-h5">{{ letter.toUpperCase() }}</b>
                </VCol>
              </VRow>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <template v-for="user in filterUsers(letter)" :key="user">
                <UserComponent
                  :user="user"
                  :items="items"
                  :ref="user.info.uid"
                />
              </template>
            </VExpansionPanelText>
          </VExpansionPanel>
        </template>
      </VExpansionPanels>
    </VRow>
  </VContainer>
  <VContainer v-else fluid align="center">
    <VRow>
      <VCol cols="12">
        <VProgressLinear indeterminate />
      </VCol>
    </VRow>
  </VContainer>
</template>
