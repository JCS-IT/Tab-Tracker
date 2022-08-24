<template>
  <div class="text-center">
    <v-dialog
      v-model="addItemMenu"
      :fullscreen="mobile"
      scrollable
      transition="dialog-transition"
    >
      <template v-slot:activator="{ props }">
        <v-btn color="success" v-bind="props"> Add Item </v-btn>
      </template>
      <v-card width="300px">
        <v-card-title> Add Item </v-card-title>
        <v-btn
          color="success"
          v-for="(item, index) in items"
          :key="index"
          @click="addItem(item)"
          class="ma-1"
        >
          {{ item }}
        </v-btn>
        <v-card-actions>
          <v-btn color="error" @click="addItemMenu = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { db } from "@/firebase";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { defineComponent } from "vue";
import { useDisplay } from "vuetify";

export default defineComponent({
  name: "AddItem",
  props: {
    items: Array,
    tab: Object,
  },
  setup() {
    const { mobile } = useDisplay();
    return { mobile };
  },
  data() {
    return {
      addItemMenu: false,
    };
  },
  methods: {
    async addItem(item: any) {
      this.addItemMenu = false;
      const docRef = doc(db, `users/${this.$route.params.id}`);
      let input = {
        name: item,
        date: Timestamp.now(),
      };
      this.tab?.push(input);
      await updateDoc(docRef, {
        tab: this.tab,
      });
    },
  },
});
</script>
