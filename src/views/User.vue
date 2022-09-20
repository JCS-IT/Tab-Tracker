<template>
  <v-container align="center">
    <v-row>
      <v-col>
        <h1>{{ user.data?.displayName }}'s Tab</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AddItem :items="items" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              Tab
              <v-spacer />
              Total: {{ total }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in items" :key="index">
                    <tr v-if="count[item.name] > 0">
                      <td>{{ item.name }}</td>
                      <td>{{ count[item.name] }}</td>
                      <td>
                        {{
                          new Intl.NumberFormat("en-CA", {
                            style: "currency",
                            currency: "CAD",
                          }).format(item.price)
                        }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title> History </v-expansion-panel-title>
            <v-expansion-panel-text class="pa-0">
              <v-lazy>
                <v-table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(item, index) in user.tab" :key="index">
                      <tr v-if="count[item.name] > 0">
                        <td>{{ item.name }}</td>
                        <td>{{ count[item.name] }}</td>
                        <td>
                          {{
                            new Intl.NumberFormat("en-CA", {
                              style: "currency",
                              currency: "CAD",
                            }).format(item.price)
                          }}
                        </td>
                        <td v-if="isCurrentDate(item.date)">
                          <DeleteItem :item="item"></DeleteItem>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </v-table>
              </v-lazy>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { auth, db } from "@/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import type { User, Item } from "@/types";

let itemSub: () => void;
let tabSub: () => void;

export default defineComponent({
  name: "UserView",
  components: {
    AddItem: defineAsyncComponent(
      () => import("@/components/public/items/AddItem.vue")
    ),
    DeleteItem: defineAsyncComponent(
      () => import("@/components/public/items/DeleteItem.vue")
    ),
  },
  data() {
    return {
      user: {} as User,
      items: [] as Item[],
      admin: false as boolean,
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
      let total = 0;
      this.user?.tab?.forEach((item) => {
        total += item.price;
      });
      return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      }).format(total);
    },
  },
  methods: {
    isCurrentDate(date: Timestamp) {
      const now = new Date();
      const diff = now.getTime() - date.toDate().getTime();
      return diff < 300000;
    },
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        tabSub = onSnapshot(doc(db, "users", user.uid), (doc) => {
          this.user = doc.data() as User;
          this.user.tab.reverse();
        });
        itemSub = onSnapshot(doc(db, "admin/items"), (doc) => {
          if (doc.exists()) {
            this.items = doc.data().food;
          }
        });
      } else {
        tabSub();
        itemSub();
      }
    });
  },
  beforeUnmount() {
    tabSub();
    itemSub();
  },
});
</script>
