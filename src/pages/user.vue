<script setup lang="ts">
import type { TabItem, User } from "@/types";
import type { VDataTableHeaderProps } from "@/types";
import { countItemsInTab, dedupeArray, getTabTotal, virtualTab } from "@/utils";
import type { Timestamp } from "firebase/firestore";
import { useI18n } from "vue-i18n";
import { VDataTable } from "vuetify/labs/VDataTable";
import { VDataTableVirtual } from "vuetify/labs/VDataTable";

// composables
definePage({
  path: "/user",
  name: "user",
  meta: {
    requiresAuth: true,
    transition: "fade-transition",
  },
});

const router = useRouter();
const i18n = useI18n();

// firebase
const db = useFirestore();
const auth = useFirebaseAuth();

const items = useDocument(doc(db, "admin", "items"));
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
  i18n.n(getTabTotal(userDoc.data.value?.tab ?? []), "currency"),
);

// methods
const canDelete = (date: Timestamp, paid: Boolean) => {
  const now = new Date();
  const diff = now.getTime() - date.toDate().getTime();
  return diff < 300000 && !paid;
};

userDoc.error.value && router.push("/error");

const headers = {
  actions: [
    {
      title: "Item",
      key: "name",
      align: "center",
    },
    {
      title: "Price",
      key: "price",
      align: "center",
    },
    {
      title: "Date",
      key: "date",
      align: "center",
    },
    {
      title: "Time",
      key: "time",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      sortable: false,
    },
  ] as VDataTableHeaderProps[],
  noActions: [
    {
      title: "Item",
      key: "name",
      align: "center",
    },
    {
      title: "Price",
      key: "price",
      align: "center",
    },
    {
      title: "Date",
      key: "date",
      align: "center",
    },
    {
      title: "Time",
      key: "time",
      align: "center",
    },
  ] as VDataTableHeaderProps[],
};
</script>

<template>
  <VOverlay
    persistent
    :close-on-content-click="false"
    class="align-center justify-center"
    :model-value="isLoading"
    rounded
  >
    <h1>Fetching your profile...</h1>
    <VProgressLinear indeterminate rounded stream />
  </VOverlay>
  <VContainer align="center" v-if="userDoc && items">
    <VRow>
      <VCol>
        <AddItemToTab :items="items.food" />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VCard>
          <VCardTitle> Recent Transactions </VCardTitle>
          <VCardText>
            <VDataTable :headers="headers.actions">
              <template #body>
                <tr
                  v-for="(item, index) in userDoc.tab
                    .filter((e: TabItem) => !e.paid)
                    .reverse()"
                  :key="index"
                  align="center"
                >
                  <td>{{ item.name }}</td>
                  <td>
                    {{ $n(Number(item.price), "currency") }}
                  </td>
                  <td>
                    {{ item.date.toDate().toLocaleDateString() }}
                  </td>
                  <td>
                    {{ item.date.toDate().toLocaleTimeString() }}
                  </td>
                  <td>
                    <DeleteItemFromTab
                      :item="item"
                      v-if="canDelete(item.date, item.paid)"
                    />
                  </td>
                </tr>
              </template>
            </VDataTable>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VCard>
          <VCardTitle> Summary </VCardTitle>
          <VCardText>
            <VTable>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in dedupedTab" :key="index">
                  <tr v-if="countItemsInTab(userDoc.tab)[item.name] > 0">
                    <td>{{ item.name }}</td>
                    <td>
                      {{ countItemsInTab(userDoc.tab)[item.name] }}
                    </td>
                    <td>
                      {{ $n(item.price, "currency") }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </VTable>
          </VCardText>
          <VCardText>
            <VRow>
              <VCol align="left">
                <ClearTab
                  :email="auth?.currentUser?.email!"
                  name="your"
                  v-if="getTabTotal(userDoc.tab) > 0"
                />
              </VCol>
              <VCol align="right">
                <h3 class="mr-2">
                  Total:
                  {{ total }}
                </h3>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VExpansionPanels>
          <VExpansionPanel>
            <VExpansionPanelTitle>
              <h3>History</h3>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VDataTableVirtual
                :headers="headers.noActions"
                :items="virtualTab(userDoc.tab)"
                item-value="name"
              >
                <template #item="{ item }">
                  <tr align="center">
                    <td>{{ item.columns.name }}</td>
                    <td>
                      {{ $n(item.columns.price, "currency") }}
                    </td>
                    <td>
                      {{ item.columns.date.toDate().toLocaleDateString() }}
                    </td>
                    <td>
                      {{ item.columns.date.toDate().toLocaleTimeString() }}
                    </td>
                  </tr>
                </template>
              </VDataTableVirtual>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
    </VRow>
  </VContainer>
</template>
