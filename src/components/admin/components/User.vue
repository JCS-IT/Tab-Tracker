<template v-if="user != null">
  <v-tooltip :text="user?.info.displayName">
    <template v-slot:activator="{ props }">
      <v-btn
        :ref="user.info.displayName"
        icon
        v-bind="props"
        @click="dialog = true"
        :loading="dialog"
      >
        <v-avatar>
          <v-img :src="user?.info.photoURL" alt="Avatar" />
        </v-avatar>
      </v-btn>
    </template>
  </v-tooltip>
  <v-dialog v-model="dialog">
    <v-card width="300px">
      <v-card-title>
        <v-row>
          <v-col>
            <v-avatar>
              <v-img :src="user.info.photoURL" alt="User Avatar" />
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
                      {{ item.name }}: {{ count[item.name] }} *{{
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
        <toggle-admin :user="user" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
        <ClearTab
          :email="user.info.email"
          :name="user.info.displayName"
          v-if="user.tab.length > 0"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import type { User, Item } from "@/types";
import { useDisplay } from "vuetify";

export default defineComponent({
  name: "UserComponent",
  components: {
    ToggleAdmin: defineAsyncComponent(
      () => import("./prompt/user/ToggleAdmin.vue")
    ),
    ClearTab: defineAsyncComponent(() => import("./prompt/user/ClearTab.vue")),
  },
  setup() {
    const { mobile } = useDisplay();
    return { mobile };
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
