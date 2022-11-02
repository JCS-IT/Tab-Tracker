<template v-if="user != null">
  <v-tooltip :text="user?.info.displayName">
    <template #activator="{ props }">
      <v-btn
        :ref="user?.info.uid"
        icon
        v-bind="props"
        @click="dialog = true"
        :loading="dialog"
        variant="text"
      >
        <v-avatar>
          <v-img :src="user?.info.photoURL" :alt="user?.info.displayName" />
        </v-avatar>
      </v-btn>
    </template>
  </v-tooltip>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col>
            <v-avatar>
              <v-img :src="user?.info.photoURL" alt="User Avatar" />
            </v-avatar>
          </v-col>
          <v-col>
            {{ user?.info.displayName }}
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text align="center">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              Tab
              <v-spacer />
              Total: ${{ total }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <template v-for="(item, index) in items" :key="index">
                  <v-list-item v-if="count[item.name] > 0">
                    <v-list-item-title>
                      {{ item.name }}: {{ count[item.name] }} *
                      {{
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(item.price)
                      }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-divider />
      <v-card-text>
        <span>Roles:</span>
        <ToggleRole :user="user" role="admin" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="auto" @click="dialog = false">Close</v-btn>
        <ClearTab :user="user" v-if="checkTabLength()" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed } from "vue";
import type { User, Item } from "@/types";

// components
import ToggleRole from "@/components/admin/User/ToggleRole.vue";
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
