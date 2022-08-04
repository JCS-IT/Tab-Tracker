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
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          Are you sure you want to delete {{ input.name }}?
        </v-card-title>
        <v-card-text> Note: This action can not be undone </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="deleteItem()"> Yes </v-btn>
          <v-btn color="error" @click="deleteItemMenu = false"> No </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { defineComponent } from "vue";

export default defineComponent({
  name: "DeleteItem",
  props: {
    input: Object,
    tab: Object,
    uid: String,
  },
  data() {
    return {
      deleteItemMenu: false,
    };
  },
  methods: {
    async deleteItem() {
      const docRef = doc(db, `users/${this.$route.params.id}`);
      this.tab.indexOf(this.input) > -1
        ? this.tab.splice(this.tab.indexOf(this.input), 1)
        : null;
      await updateDoc(docRef, {
        tab: this.tab,
      });
      this.deleteItemMenu = false;
    },
  },
});
</script>
