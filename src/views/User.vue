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
            <td v-for="(item, index) in total" :key="index">
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
            <tr v-for="item in tab" :key="item">
              <td class="text-center">{{ item.name }}</td>
              <td class="text-center">
                {{ item.date.toDate() }}
              </td>
              <td
                v-if="isCurrentDate(item.date) && $route.params.from != 'admin'"
              >
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
import { defineAsyncComponent, defineComponent } from "vue";
import { auth, db } from "../firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";

export default defineComponent({
  data() {
    return {
      tab: [],
      name: "",
      item: "",
      items: [],
      admin: false,
      showGrid: false,
      addItemMenu: false,
      clearTabMenu: false,
    };
  },
  components: {
    AddItem: defineAsyncComponent(() =>
      import("@/components/prompts/items/AddItem.vue")
    ),
    DeleteItem: defineAsyncComponent(() =>
      import("@/components/prompts/items/DeleteItem.vue")
    ),
    ClearTab: defineAsyncComponent(() =>
      import("@/components/prompts/admin/ClearTab.vue")
    ),
  },
  computed: {
    total() {
      let total = {};
      this.items.forEach((item) => {
        total[item] = 0;
      });
      this.tab?.forEach((item) => {
        total[item.name]++;
      });
      return total;
    },
  },
  methods: {
    isCurrentDate(input) {
      return (
        Timestamp.now().toDate().toDateString() ===
        input.toDate().toDateString()
      );
    },
  },
  async mounted() {
    let unsubscribe = () => {};
    auth.onAuthStateChanged(async (user) => {
      if (user || this.$route.params.from === "admin") {
        this.tab = [];
        unsubscribe = onSnapshot(
          doc(db, `users/${this.$route.params.id}`),
          (doc) => {
            if (doc.exists()) {
              this.name = doc.data().name;
              this.tab = doc.data().tab;
            }
            this.tab.reverse();
          }
        );
        user.getIdTokenResult().then((idTokenResult) => {
          this.admin = idTokenResult.claims.admin;
        });
      } else {
        unsubscribe();
        this.$router.push("/");
      }
    });
  },
});
</script>
