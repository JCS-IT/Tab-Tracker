<template>
  <v-container>
    <div style="display: flex; justify-content: center">
      <h3>{{ name }}'s Tab</h3>
    </div>
    <v-row
      v-if="$route.params.from == 'admin'"
      justify="space-between"
      class="my-4"
    >
      <router-link :to="`/admin`">
        <v-btn color="primary" class="px-5">
          <v-icon>mdi-shield-account</v-icon> Back to admin
        </v-btn>
      </router-link>
      <ClearTab></ClearTab>
    </v-row>
    <v-row v-else class="my-4">
      <v-col v-if="isAdmin">
        <router-link to="/admin">
          <v-btn color="info"
            ><v-icon>mdi-shield-account</v-icon> Admin Menu</v-btn
          >
        </router-link>
      </v-col>
      <v-col>
        <AddItem :items="items" :tab="tab"></AddItem>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col>
        <h4 class="text-center">Total</h4>
        <v-table>
          <thead>
            <tr>
              <th v-for="index in items" :key="item">{{ index.name }}s</th>
            </tr>
          </thead>
          <tbody>
            <td v-for="index in total" :key="index">
              {{ index }}
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
            <tr v-for="item in tab" :key="item">
              <td class="text-center">{{ item.name }}</td>
              <td class="text-center">{{ item.date }}</td>
              <td v-if="isCurrentDate(item.date) && !$route.query.ref">
                <DeleteItem
                  :input="item"
                  :tab="tab"
                  :uid="this.$route.params.id"
                ></DeleteItem>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { date } from "@utils/date";
import { auth, db } from "../firebase";
import { doc, query, where, collection, onSnapshot } from "firebase/firestore";
export default {
  data() {
    return {
      tab: [],
      name: "",
      item: "",
      items: [],
      isAdmin: false,
      showGrid: false,
      addItemMenu: false,
      clearTabMenu: false,
    };
  },
  components: {
    AddItem: defineAsyncComponent(() => import("@prompts/items/AddItem.vue")),
    DeleteItem: defineAsyncComponent(() =>
      import("@prompts/items/DeleteItem.vue")
    ),
    ClearTab: defineAsyncComponent(() => import("@prompts/admin/ClearTab.vue")),
  },
  computed: {
    total() {
      let total = {};
      this.items.forEach((item) => {
        total[item.name] = 0;
      });
      this.tab?.forEach((item) => {
        total[item.name]++;
      });
      return total;
    },
  },
  methods: {
    async init() {
      this.tab = [];
      onSnapshot(doc(db, `staff/${this.$route.params.id}`), (doc) => {
        if (doc.exists()) {
          this.name = doc.data()?.name;
          this.tab = doc.data()?.tab;
          this.isAdmin = doc.data()?.isAdmin;
        }
      });
      const q = query(collection(db, "items"), where("type", "==", "food"));
      onSnapshot(q, (snapshot) => {
        this.items = [];
        snapshot.forEach((doc) => {
          this.items.push({
            id: doc.id,
            name: doc.data().name,
          });
        });
      });
    },
    isCurrentDate(input) {
      return date.split(" ")[0] === input.split(" ")[0];
    },
  },
  async mounted() {
    auth.onAuthStateChanged((user) => {
      if (user || this.$route.query.ref == "admin") {
        this.init();
      } else {
        this.$router.push("/");
      }
    });
  },
};
</script>
