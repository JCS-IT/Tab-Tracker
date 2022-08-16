<template>
  <v-dialog
    v-model="inputMenu"
    fullscreen
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
</template>

<script lang="ts">
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      input: "",
      props: false,
      nameRules: [(v) => !!v || "Name is required"],
      inputMenu: false,
    };
  },
  props: {
    items: Array,
  },
  methods: {
    async addItem(item) {
      let temp = await this.$refs.newFood.validate();
      if (temp.valid) {
        this.inputMenu = false;
        this.input = "";
        await updateDoc(doc(db, "admin/items"), {
          food: [...this.items, item],
        });
      }
    },
  },
});
</script>
