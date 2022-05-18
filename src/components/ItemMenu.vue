<template>
  <v-container grid-list-xs>
    <v-row id="generate new staff">
      <v-col>
        <v-btn v-if="!newItemMenu" color="primary" @click="newItemMenu = true">
          New Item
        </v-btn>
        <v-card class="newUser" width="300" color="white" v-if="newItemMenu">
          <v-card-title primary-title> Add New Item </v-card-title>
          <v-form>
            <v-row>
              <v-col>
                <v-text-field v-model="newItem" label="Item Name" shaped />
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn color="success" @click="addItem(newItem)"> Submit </v-btn>
              <v-btn
                color="error"
                @click="
                  newItemMenu = false;
                  newItem = '';
                "
              >
                Cancle
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
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
                      Are you sure you want to delete this Item?
                    </v-card-title>
                    <v-card-text>
                      Note: This action can not be undone
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="success" @click="deleteItem(item)">
                        Yes
                      </v-btn>
                      <v-btn color="error" @click="deleteItemMenu = false"
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
      newItem: "",
      props: false,
      newItemMenu: false,
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
      console.log(item);
      await deleteDoc(doc(db, `items/${item.id}`));
    },
    async addItem(item) {
      this.newItem = "";
      this.newItemMenu = false;
      if (item != null) {
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
