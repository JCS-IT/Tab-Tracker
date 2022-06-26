<template>
  <div class="text-center">
    <v-dialog
      v-model="deleteItemMenu"
      fullscreen
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
        <v-card-text> Note: This action can not be undone </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="deleteItem(item)"> Yes </v-btn>
          <v-btn color="error" @click="deleteItemMenu = false"> No </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

export default {
  name: "DeleteItem",
  props: {
    item: Object,
  },
  data() {
    return {
      deleteItemMenu: false,
    };
  },
  methods: {
    async deleteItem(item) {
      this.deleteItemMenu = false;
      await deleteDoc(doc(db, `items/${item.id}`));
    },
  },
};
</script>
