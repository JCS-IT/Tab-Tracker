<template>
  <div class="container" id="home">
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>JCS Tabs</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-container align="center">
      <v-navigation-drawer v-model="drawer" bottom temporary>
        <v-btn
          :color="selected == letter ? 'red' : 'info'"
          class="ma-3"
          v-for="letter in list"
          :key="letter"
          @click="goTo(letter), checkAdmin()"
        >
          {{ letter }}
        </v-btn>
      </v-navigation-drawer>
      <v-row justify="center">
        <h4 v-if="selected != ''">
          Currently browsing: {{ selected?.toUpperCase() }}
        </h4>
      </v-row>
      <v-row justify="center">
        <v-col v-for="user in filterStaff(selected)" :key="user.name">
          <router-link :to="`user?id=${user.id}`">
            <v-btn width="200" color="secondary">
              {{ user.name.first }} {{ user.name.last }}
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
export default {
  data() {
    return {
      show: false,
      showNewUserMenu: false,
      drawer: false,
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
  computed: {},
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
    goTo(id) {
      this.input.push(id);
      this.selected = id;
    },
    filterStaff(letter) {
      return this.staff?.filter((person) => {
        return person.name?.last[0]?.toUpperCase() == letter?.toUpperCase();
      });
    },
    checkAdmin() {
      if (this.input.length == 5) {
        if (this.input.toString() == "a,d,m,i,n") {
          this.$router.push("/admin");
        }
        this.input.shift();
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
.top {
  position: sticky !important;
  top: 7px;
  z-index: 99999;
}
</style>
