<template>
  <div class="container" id="home">
    <v-container align="center">
      <v-navigation-drawer permanent touchless>
        <div id="top"></div>
        <v-btn color="warning" @click="goTo('')" class="mt-7 top">
          Back to top
        </v-btn>
        <br />
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
      <h1 class="pb-6">Welcome</h1>
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
      if (id == "") {
        document.getElementById("top").scrollIntoView({
          behavior: "smooth",
        });
      }
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
