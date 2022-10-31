<template>
  <v-container fluid v-if="users !== null && items !== null">
    <v-row>
      <v-expansion-panels v-model="panels" multiple>
        <template v-for="letter in letters" :key="letter">
          <v-expansion-panel
            :id="letter"
            :value="letter"
            class="ma-2"
            v-if="filterUsers(letter).length > 0"
          >
            <v-expansion-panel-title>
              <v-row>
                <v-col cols="12">
                  <b class="text-h5">{{ letter.toUpperCase() }}</b>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <template v-for="user in filterUsers(letter)" :key="user">
                <UserCard :user="user" :items="items" :ref="user.info.uid" />
              </template>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </template>
      </v-expansion-panels>
    </v-row>
  </v-container>
  <v-container v-else fluid align="center">
    <v-row>
      <v-col cols="12">
        <v-progress-linear indeterminate />
      </v-col>
    </v-row>
  </v-container>
</template>

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
const UserCard = defineAsyncComponent(
  () => import("@/components/admin/User/UserCard.vue")
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
