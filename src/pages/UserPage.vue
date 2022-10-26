<template>
  <v-container align="center" v-if="user !== null && items !== null">
    <v-row>
      <v-col>
        <h1>{{ user?.info.displayName }}'s Tab</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <add-item :items="items" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              Tab
              <v-spacer />
              Total: {{ total() }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in items" :key="index">
                    <tr v-if="count()[item.name] > 0">
                      <td>{{ item.name }}</td>
                      <td>{{ count()[item.name] }}</td>
                      <td>
                        {{
                          new Intl.NumberFormat("en-CA", {
                            style: "currency",
                            currency: "CAD",
                          }).format(item.price)
                        }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title> History </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-pagination v-model="page" :length="MathTime()" />
              <v-table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in visibleItems" :key="index">
                    <tr v-if="count()[item.name] > 0">
                      <td>{{ item.name }}</td>
                      <td>
                        {{
                          new Intl.NumberFormat("en-CA", {
                            style: "currency",
                            currency: "CAD",
                          }).format(item.price)
                        }}
                      </td>
                      <td>
                        {{ item.date.toDate().toLocaleDateString() }}
                      </td>
                      <td>
                        {{ item.date.toDate().toLocaleTimeString() }}
                      </td>
                      <delete-item :item="item" v-if="canDelete(item.date)" />
                    </tr>
                  </template>
                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
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
import { computed, defineAsyncComponent, onBeforeUnmount, ref } from "vue";
import { auth, db } from "utils/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import type { User, Item } from "types";

// components
const AddItem = defineAsyncComponent(
  () => import("@/components/userPage/AddItemToTab.vue")
);
const DeleteItem = defineAsyncComponent(
  () => import("@/components/userPage/DeleteItemFromTab.vue")
);

// props
const page = ref(1);
const perPage = 10;
const user = ref<User | null>(null);
const items = ref<Item[]>([]);
const itemSub = onSnapshot(doc(db, "admin/items"), (doc) => {
  items.value = doc.data()?.food as Item[];
});

// @ts-expect-error
const userSub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
  user.value = doc.data() as User;
  user.value.tab.reverse();
});

onBeforeUnmount(() => {
  itemSub();
  userSub();
});
// computed properties
const count = () => {
  const total = {} as { [key: string]: number };
  items.value.forEach((item) => {
    total[item.name] = 0;
  });
  user.value?.tab.forEach((item) => {
    total[item.name]++;
  });
  return total;
};

const total = () => {
  let total = 0;
  user.value?.tab?.forEach((item) => {
    total += item.price;
  });
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(total);
};

const visibleItems = computed(() => {
  return user.value?.tab.slice(
    (page.value - 1) * perPage,
    page.value * perPage
  );
});

const canDelete = (date: Timestamp) => {
  const now = new Date();
  const diff = now.getTime() - date.toDate().getTime();
  return diff < 300000;
};

// methods
const MathTime = () => {
  if (user.value?.tab.length) {
    return Math.ceil(user.value.tab.length / perPage);
  }
};
</script>
