<template v-if="user != null">
  <VTooltip :text="user?.info.displayName">
    <template v-slot:activator="{ props }">
      <VBtn
        :ref="user.info.displayName"
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
              <VImg :src="user.info.photoURL" alt="User Avatar" />
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
        <ToggleAdmin :user="user" />
      </VCardText>
      <VCardActions>
        <VBtn color="primary" @click="dialog = false">Cancel</VBtn>
        <ClearTab
          :email="user.info.email"
          :name="user.info.displayName"
          v-if="user.tab.length > 0"
        />
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import type { User, Item } from "@/types";
</script>

<script lang="ts">
export default defineComponent({
  name: "UserComponent",
  components: {
    ToggleAdmin: defineAsyncComponent(
      () => import("./prompt/user/ToggleAdmin.vue")
    ),
    ClearTab: defineAsyncComponent(() => import("./prompt/user/ClearTab.vue")),
  },
  data() {
    return {
      dialog: false,
      loading: false,
    };
  },
  computed: {
    count() {
      const count: { [key: string]: number } = {};
      this.user?.tab.forEach((item) => {
        if (count[item.name]) {
          count[item.name]++;
        } else {
          count[item.name] = 1;
        }
      });
      return count;
    },
    total() {
      return this.user.tab.reduce((total, item) => {
        return total + item.price;
      }, 0);
    },
  },
  props: {
    user: {
      type: Object as () => User,
      required: true,
    },
    items: {
      type: Array as () => Item[],
      required: true,
    },
  },
});
</script>
