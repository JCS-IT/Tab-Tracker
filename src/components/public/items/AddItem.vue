<template>
  <v-btn
    color="green-lighten-2"
    :loading="dialog"
    :disabled="dialog"
    @click="dialog = true"
  >
    Add Item
  </v-btn>
  <v-dialog v-model="dialog" :fullscreen="mobile">
    <v-alert color="error" v-if="error">
      <v-alert-title>Error Detected</v-alert-title>
      please check the console for more information.
    </v-alert>
    <v-card max-width="300px" fullscreen>
      <v-card-title>
        <span class="headline">Add Item</span>
      </v-card-title>
      <v-card-text>
        <v-btn
          color="green-accent-1"
          v-for="(item, index) in items"
          :key="index"
          :loading="loading[item.name]"
          :disabled="loading[item.name]"
          @click="addItem(item)"
          class="ma-1"
          width="100%"
        >
          {{ item.name }}:
          {{
            new Intl.NumberFormat("en-CA", {
              style: "currency",
              currency: "CAD",
            }).format(item.price)
          }}
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" @click="dialog = false"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth, db } from "@/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import type { Item } from "@/types";
import { useDisplay } from "vuetify";

export default defineComponent({
  name: "AddItem",
  props: {
    items: {
      type: Array as () => Item[],
      required: true,
    },
  },
  setup() {
    const { mobile } = useDisplay();
    return { mobile };
  },
  data() {
    return {
      dialog: false,
      loading: {} as { [key: string]: boolean },
      error: false,
    };
  },
  methods: {
    async addItem(item: Item) {
      this.loading[item.name] = true;
      try {
        await updateDoc(doc(db, `users/${auth.currentUser?.uid}`), {
          tab: arrayUnion({
            name: item.name,
            price: item.price,
            date: Timestamp.now(),
          }),
        });
      } catch (error) {
        this.error = true;
        console.error(error);
      } finally {
        this.dialog = false;
        this.loading[item.name] = false;
      }
    },
  },
  mounted() {
    this.items.forEach((item) => {
      this.loading[item.name] = false;
    });
  },
});
</script>
