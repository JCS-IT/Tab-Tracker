<template>
  <VContainer fluid>
    <VRow>
      <VExpansionPanels v-model="panels" multiple>
        <VExpansionPanel
          v-for="letter in letters"
          :key="letter"
          :id="letter"
          :value="letter"
          class="mb-2"
        >
          <VExpansionPanelTitle>
            <b>{{ letter.toUpperCase() }}</b>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <template v-for="user in filterUsers(letter)" :key="user">
              <UserComponent
                :user="user"
                :items="items"
                :ref="user?.info?.email"
              />
            </template>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { db } from "@/firebase";
import type { User, Item } from "@/types";
import { doc, collection, onSnapshot } from "@firebase/firestore";
import { onBeforeRouteLeave } from "vue-router";

const UserComponent = defineAsyncComponent(
  () => import("@/components/admin/components/UserComponent.vue")
);

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

const filterUsers = (letter: string) => {
  return users?.value.filter((user: User) => {
    return user.info.displayName
      .split(" ")[1]
      ?.toLowerCase()
      .startsWith(letter);
  });
};
</script>
