<script setup lang="ts">
import type { Items, User } from "@jcstabs/shared";
import { getTabTotal } from "@/utils";
import { mdiMagnify } from "@mdi/js";

// composables
definePage({
  name: "Staff",
  path: "/admin/staff",
});

//data

const search = ref("");

// firestore snapshots
const db = useFirestore();
const users = useCollection<User>(collection(db, "users"));
const items = useDocument<Items>(doc(db, "admin/items"));

// computed
const isLoading = computed(() => {
  if (users.pending.value || items.pending.value) {
    return true;
  } else {
    return false;
  }
});

const filterUsers = computed(() => {
  return users.data.value?.filter((user) => {
    return user.info.displayName
      .toLowerCase()
      .includes(search.value.toLowerCase());
  });
});

// methods
</script>

<template>
  <VOverlay
    persistent
    :close-on-content-click="false"
    class="align-center justify-center"
    :model-value="isLoading"
  >
    <h1>Fetching staff list...</h1>
    <VProgressLinear indeterminate rounded stream />
  </VOverlay>
  <VContainer fluid v-if="users && items">
    <VRow>
      <VCol>
        <VCard>
          <VCardTitle>Staff List</VCardTitle>
          <VDivider />
          <VTextField
            v-model="search"
            label="Search"
            outlined
            class="pa-4"
            hide-details
            :prepend-inner-icon="mdiMagnify"
          />
          <VDivider />
          <VVirtualScroll :items="filterUsers" class="pa-4">
            <template #default="{ item }">
              <VListItem
                :title="item.info.displayName"
                :subtitle="'Tab ' + $n(getTabTotal(item.tab), 'currency')"
                @click="() => $router.push(`/admin/staff/${item.id}`)"
              >
                <template #prepend>
                  <VAvatar>
                    <VImg :src="item?.info.photoURL" />
                  </VAvatar>
                </template>
              </VListItem>
            </template>
          </VVirtualScroll>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
