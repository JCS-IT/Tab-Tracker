<template>
  <v-container align="center">
    <div v-for="letter in list" :key="letter" :id="letter">
      <v-card>
        <v-card-title primary-title>
          {{ letter.toUpperCase() }}
        </v-card-title>
        <v-row class="my-10">
          <v-col v-for="user in filterStaff(letter)" :key="user.displayName">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn color="info" v-bind="props">
                  {{ user.name }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <router-link :to="`user?id=${user.id}&ref=admin`">
                    <v-btn color="success" width="107px">
                      <v-icon class="ml-n5 mr-1">mdi-account-hard-hat</v-icon>
                      Go to
                    </v-btn>
                  </router-link>
                </v-list-item>
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
                        <v-btn color="error" v-bind="props" width="107px">
                          <v-icon class="ml-n2 mr-1">mdi-nuke</v-icon>
                          Delete
                        </v-btn>
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
                          <v-btn color="error" @click="cancel()"> No </v-btn>
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
  collection,
  query,
  where,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
export default {
  name: "staff menu",
  data() {
    return {
      props: null,
      deleteUserMenu: false,
      staffMenu: false,
      staff: [],
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
    async deleteUser(user) {
      this.deleteUserMenu = false;
      await deleteDoc(doc(db, `staff/${user}`));
    },
    filterStaff(letter) {
      return this.staff?.filter((person) => {
        return person.name
          .split(" ")[1]
          ?.toUpperCase()
          .startsWith(letter.toUpperCase());
      });
    },
    cancel() {
      this.deleteUserMenu = false;
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
