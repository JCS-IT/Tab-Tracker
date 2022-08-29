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
      <v-col cols="6">
        <h4 class="text-center">Totals</h4>
        <v-table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items">
              <td>{{ item }}</td>
              <td>{{ total[item] }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="6">
        <h4 class="text-center">History</h4>
        <v-table>
          <thead>
            <tr>
              <th class="text-center">Item</th>
              <th class="text-center">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in user.tab" :key="index">
              <td class="text-center">{{ item.name }}</td>
              <td class="text-center">
                {{ item.date.toDate().toLocaleString() }}
              </td>
              <td v-if="isCurrentDate(item.date)">
                <DeleteItem :item="item"></DeleteItem>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { auth, db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { User } from "@/types";

let itemSub: () => void;
let tabSub: () => void;

export default defineComponent({
  name: "User",
  components: {
    AddItem: defineAsyncComponent(
      () => import("@/components/public/AddItem.vue")
    ),
    DeleteItem: defineAsyncComponent(
      () => import("@/components/public/DeleteItem.vue")
    ),
  },
  data() {
    return {
      user: {} as User,
      items: [],
      admin: false as any,
    };
  },
  computed: {
    total() {
      let total = {} as { [key: string]: number };
      this.items.forEach((item: any) => {
        total[item] = 0;
      });
      this.user.tab.forEach((item: any) => {
        total[item.name]++;
      });
      return total;
    },
  },
  methods: {
    isCurrentDate(date: any) {
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
  beforeDestroy() {
    tabSub();
    itemSub();
  },
});
</script>
