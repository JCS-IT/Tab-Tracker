<script setup lang="ts">
import { defineAsyncComponent, ref, computed } from "vue";
import type { User, Item } from "@/types";

// components
const ToggleRole = defineAsyncComponent(
  () => import("@/components/admin/User/ToggleRole.vue")
);

const ClearTab = defineAsyncComponent(
  () => import("@/components/admin/User/ClearTab.vue")
);

// props
const props = defineProps<{
  user: User | null;
  items: Item[];
}>();

// data
const dialog = ref(false);

// computed
const total = computed(() => {
  let total = 0;
  props.user?.tab.forEach((item) => {
    total += item.price;
  });
  return total;
});

const count = computed(() => {
  const count = {} as Record<string, number>;
  props.user?.tab.forEach((item) => {
    if (count[item.name]) {
      count[item.name] += 1;
    } else {
      count[item.name] = 1;
    }
  });
  return count;
});

// methods
const checkTabLength = () => {
  if (props.user?.tab.length) {
    return props.user?.tab.length > 0;
  } else {
    return 0;
  }
};
</script>

<template v-if="user != null">
  <VTooltip :text="user?.info.displayName">
    <template v-slot:activator="{ props }">
      <VBtn
        :ref="user?.info.displayName"
        icon
        v-bind="props"
        @click="dialog = true"
        :loading="dialog"
      >
        <VAvatar>
          <VImg :src="user?.info.photoURL" alt="Avatar" />
        </VAvatar>
      </VBtn>
    </template>
  </VTooltip>
  <VDialog v-model="dialog" width="300px">
    <VCard>
      <VCardTitle>
        <VRow>
          <VCol>
            <VAvatar>
              <VImg :src="user?.info.photoURL" alt="User Avatar" />
            </VAvatar>
          </VCol>
          <VCol>
            {{ user?.info.displayName }}
          </VCol>
        </VRow>
      </VCardTitle>
      <VCardText align="center">
        <VExpansionPanels>
          <VExpansionPanel>
            <VExpansionPanelTitle>
              Tab
              <VSpacer />
              Total: ${{ total }}
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VList>
                <template v-for="(item, index) in items" :key="index">
                  <VListItem v-if="count[item.name] > 0">
                    <VListItemTitle>
                      {{ item.name }}: {{ count[item.name] }} *{{
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(item.price)
                      }}
                    </VListItemTitle>
                  </VListItem>
                </template>
              </VList>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCardText>
      <VDivider />
      <VCardText>
        <span>Roles:</span>
        <ToggleRole :user="user" role="admin" />
      </VCardText>
      <VCardActions>
        <VBtn color="primary" @click="dialog = false">Cancel</VBtn>
        <ClearTab :user="user" v-if="checkTabLength()" />
      </VCardActions>
    </VCard>
  </VDialog>
</template>
