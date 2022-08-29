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
            <v-expansion-panel-title> Tab </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <v-list-item v-for="(item, index) in items" :key="index">
                  <v-list-item-title>
                    {{ item }}: {{ total[item as string] }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
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
import { defineComponent } from "vue";
import type { User } from "@/types";
import { httpsCallable } from "@firebase/functions";
import { functions } from "@/firebase";

export default defineComponent({
  name: "User-component",
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
    total() {
      const total = {} as { [key: string]: number };
      this.items.forEach((item) => {
        total[item] = 0;
      });
      this.user.tab.forEach((item) => {
        total[item.name]++;
      });
      return total;
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
      type: Array as () => string[],
      required: true,
    },
  },
});
</script>
