<template>
  <div class="container" id="home">
    <router-link to="admin">
      <v-btn color="info">Admin</v-btn>
    </router-link>
    <v-container v-if="!showGrid" align="center">
      <v-navigation-drawer permanent>
        <v-btn color="info" class="ma-3" v-for="letter in list" :key="letter" @click="goTo(letter)">
          {{ letter }}
        </v-btn>
        <v-btn color="warning" @click="goTo('home')">Back to top</v-btn>
      </v-navigation-drawer>
      <h1 class="pb-6">Welcome</h1>
      <v-row>
        <v-col>
          <v-btn v-if="!showNewUserMenu" color="primary" @click="showNewUserMenu = true">
            Add User
          </v-btn>
          <v-card class="newUser" width="300" color="white" v-if="showNewUserMenu">
            <v-card-title primary-title> Add New User </v-card-title>
            <v-form>
              <v-text-field type="text" v-model="newUser" placeholder="Enter your name..." />
              <v-card-actions>
                <v-btn color="success" @click="addUser(newUser)">
                  Confirm
                </v-btn>
                <v-btn color="error" @click="showNewUserMenu = false; newUser = '';">
                  Cancle
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
      <div v-for="letter in list" :key="letter" :id="letter">
        <h4>{{ letter.toUpperCase() }}</h4>
        <v-row v-for="user in  filterStaff(letter)" :key="user.name">
          <v-col>
            <v-btn width="200" color="secondary" @click="getUser(user)">
              {{ user.name }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-container>
    <div v-else>
      <v-container>
        <div style="display: flex; justify-content: center">
          <h3>{{ currentUser.name }}'s Tab</h3>
        </div>
        <v-row justify="space-between" class="my-4">
          <v-btn color="error" class="back" @click="showGrid = false">
            <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Back
          </v-btn>
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
    </div>
  </div>
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
      list: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
      ],
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
      const q = query(collection(db, "staff"), where("name", "!=", null));
      onSnapshot(q, (snapshot) => {
        this.staff = [];
        snapshot.forEach((doc) => {
          this.staff.push({
            id: doc.id,
            name: doc.data().name,
          });
        });
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
    async getUser(user) {
      this.showGrid = true;
      this.currentUser = user;
      this.tab = null;
      onSnapshot(doc(db, `staff/${user.id}`), (doc) => {
        this.tab = doc.data().tab;
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
      return this.staff?.filter((person) => { return person.name?.split(' ')[1][0].toUpperCase() == letter[0].toUpperCase() })
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
#nav {
  position: sticky;
  top: 0;
}
</style>
