<template>
  <div class="text-center">
    <v-dialog
      v-model="addItemMenu"
      scrollable
      fullscreen
      :overlay="true"
      max-width="300px"
      max-height="90%"
      transition="dialog-transition"
    >
      <template v-slot:activator="{ props }">
        <v-btn color="success" v-bind="props"> Add Item </v-btn>
      </template>
      <v-card>
        <v-card-title> Add Item </v-card-title>
        <v-btn
          color="success"
          v-for="item in items"
          :key="item.date"
          @click="addItem(item)"
          class="ma-1"
        >
          {{ item.name }}
        </v-btn>
        <v-card-actions>
          <v-btn color="error" @click="addItemMenu = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { date } from "@/utils/date";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
export default {
  name: "AddItem",
  props: {
    items: Object,
    tab: Object,
  },
  data() {
    return {
      addItemMenu: false,
    };
  },
  methods: {
    async addItem(item) {
      this.addItemMenu = false;
      const docRef = doc(db, `staff/${this.$route.params.id}`);
      let input = {
        name: item.name,
        date: date,
      };
      this.tab.push(input);
      await updateDoc(docRef, {
        tab: this.tab,
      });
    },
  },
};
</script>
