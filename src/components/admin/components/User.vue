<template>
  <v-tooltip>
    <template v-slot:activator="{ props }">
      <v-btn
        :ref="user.data.displayName"
        icon
        v-bind="props"
        @click="dialog.user = true"
        :loading="dialog.user"
      >
        <v-avatar>
          <v-img :src="user?.data.photoURL" alt="Avatar" />
        </v-avatar>
      </v-btn>
    </template>
    <span>{{ user?.data.displayName }}</span>
  </v-tooltip>
  <v-dialog v-model="dialog.user">
    <v-card width="300px">
      <v-card-title>
        <v-row>
          <v-col>
            <v-avatar>
              <v-img :src="user.data.photoURL" alt="User Avatar" />
            </v-avatar>
          </v-col>
          <v-col>
            <span class="headline">{{ user?.data.displayName }}</span>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <span class="headline">Tab</span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <v-list-item>
                  <v-list-item-title> Total: ${{ total }} </v-list-item-title>
                </v-list-item>
                <div v-for="(item, index) in items" :key="index">
                  <v-list-item v-if="count[item.name] > 0">
                    <v-list-item-title>
                      {{ item.name }}: {{ count[item.name] }} * ${{
                        item.price
                      }}
                    </v-list-item-title>
                  </v-list-item>
                </div>
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
        <v-btn color="red" @click="dialog.clear = true" :loading="dialog.clear">
          Clear Tab
        </v-btn>
        <v-dialog v-model="dialog.clear">
          <v-card :loading="loading" :disabled="loading">
            <v-card-title>
              <span class="headline">Are you Sure?</span>
            </v-card-title>
            <v-card-subtitle> This action can not be undone. </v-card-subtitle>
            <v-card-text>
              <p>This will clear the tab for {{ user?.data.displayName }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="red"
                @click="clearTab"
                :loading="loading"
                :disabled="loading"
                >Clear</v-btn
              >
              <v-btn
                color="green"
                @click="dialog.clear = false"
                :disabled="loading"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn color="primary" @click="dialog.user = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import type { User, Item } from "@/types";
import { httpsCallable } from "@firebase/functions";
import { functions } from "@/firebase";

export default defineComponent({
  name: "User-component",
  components: {
    ToggleAdmin: defineAsyncComponent(() => import("./prompt/ToggleAdmin.vue")),
  },
  data() {
    return {
      dialog: {
        user: false,
        clear: false,
      },
      loading: false,
    };
  },
  computed: {
    count() {
      const total = {} as { [key: string]: number };
      this.items.forEach((item) => {
        total[item.name] = 0;
      });
      this.user.tab.forEach((item) => {
        total[item.name]++;
      });
      return total;
    },
    total() {
      return this.user.tab.reduce((total, item) => {
        return total + item.price;
      }, 0);
    },
  },
  methods: {
    async clearTab() {
      this.loading = true;
      try {
        const clearTab = httpsCallable(functions, "clearTab");
        await clearTab({
          email: this.user.data.email,
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
        this.dialog.clear = false;
      }
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
