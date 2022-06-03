<template>
  <v-container>
    <div style="display: flex; justify-content: center">
      <h3>{{ currentUser.name?.first }}'s Tab</h3>
    </div>
    <v-row
      v-if="$route.query.ref == 'admin'"
      justify="space-between"
      class="my-4"
    >
      <router-link :to="`/admin`" v-if="$route.query.ref == 'admin'">
        <v-btn color="primary" class="px-5">
          <v-icon>mdi-shield-account</v-icon> Back to admin
        </v-btn>
      </router-link>
      <div class="text-center">
        <v-dialog
          v-model="clearTabMenu"
          scrollable
          fullscreen
          persistent
          :overlay="true"
          max-width="300px"
          max-height="220px"
          transition="dialog-transition"
        >
          <template v-slot:activator="{ props }">
            <v-btn color="error" v-bind="props">
              <v-icon>mdi-close-circle</v-icon> Clear All
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              Are you sure you want to clear the tab?
            </v-card-title>
            <v-card-text> Note: This action can not be undone </v-card-text>
            <v-card-actions>
              <v-btn color="success" @click="clearTab(currentUser)">
                Yes
              </v-btn>
              <v-btn color="error" @click="clearTabMenu = false">No</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-row>
    <v-row v-else justify="space-between" class="my-4">
      <router-link to="/">
        <v-btn color="info">Home</v-btn>
      </router-link>
      <div class="text-center">
        <v-dialog
          v-model="addItemMenu"
          scrollable
          fullscreen
          persistent
          :overlay="true"
          max-width="300px"
          max-height="90%"
          transition="dialog-transition"
        >
          <template v-slot:activator="{ props }">
            <v-btn color="success" v-bind="props"> Add Item </v-btn>
          </template>
          <v-card>
            <v-card-title> Add Item </v-card-title>
            <v-btn
              color="success"
              v-for="item in items"
              :key="item"
              @click="addItem(item)"
              class="ma-1"
            >
              {{ item.name }}
            </v-btn>
            <v-card-actions>
              <v-btn color="error" @click="addItemMenu = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col>
        <h4 class="text-center">Total</h4>
        <v-table>
          <thead>
            <tr>
              <th v-for="item in items" :key="item">{{ item.name }}s</th>
            </tr>
          </thead>
          <tbody>
            <td v-for="item in total" :key="item">
              {{ item }}
            </td>
          </tbody>
        </v-table>
      </v-col>
      <v-col>
        <h4 class="text-center">History</h4>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Item</th>
              <th class="text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tab" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.date }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from "../firebase";
import {
  doc,
  query,
  where,
  collection,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

export default {
  data() {
    return {
      addItemMenu: false,
      clearTabMenu: false,
      showNewUserMenu: false,
      newUser: "",
      showGrid: false,
      staff: [],
      tab: [],
      currentUser: "",
      showItemMenu: false,
      items: [],
    };
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
      onSnapshot(doc(db, `staff/${this.$route.query.id}`), (doc) => {
        this.currentUser = doc.data();
        this.tab = doc.data().tab;
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
    async addItem(item) {
      this.addItemMenu = false;
      const docRef = doc(db, `staff/${this.$route.query.id}`);
      let input = {
        name: item.name,
        date: this.getDate(),
      };
      this.tab.push(input);
      await updateDoc(docRef, {
        tab: this.tab,
      });
    },
    async clearTab() {
      this.clearTabMenu = false;
      const docRef = doc(db, `staff/${this.$route.query.id}`);
      await updateDoc(docRef, {
        tab: [],
      });
    },
    getDate() {
      const current = new Date();
      const date =
        current.getFullYear() +
        "-" +
        (current.getMonth() + 1) +
        "-" +
        current.getDate();
      const time =
        current.getHours() +
        ":" +
        current.getMinutes() +
        ":" +
        current.getSeconds();
      const dateTime = date + " " + time;

      return dateTime;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
