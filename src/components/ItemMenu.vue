<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col align="center">
        <v-dialog
          v-model="inputMenu"
          fullscreen
          persistent
          max-width="500px"
          max-height="220px"
          :overlay="true"
          transition="dialog-transition"
        >
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props"> Add Item </v-btn>
          </template>
          <v-card color="white">
            <v-card-title primary-title> Add New Item </v-card-title>
            <v-form ref="newFood" lazy-validation @submit.prevent>
              <v-text-field
                class="mx-5 input"
                v-model="input"
                label="Item Name"
                :rules="nameRules"
                type="name"
                required
                shaped
                @keyup.enter="addItem(input)"
              />
              <v-card-actions>
                <v-btn color="success" @click="addItem(input)"> Confirm </v-btn>
                <v-btn
                  color="error"
                  @click="
                    inputMenu = false;
                    input = '';
                  "
                >
                  cancel
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="item in food" :key="item">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="info" v-bind="props">
              {{ item.name }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <div class="text-center">
                <v-dialog
                  v-model="deleteItemMenu"
                  fullscreen
                  persistent
                  width="300px"
                  height="220px"
                  :overlay="true"
                  transition="dialog-transition"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn color="error" v-bind="props">
                      <v-icon>mdi-delete</v-icon> Delete
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      Are you sure you want to delete this Item?
                    </v-card-title>
                    <v-card-text>
                      Note: This action can not be undone
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="success" @click="deleteItem(item)">
                        Yes
                      </v-btn>
                      <v-btn color="error" @click="deleteItemMenu = false">
                        No
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from "../firebase";
import {
  query,
  where,
  doc,
  onSnapshot,
  addDoc,
  collection,
  deleteDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      food: [],
      input: "",
      props: false,
      nameRules: [(v) => !!v || "Name is required"],
      inputMenu: false,
      deleteItemMenu: false,
    };
  },
  methods: {
    async init() {
      const q = query(collection(db, "items"), where("type", "==", "food"));
      onSnapshot(q, (snapshot) => {
        this.food = [];
        snapshot.forEach((doc) => {
          this.food.push({
            id: doc.id,
            name: doc.data().name,
          });
        });
      });
    },
    async deleteItem(item) {
      this.deleteItemMenu = false;
      await deleteDoc(doc(db, `items/${item.id}`));
    },
    async addItem(item) {
      let temp = await this.$refs.newFood.validate();
      if (temp.valid) {
        this.inputMenu = false;
        this.input = "";
        await addDoc(collection(db, "items"), {
          name: item,
          type: "food",
        });
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>
