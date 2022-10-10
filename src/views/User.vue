<template>
  <VContainer align="center">
    <VRow>
      <VCol>
        <h1>{{ user.info?.displayName }}'s Tab</h1>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <AddItem :items="items" />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VExpansionPanels>
          <VExpansionPanel>
            <VExpansionPanelTitle>
              Tab
              <VSpacer />
              Total: {{ total }}
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VTable density="compact">
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
              </VTable>
            </VExpansionPanelText>
          </VExpansionPanel>
          <VExpansionPanel>
            <VExpansionPanelTitle> History </VExpansionPanelTitle>
            <VExpansionPanelText class="pa-0">
              <VLazy>
                <VTable>
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
                          <DeleteItem :item="item" />
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </VTable>
              </VLazy>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
    </VRow>
  </VContainer>
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
