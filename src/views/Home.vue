<template>
  <div class="container" id="home">
    <router-link to="admin">
      <v-btn color="info">Admin</v-btn>
    </router-link>
    <v-container align="center">
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
            <router-link :to='`user?id=${user.id}`'>
              <v-btn width="200" color="secondary">
                {{ user.name }}
              </v-btn>
            </router-link>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import { db } from "../firebase";
import {
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
export default {
  data() {
    return {
      showNewUserMenu: false,
      newUser: "",
      staff: [],
      currentUser: "",
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

<style>
#nav {
  position: sticky;
  top: 0;
}
</style>
