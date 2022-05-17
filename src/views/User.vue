<template>
  <v-container>
    <div style="display: flex; justify-content: center">
      <h3>{{ currentUser.name }}'s Tab</h3>
    </div>
    <v-row justify="space-between" class="my-4">
      <router-link to="/">
        <v-btn color="info">
          <i class="fa fa-home" aria-hidden="true"></i> Home
        </v-btn>
      </router-link>
      <v-btn color="success" v-if="!showItemMenu" @click="showItemMenu = true">
        Add Item
      </v-btn>
      <div class="text-center">
        <v-dialog v-model="clearTabMenu" scrollable fullscreen persistent :overlay="true" max-width="300px"
          max-height="200px" transition="dialog-transition">
          <template v-slot:activator="{ props }">
            <v-btn color="error" v-bind="props"> Clear All </v-btn>
          </template>
          <v-card>
            <v-card-title>
              Are you sure you want to clear the tab?
            </v-card-title>
            <v-card-text> </v-card-text>
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
  </v-container>
  <v-container grid-list-xs class="w-50" v-if="showItemMenu">
    <v-card class="pa-5">
      <v-card-title primary-title> Add Item </v-card-title>
      <v-btn color="success" v-for="item in items" :key="item" @click="addItem(item)" class="mx-1">
        {{ item }}
      </v-btn>
    </v-card>
  </v-container>
  <v-container>
    <v-row>
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
      <v-col>
        <h4 class="text-center">Total</h4>
        <v-table>
          <thead>
            <tr>
              <th v-for="item in items" :key="item">
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <td v-for="item in total" :key="item">
              {{ item }}
            </td>
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
  addDoc,
  collection,
  query,
  where,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

export default {
  data() {
    return {
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
        total[item] = 0;
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
        this.currentUser = doc.data()
        this.tab = doc.data().tab;
      });
      const docRef = doc(db, `items/food`);
      const docSnap = await getDoc(docRef);
      this.items = docSnap.data().food;
    },
    async addUser(user) {
      this.newUser = "";
      this.showNewUserMenu = false;
      if (user != null) {
        await addDoc(collection(db, "staff"), {
          name: user,
          tab: []
        });
      }
    },
    async addItem(item) {
      const docRef = doc(db, `staff/${this.currentUser.id}`);
      let input = {
        name: item,
        date: this.getDate(),
      };
      this.tab.push(input);
      await updateDoc(docRef, {
        tab: this.tab,
      });
    },
    async clearTab() {
      this.clearTabMenu = false;
      const docRef = doc(db, `staff/${this.currentUser.id}`);
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
    goTo(id) {
      document.getElementById(id).scrollIntoView();
    },
    filterStaff(letter) {
      return this.staff?.filter((person) => { return person.name?.split(' ')[1][0]?.toUpperCase() == letter[0].toUpperCase() })
    },
  },
  mounted() {
    this.init();
  },
};
</script>