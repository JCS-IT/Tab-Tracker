<template>
  <div class="container" id="home">
    <v-container align="center">
      <v-navigation-drawer permanent>
        <v-btn :color="selected == letter ? 'red' : 'info'" class="ma-3" v-for="letter in list" :key="letter"
          @click="goTo(letter), checkAdmin()">
          {{ letter }}
        </v-btn>
        <v-btn color="warning" @click="goTo('home')">Back to top</v-btn>
        <v-btn class="mt-5" color="error" @click="clearInput()">Clear Input</v-btn>
      </v-navigation-drawer>
      <h1 class="pb-6">Welcome</h1>
      <div v-for="letter in list" :key="letter" :id="letter">
        <h4>{{ letter.toUpperCase() }}</h4>
        <v-row v-for="user in filterStaff(letter)" :key="user.name">
          <v-col>
            <router-link :to="`user?id=${user.id}`">
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
      show: false,
      showNewUserMenu: false,
      newUser: "",
      staff: [],
      selected: "",
      currentUser: "",
      input: [],
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
          tab: [],
        });
      }
    },
    goTo(id) {
      this.input.push(id);
      this.selected = id;
      document.getElementById(id).scrollIntoView();
    },
    filterStaff(letter) {
      return this.staff?.filter((person) => {
        return (
          person.name?.split(" ")[1][0]?.toUpperCase() ==
          letter[0].toUpperCase()
        );
      });
    },
    checkAdmin() {
      if (this.input.length == 6) {
        this.input.shift();
        // this.input.forEach((i) => {
        //   temp = temp + i;
        // });
        if (this.input.toString() == "a,d,m,i,n") {
          this.$router.push("/admin");
        }
      }
      console.log(this.input)
    },
    clearInput() {
      this.input = [];
      this.selected = "";
    }
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
