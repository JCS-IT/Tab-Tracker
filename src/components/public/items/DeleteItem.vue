<template>
  <v-btn
    color="red"
    :loading="dialog"
    :disabled="dialog"
    @click="dialog = true"
  >
    <v-icon>mdi-delete</v-icon>
  </v-btn>
  <v-dialog v-model="dialog" overlay transition="dialog-transition">
    <v-card class="text-center">
      <v-card-title>
        <span class="headline">Delete Item</span>
      </v-card-title>
      <v-card-subtitle>
        {{ item?.name }} at {{ item?.date.toDate().toLocaleString() }}
      </v-card-subtitle>
      <v-card-text>
        <span> Are you sure you want to delete this item? </span>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="green"
          @click="deleteItem"
          :loading="loading"
          :disabled="loading"
        >
          Delete
        </v-btn>
        <v-btn color="red" @click="dialog = false"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth, db } from "@/firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { useDisplay } from "vuetify";

export default defineComponent({
  name: "DeleteItem",
  props: {
    item: Object,
    tab: Object,
  },
  setup() {
    const { mobile } = useDisplay();
    return { mobile };
  },
  data() {
    return {
      dialog: false,
      loading: false,
      error: false,
    };
  },
  methods: {
    async deleteItem() {
      this.loading = true;
      try {
        await updateDoc(doc(db, `users/${auth.currentUser?.uid}`), {
          tab: arrayRemove(this.item),
        });
      } catch (error) {
        this.error = true;
        console.error(error);
      } finally {
        this.loading = false;
        this.dialog = false;
      }
    },
  },
});
</script>
