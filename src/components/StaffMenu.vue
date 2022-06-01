<template>
  <v-container align="center">
    <v-row>
      <v-col>
        <v-dialog
          v-model="newUserMenu"
          fullscreen
          persistent
          :overlay="true"
          transition="dialog-transition"
        >
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props"> Add User </v-btn>
          </template>
          <v-card class="newUser" color="white">
            <v-card-title primary-title> Add New User </v-card-title>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    class="mx-5"
                    id="first"
                    v-model="inputs.first"
                    label="First Name"
                    :model-value="inputs.first"
                    :rules="nameRules"
                    type="name"
                    @focus="onInputFocus"
                    required
                    shaped
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    class="mx-5"
                    id="last"
                    v-model="inputs.last"
                    label="Last Name"
                    :model-value="inputs.last"
                    :rules="nameRules"
                    type="name"
                    @focus="onInputFocus()"
                    required
                    shaped
                  />
                </v-col>
              </v-row>
              <keyboard
                @onChange="onChange()"
                @onKeyPress="onKeyPress()"
                :input="inputs[inputName]"
                :inputName="inputName"
              />
              <v-card-actions>
                <v-btn color="success" @click="addUser()"> Confirm </v-btn>
                <v-btn color="error" @click="cancel()"> cancel </v-btn>
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
                  <router-link :to="`user?id=${user.id}&ref=admin`">
                    <v-btn color="success" class="px-5">Go to</v-btn>
                  </router-link>
                </v-list-item>
                <v-list-item>
                  <v-dialog
                    v-model="editUserMenu"
                    fullscreen
                    persistent
                    :overlay="true"
                    transition="dialog-transition"
                  >
                    <template v-slot:activator="{ props }">
                      <v-btn
                        color="primary"
                        v-bind="props"
                        class="px-7"
                        @click="edit(user)"
                      >
                        Edit
                      </v-btn>
                    </template>
                    <v-card class="newUser" color="white">
                      <v-card-title primary-title> Edit User </v-card-title>
                      <v-form ref="form" lazy-validation>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              class="mx-5"
                              id="first"
                              v-model="inputs.first"
                              label="First Name"
                              :model-value="inputs.first"
                              :rules="nameRules"
                              type="name"
                              @focus="onInputFocus()"
                              required
                              shaped
                            />
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              class="mx-5"
                              id="last"
                              v-model="inputs.last"
                              label="Last Name"
                              :model-value="inputs.last"
                              :rules="nameRules"
                              type="name"
                              @focus="onInputFocus()"
                              required
                              shaped
                            />
                          </v-col>
                        </v-row>
                        <keyboard
                          @onChange="onChange()"
                          @onKeyPress="onKeyPress()"
                          :input="inputs[inputName]"
                          :inputName="inputName"
                        />
                        <v-card-actions>
                          <v-btn color="success" @click="editUser(user)">
                            Confirm
                          </v-btn>
                          <v-btn color="error" @click="cancel()">
                            cancel
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card>
                  </v-dialog>
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
                          <v-btn color="error" @click="cancel"> No </v-btn>
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
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import keyboard from "./keyboard.vue";
export default {
  name: "staff menu",
  data() {
    return {
      inputs: {
        first: "",
        last: "",
      },
      input: "",
      inputName: "",
      nameRules: [(v) => !!v || "Name is required"],
      props: null,
      deleteUserMenu: false,
      newUserMenu: false,
      editUserMenu: false,
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
  components: {
    keyboard,
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
    async addUser() {
      let temp = await this.$refs.form.validate();
      if (temp.valid) {
        this.newUserMenu = false;
        await addDoc(collection(db, "staff"), {
          name: {
            first: this.inputs.first,
            last: this.inputs.last,
          },
          tab: [],
        });
        this.inputs = {
          first: "",
          last: "",
        };
      } else {
        console.log("something went wrong");
      }
    },
    async editUser(user) {
      let temp = await this.$refs.form[0].validate();
      if (temp.valid) {
        this.editUserMenu = false;
        let input = {
          first: this.inputs.first,
          last: this.inputs.last,
        };
        await updateDoc(doc(db, `staff/${user.id}`), {
          name: input,
        });
        this.inputs = {
          first: "",
          last: "",
        };
      } else {
        console.log("something went wrong");
      }
    },
    async deleteUser(user) {
      this.deleteUserMenu = false;
      await deleteDoc(doc(db, `staff/${user}`));
    },
    edit(user) {
      this.inputs = {
        first: user.name.first,
        last: user.name.last,
      };
    },
    filterStaff(letter) {
      return this.staff?.filter((person) => {
        return person.name?.last[0]?.toUpperCase() == letter?.toUpperCase();
      });
    },
    onChange(input) {
      this.inputs[this.inputName] = input;
    },
    onKeyPress() {},
    onInputChange(input) {
      this.inputs[input.target.id] = input.target.value;
    },
    onInputFocus(input) {
      this.inputName = input.target.id;
    },
    cancel() {
      this.newUserMenu = false;
      this.deleteUserMenu = false;
      this.editUserMenu = false;
      this.inputs = {
        first: "",
        last: "",
      };
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
