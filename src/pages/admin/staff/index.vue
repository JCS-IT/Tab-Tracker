<script setup lang="ts">
import type { Items, User } from "@/types";
import { getTabTotal } from "@/utils";
import { mdiMagnify } from "@mdi/js";

// composables
definePage({
  path: "/admin/staff",
});

interface UserWithUid extends Omit<User["info"], "createdAt"> {
  uid: string;
}

const index = useDocument<{ users: UserWithUid[] }>(
  doc(useFirestore(), "admin/_index")
);

const router = useRouter();

// Data
const search = ref("");

// Computed
const isLoading = computed(() => {
  return index.pending.value;
});

const filterUsers = computed(() => {
  return index.value?.users.filter((user) => {
    return user.displayName.toLowerCase().includes(search.value.toLowerCase());
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
  <VContainer fluid v-if="index">
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
                :title="item.displayName"
                @click="() => $router.push(`/admin/staff/${item.uid}`)"
              >
                <template #prepend>
                  <VAvatar>
                    <VImg :src="item?.photoURL" />
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
