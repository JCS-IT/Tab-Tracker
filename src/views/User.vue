<template>
  <v-container>
    <div style="display: flex; justify-content: center">
      <h3>{{ name }}'s Tab</h3>
    </div>
    <v-row
      v-if="$route.params.from == 'admin' && admin"
      class="my-4"
      justify="space-between"
    >
      <router-link :to="`/admin`">
        <v-btn color="primary" class="px-5" prepend-icon="mdi-shield-account">
          Back to admin
        </v-btn>
      </router-link>
      <ClearTab></ClearTab>
    </v-row>
    <v-row v-else class="my-4" justify="space-between">
      <AddItem :items="items" :tab="tab"></AddItem>
      <router-link to="/admin" v-if="admin">
        <v-btn color="info" prepend-icon="mdi-shield-account">
          Admin Menu
        </v-btn>
      </router-link>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col>
        <h4 class="text-center">Total</h4>
        <v-table>
          <thead>
            <tr>
              <th v-for="index in items" :key="item">{{ index }}s</th>
            </tr>
          </thead>
          <tbody>
            <td v-for="(item, index) in total" :key="index" class="pl-7">
              {{ item }}
            </td>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
            <tr v-for="(item, index) in tab" :key="index">
              <td class="text-center">{{ item.name }}</td>
              <td class="text-center">{{ convertDate(item.date as any) }}</td>
              <td v-if="isCurrentDate(item.date as any)">
                <DeleteItem :input="item" :tab="tab"></DeleteItem>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { auth, db } from "../firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";

let tabSub: () => void;
let itemSub: () => void;

interface Total {
  [key: string]: number;
}
interface Tab {
  [key: string]: {
    name: string;
    date: Timestamp;
  };
}
export default defineComponent({
  data() {
    return {
      tab: [] as Tab[],
      name: "" as string,
      item: "" as string,
      items: [] as string[],
      admin: false as any,
      showGrid: false as boolean,
      addItemMenu: false as boolean,
      clearTabMenu: false as boolean,
    };
  },
  components: {
    AddItem: defineAsyncComponent(
      () => import("@/components/public/AddItems.vue")
    ),
    DeleteItem: defineAsyncComponent(
      () => import("@/components/public/DeleteItem.vue")
    ),
    ClearTab: defineAsyncComponent(
      () => import("@/components/admin/prompts/ClearTab.vue")
    ),
  },
  computed: {
    total() {
      let total = {} as Total;
      this.items.forEach((item: any) => {
        total[item] = 0;
      });
      this.tab?.forEach((item: any) => {
        total[item.name]++;
      });
      return total;
    },
  },
  methods: {
    isCurrentDate(input: Timestamp) {
      let current = Timestamp.now();
      let difference = current.seconds - input.seconds;
      return difference < 300;
    },
    convertDate(input: Timestamp) {
      return input.toDate().toLocaleString();
    },
  },
  async created() {
    this.tab = [];
    tabSub = onSnapshot(doc(db, `users/${this.$route.params.id}`), (doc) => {
      if (doc.exists()) {
        this.name = doc.data().name;
        this.tab = doc.data().tab;
      }
      this.tab.reverse();
    });
    itemSub = onSnapshot(doc(db, "admin/items"), (doc) => {
      if (doc.exists()) {
        this.items = doc.data().food;
      }
    });
  },
  beforeDestroy() {
    tabSub();
    itemSub();
  },
  async mounted() {
    auth.onAuthStateChanged((user) => {
      if (user || this.$route.params.from === "admin") {
        user?.getIdTokenResult().then((idTokenResult) => {
          this.admin = idTokenResult.claims.admin;
        });
      } else {
        tabSub();
        itemSub();
        this.$router.push("/");
      }
    });
  },
});
</script>
