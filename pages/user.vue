<script setup lang="ts">
import UseVirtualList from "@vueuse/components";
import type { Items, TabItem, User } from "@/types";
import { Timestamp, doc } from "firebase/firestore";
import { sumTab } from "@/utils";

definePageMeta({
  middleware: "auth",
});

// firebase
const db = useFirestore();
const auth = useFirebaseAuth();

const items = useDocument<Items>(doc(db, "admin", "items"));
const userDoc = useDocument<User>(doc(db, `users/${auth?.currentUser?.uid}`));

// computed
const dedupedTab = computed(() => dedupeArray(userDoc.data.value?.tab ?? []));

const isLoading = computed(() => {
  if (items.pending.value || userDoc.pending.value) {
    return true;
  } else {
    return false;
  }
});

const total = computed(() =>
  formatCurrency(sumTab(userDoc.data.value?.tab ?? []))
);

// methods
const canDelete = (date: Timestamp, paid: Boolean) => {
  const now = new Date();
  const diff = now.getTime() - date.toDate().getTime();
  return diff < 300000 && !paid;
};
</script>

<template>
  <div class="flex justify-center h-full" v-if="isLoading">
    <span class="loading loading-infinity w-[5rem]" />
  </div>
  <div class="grid justify-center gap-5" v-if="userDoc && items">
    <UserAddItemToTab :items="items?.food" />
    <div class="card w-full shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center">Recent Transactions</h2>
        <div class="overflow-y-auto">
          <table class="table w-full table-zebra">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in userDoc?.tab
                    .filter((e: TabItem) => !e.paid)
                    .reverse()"
                :key="item.name"
              >
                <td>{{ item.name }}</td>
                <td>{{ formatCurrency(item.price) }}</td>
                <td>{{ item.date.toDate().toLocaleDateString() }}</td>
                <td>{{ item.date.toDate().toLocaleTimeString() }}</td>
                <td>
                  <UserDeleteItemFromTab
                    v-if="canDelete(item.date, item.paid)"
                    :item="item"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card w-full shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center">Summary</h2>
        <div class="overflow-y-auto">
          <table class="table w-full table-zebra">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in dedupedTab" :key="index">
                <tr v-if="countItemsInTab(userDoc?.tab)[item.name] > 0">
                  <td>{{ item.name }}</td>
                  <td>
                    {{ countItemsInTab(userDoc.tab)[item.name] }}
                  </td>
                  <td>
                    {{ formatCurrency(item.price) }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="grid grid-cols-2">
          <ClearTab
            v-if="userDoc?.tab.filter((i) => !i.paid).length > 0"
            :email="userDoc?.info.email"
          />
          <div v-else />
          <h1 class="text-center mt-[5%]">Total: {{ total }}</h1>
        </div>
      </div>
    </div>

    <div tabindex="0" class="collapse collapse-arrow bg-base-100 shadow-lg">
      <div class="collapse-title">
        <h1 class="text-center">
          <Icon name="mdi:history" />
          History
        </h1>
      </div>
      <div class="overflow-y-auto collapse-content">
        <table class="table w-full table-zebra">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in reverseTab(userDoc?.tab)"
              :key="index"
              v-memo="userDoc.tab"
            >
              <td>{{ item.name }}</td>
              <td>{{ formatCurrency(item.price) }}</td>
              <td>{{ item.date.toDate().toLocaleDateString() }}</td>
              <td>{{ item.date.toDate().toLocaleTimeString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
