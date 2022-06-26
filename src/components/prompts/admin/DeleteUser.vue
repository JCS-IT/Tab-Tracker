<template>
  <div class="text-center">
    <v-dialog
      v-model="deleteUserMenu"
      fullscreen
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
        <v-card-text> Note: This action can not be undone </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="deleteUser(user.id)"> Yes </v-btn>
          <v-btn color="error" @click="cancel()"> No </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";
export default {
  name: "DeleteUser",
  props: {
    user: Object,
  },
  data() {
    return {
      deleteUserMenu: false,
    };
  },
  methods: {
    async deleteUser(id) {
      this.deleteUserMenu = false;
      await deleteDoc(doc(db, `staff/${id}`));
    },
    cancel() {
      this.deleteUserMenu = false;
    },
  },
};
</script>
