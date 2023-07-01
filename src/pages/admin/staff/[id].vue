<script setup lang="ts">
import type { User } from "@/types";
import { countItemsInTab, dedupeArray, getTabTotal, virtualTab } from "@/utils";
import { useI18n } from "vue-i18n";
import { VDataTableVirtual } from "vuetify/labs/VDataTable";

// Composables
const route = useRoute();

definePage({
  name: "User",
  path: "/admin/staff/:id",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
});

// Firebase
// @ts-expect-error - the ID is there but TS doesn't know it
const user = useDocument<User>(doc(useFirestore(), `users/${route.params.id}`));

// composables
const i18n = useI18n();

// data

const headers = [
  {
    title: "Item",
    key: "name",
  },
  {
    title: "Price",
    key: "price",
  },
  {
    title: "Date",
    key: "date",
  },
  {
    title: "Time",
    key: "time",
  },
];

// computed
const virtualizedTab = computed(() => {
  return virtualTab(user.data.value?.tab ?? []);
});
const total = computed(() => {
  return i18n.n(getTabTotal(user.data.value?.tab ?? []), "currency");
});

// methods
const checkTabLength = () => {
  return {
    currentTab: !!user.data.value?.tab.filter((item) => !item.paid).length,
    history: !!user.data.value?.tab.length,
  };
};
</script>

<template>
  <VCard>
    <VCard>
      <VCardTitle>
        <VRow>
          <VCol>
            <VAvatar>
              <VImg :src="user?.info.photoURL" alt="User Avatar" />
            </VAvatar>

            {{ user?.info.displayName }}
          </VCol>
        </VRow>
      </VCardTitle>
      <VCardText>
        <h3 align="center">Current Tab {{ total }}</h3>
        <VTable>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(item, index) in dedupeArray(user?.tab ?? [])"
              :key="index"
            >
              <tr v-if="countItemsInTab(user?.tab ?? [])[item.name] > 0">
                <td>{{ item.name }}</td>
                <td>{{ countItemsInTab(user?.tab ?? [])[item.name] }}</td>
                <td>
                  {{ $n(item.price, "currency") }}
                </td>
              </tr>
            </template>
          </tbody>
        </VTable>
      </VCardText>
      <VDivider class="my-1" />
      <VCardText>
        <VExpansionPanels>
          <VExpansionPanel elevation="0">
            <VExpansionPanelTitle> History </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VDataTableVirtual
                :headers="headers"
                :items="virtualizedTab"
                item-value="name"
              >
                <template #item="{ item }">
                  <tr>
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
      </VCardText>
      <VDivider />
      <VCardText>
        <span>Roles:</span>
        <ToggleRole :user="(user as User)" role="admin" />
      </VCardText>
      <VCardActions>
        <VBtn color="auto" @click="$router.back()">back</VBtn>
        <ClearTab
          :email="user?.info.email!"
          :name="user?.info.displayName! + `'s`"
          v-if="checkTabLength().currentTab"
        />
        <ClearHistory :user="(user as User)" v-if="checkTabLength().history" />
      </VCardActions>
    </VCard>
  </VCard>
</template>
