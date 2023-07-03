<!-- eslint-disable vue/valid-v-slot -->
<script setup lang="ts">
import type { Items, VDataTableHeaderProps } from "@jcstabs/types";
import { VDataTable } from "vuetify/labs/VDataTable";

// firebase
const db = useFirestore();
const items = useDocument<Items>(doc(db, "admin", "items"));

// computed
const isLoading = computed(() => {
  return items.pending.value ? true : false;
});

// data

const headers = [
  {
    title: "Name",
    key: "name",
    align: "center",
  },
  {
    title: "Price",
    key: "price",
    align: "center",
  },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    sortable: false,
  },
] as VDataTableHeaderProps[];
</script>

<template>
  <VOverlay
    persistent
    :close-on-content-click="false"
    class="align-center justify-center"
    :model-value="isLoading"
  >
    <h1>Fetching items...</h1>
    <VProgressLinear indeterminate rounded stream />
  </VOverlay>
  <VContainer v-if="items">
    <VRow class="text-center">
      <VCol>
        <NewItem />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VCard>
          <VCardText>
            <VDataTable :items="items.food" :headers="headers">
              <template #item="{ item }">
                <tr align="center">
                  <td>{{ item.columns.name }}</td>
                  <td>{{ $n(Number(item.columns.price), "currency") }}</td>
                  <td>
                    <EditItem
                      :input="{
                        name: item.columns.name,
                        price: item.columns.price,
                      }"
                      :items="items.food"
                    />
                    <DeleteItem
                      :item="{
                        name: item.columns.name,
                        price: item.columns.price,
                      }"
                    />
                  </td>
                </tr>
              </template>
            </VDataTable>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow class="text-center">
      <VCol v-if="items.food.length < 1">
        <h1>Nothings here... Lets change that!</h1>
      </VCol>
    </VRow>
  </VContainer>
</template>
