<template>
  <v-container fluid align="center">
    <v-row>
      <v-col>
        <v-btn color="green-lighten-2" @click="dialog = true"> Add Item </v-btn>
        <v-dialog v-model="dialog" persistent>
          <v-alert v-if="error">
            <v-alert-title>Error Occurred</v-alert-title>
            {{ error }}
          </v-alert>
          <v-card width="300px" :loading="loading" :disabled="loading">
            <v-card-title>
              <span class="headline">Add Item</span>
            </v-card-title>
            <v-card-text>
              <v-text-field
                label="Item Name"
                variant="outlined"
                v-model="itemName"
                :loading="loading"
                @keyup.enter="addItem"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="green-lighten-2"
                @click="addItem"
                :loading="loading"
              >
                Submit
              </v-btn>
              <v-btn
                color="red"
                @click="
                  itemName = '';
                  dialog = false;
                "
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="item in items" :key="item">
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn color="blue-lighten-3" v-bind="props">
              {{ item }}
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-btn color="red" @click="removeItem(item)" :loading="loading">
                <v-icon>mdi-delete</v-icon>
                Delete
              </v-btn>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth, db, functions } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "@firebase/functions";

let itemSub: () => void;

export default defineComponent({
  name: "ItemMenu",
  data() {
    return {
      dialog: false,
      itemName: "",
      loading: false,
      error: null as string | null,
      items: [] as string[],
    };
  },
  methods: {
    async addItem() {
      this.loading = true;
      try {
        const addItem = httpsCallable(functions, "addItem");
        await addItem({ name: this.itemName });
      } catch (error) {
        console.log(error);
        this.error = error as string;
      } finally {
        this.itemName = "";
        this.loading = false;
        this.dialog = false;
      }
    },
    async removeItem(item: string) {
      this.loading = true;
      try {
        const removeItem = httpsCallable(functions, "removeItem");
        await removeItem({ name: item });
      } catch (error) {
        console.log(error);
        this.error = error as string;
      } finally {
        this.loading = false;
        this.dialog = false;
      }
    },
  },
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        itemSub = onSnapshot(doc(db, "admin/items"), (doc) => {
          if (doc.exists()) {
            this.items = doc.data().food as string[];
          }
        });
      } else {
        itemSub();
      }
    });
  },
});
</script>
