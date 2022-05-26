<template>
  <v-container align="center">
    <v-row>
      <v-col>
        <v-dialog
          v-model="showNewUserMenu"
          fullscreen
          persistent
          :overlay="true"
          max-width="350px"
          max-height="300px"
          transition="dialog-transition"
        >
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props"> Add User </v-btn>
          </template>
          <v-card class="newUser" color="white">
            <v-card-title primary-title> Add New User </v-card-title>
            <v-form ref="form" lazy-validation>
              <v-text-field
                class="mx-5"
                v-model="first"
                label="First Name"
                :rules="nameRules"
                type="name"
                required
                shaped
              />
              <v-text-field
                class="mx-5"
                v-model="last"
                label="Last Name"
                :rules="nameRules"
                type="name"
                required
                shaped
              />
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
        </v-dialog>
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
                  {{ user.name.first }} {{ user.name.last }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <div class="text-center">
                    <v-dialog
                      v-model="deleteUserMenu"
                      fullscreen
                      persistent
                      :overlay="true"
                      max-width="300px"
                      max-height="220px"
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
      first: "",
      last: "",
      nameRules: [(v) => !!v || "Name is required"],
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
      let temp = await this.$refs.form.validate();
      if (temp.valid) {
        console.log("this form is valid");
        this.first = "";
        this.last = "";
        this.showNewUserMenu = false;
        await addDoc(collection(db, "staff"), {
          name: {
            first: first,
            last: last,
          },
          tab: [],
        });
      } else {
        console.log("something went wrong");
      }
    },
    async deleteUser(user) {
      this.deleteUserMenu = false;
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
    filterStaff(letter) {
      return this.staff?.filter((person) => {
        return person.name?.last[0]?.toUpperCase() == letter?.toUpperCase();
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
