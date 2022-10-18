<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue";
import { auth, db } from "@/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import type { User, Item } from "@/types";
import { onBeforeRouteLeave } from "vue-router";

// components
const AddItem = defineAsyncComponent(
  () => import("@/components/public/items/AddItem.vue")
);
const DeleteItem = defineAsyncComponent(
  () => import("@/components/public/items/DeleteItem.vue")
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

onBeforeRouteLeave(() => {
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

const isCurrentDate = (date: Timestamp) => {
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

<template>
  <VContainer align="center">
    <VRow>
      <VCol>
        <h1>{{ user?.info?.displayName }}'s Tab</h1>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <AddItem :items="items" />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VExpansionPanels>
          <VExpansionPanel>
            <VExpansionPanelTitle>
              Tab
              <VSpacer />
              Total: {{ total() }}
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VTable density="compact">
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
              </VTable>
            </VExpansionPanelText>
          </VExpansionPanel>
          <VExpansionPanel>
            <VExpansionPanelTitle> History </VExpansionPanelTitle>
            <VExpansionPanelText class="pa-0">
              <VPagination v-model="page" :length="MathTime()" />
              <VTable>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
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
                      <td v-if="isCurrentDate(item.date)">
                        <DeleteItem :item="item" />
                      </td>
                    </tr>
                  </template>
                </tbody>
              </VTable>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
    </VRow>
  </VContainer>
</template>
