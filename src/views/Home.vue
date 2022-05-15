<template>
  <div class="container">
    <v-container v-if="!showGrid" align="center">
      <h1 class="pb-6">Welcome</h1>
      <v-row>
        <v-col>
          <v-btn
            v-if="!showNewUserMenu"
            color="primary"
            @click="showNewUserMenu = true"
          >
            Add User
          </v-btn>
          <v-card
            class="newUser"
            width="300"
            color="white"
            v-if="showNewUserMenu"
          >
            <v-card-title primary-title> Add New User </v-card-title>
            <v-form>
              <v-text-field
                type="text"
                v-model="newUser"
                placeholder="Enter your name..."
              />
              <v-card-actions>
                <v-btn color="success" @click="addUser(newUser)">
                  Add User
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-for="user in staff" :key="user">
        <v-col>
          <v-btn width="200" color="secondary" @click="getUser(user)">
            {{ user.name }}
          </v-btn>
        </v-col>
      </v-row>
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
          <v-btn
            color="success"
            v-if="!showItemMenu"
            @click="showItemMenu = true"
          >
            Add Item
          </v-btn>
          <div class="text-center">
            <v-dialog
              v-model="clearTabMenu"
              scrollable
              fullscreen
              persistent
              :overlay="true"
              max-width="300px"
              max-height="200px"
              transition="dialog-transition"
            >
              <template v-slot:activator="{ props }">
                <v-btn color="error" v-bind="props"> Clear All </v-btn>
              </template>
              <v-card class="w-25">
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
          <v-btn
            color="success"
            v-for="item in items.food"
            :key="item"
            @click="addItem(item)"
          >
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
                  <th v-for="item in items.food" :key="item">
                    {{ item }}
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
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
  arrayUnion,
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
      staff: null,
      tab: null,
      currentUser: "",
      showItemMenu: false,
      items: {},
      total: {},
    };
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
      this.items = docSnap.data();
    },
    async addUser(user) {
      this.newUser = "";
      this.showNewUserMenu = false;
      if (user != null) {
        await addDoc(collection(db, "staff"), {
          name: user,
        });
      }
    },
    async addItem(item) {
      const docRef = doc(db, `staff/${this.currentUser.id}`);
      let input = {
        name: item,
      };
      await updateDoc(docRef, {
        tab: arrayUnion(input),
      });
    },
    async getUser(user) {
      this.showGrid = true;
      this.currentUser = user;
      this.tab = null;
      const unsub = onSnapshot(doc(db, `staff/${user.id}`), (doc) => {
        this.tab = doc.data().tab;
      });
    },
    async clearTab(user) {
      this.clearTabMenu = false;
      const docRef = doc(db, `staff/${this.currentUser.id}`);
      await updateDoc(docRef, {
        tab: [],
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
