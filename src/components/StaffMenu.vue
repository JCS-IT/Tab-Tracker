<template>
  <v-container align="center">
    <v-row id="generate new staff">
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
          width="500"
          color="white"
          v-if="showNewUserMenu"
        >
          <v-card-title primary-title> Add New User </v-card-title>
          <v-form>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="first"
                  label="First Name"
                  :rules="rules.name"
                  shaped
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="last"
                  label="Last Name"
                  :rules="rules.name"
                  shaped
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn color="success" @click="addUser(first, last)">
                Confirm
              </v-btn>
              <v-btn
                color="error"
                @click="
                  showNewUserMenu = false;
                  newUser = '';
                "
              >
                Cancle
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <div v-for="letter in list" :key="letter" :id="letter">
      <v-card>
        <v-card-title primary-title>
          {{ letter.toUpperCase() }}
        </v-card-title>
        <v-row class="ma-10">
          <v-col v-for="user in filterStaff(letter)" :key="user.name">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn color="info" v-bind="props">
                  {{ user.name }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <div class="text-center">
                    <v-dialog
                      v-model="deleteUserMenu"
                      scrollable
                      fullscreen
                      persistent
                      :overlay="true"
                      max-width="300px"
                      max-height="200px"
                      transition="dialog-transition"
                    >
                      <template v-slot:activator="{ props }">
                        <v-btn color="error" v-bind="props"> Delete </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>
                          Are you sure you want to delete this user?
                        </v-card-title>
                        <v-card-text>
                          Note: This action can not be undone
                        </v-card-text>
                        <v-card-actions>
                          <v-btn color="success" @click="deleteUser(user.id)">
                            Yes
                          </v-btn>
                          <v-btn color="error" @click="deleteUserMenu = false"
                            >No</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </div>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card>
    </div>
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
  deleteDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
export default {
  name: "staff menu",
  data() {
    return {
      rules: {
        name: (v) => !!v || "Required.",
      },
      valid: false,
      first: "",
      last: "",
      props: null,
      deleteUserMenu: false,
      showNewUserMenu: false,
      staffMenu: false,
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
    },
    async addUser(first, last) {
      let user = first + " " + last;
      this.showNewUserMenu = false;
      if (user != null) {
        await addDoc(collection(db, "staff"), {
          name: user,
          tab: [],
        });
      }
    },
    async deleteUser(user) {
      await deleteDoc(doc(db, `staff/${user}`));
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
      this.deleteUserMenu = false;
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
      return this.staff?.filter((person) => {
        return (
          person.name?.split(" ")[1][0].toUpperCase() == letter[0].toUpperCase()
        );
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
* {
  text-decoration: none;
}

#nav {
  position: sticky;
  top: 0;
}
</style>
