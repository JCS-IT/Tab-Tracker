<template>
  <v-container fluid align="center">
    <v-row>
      <v-col>
        <v-btn color="green-lighten-2" @click="dialog = true"> Add Item </v-btn>
        <v-dialog v-model="dialog" persistent>
          <v-card width="300px" :loading="loading" :disabled="loading">
            <v-alert v-if="error">
              <v-alert-title>Error Occurred</v-alert-title>
              {{ error }}
            </v-alert>
            <v-card-title>
              <span class="headline">Add Item</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="item" lazy-validation>
                <v-text-field
                  label="Item Name"
                  variant="outlined"
                  v-model="item.name"
                  :loading="loading"
                  :rules="rules.name"
                  @keyup.enter="addItem"
                />
                <v-text-field
                  label="Item Price"
                  variant="outlined"
                  type="number"
                  v-model="item.price"
                  prefix="$"
                  :loading="loading"
                  :rules="rules.price"
                  @keyup.enter="addItem"
                />
              </v-form>
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
                  item.name = '';
                  item.price = null;
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
      <v-col v-for="item in items" :key="item.name">
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn color="blue-lighten-3" v-bind="props">
              {{ item.name }}: ${{ item.price }}
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
import type { Item } from "@/types";

let itemSub: () => void;

export default defineComponent({
  name: "ItemMenu",
  data() {
    return {
      dialog: false,
      item: {
        name: "" as string,
        price: null as number | null,
      },
      loading: false,
      error: null as string | null,
      items: [] as Item[],
      rules: {
        name: [(v: unknown) => !!v || "Name is required"],
        price: [(v: unknown) => !!v || "Price is required"],
      },
    };
  },
  methods: {
    async addItem() {
      this.loading = true;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const checkValid = await this.$refs.item.validate();
      if (!checkValid.valid) {
        this.loading = false;
        return;
      }

      try {
        const addItem = httpsCallable(functions, "addItem");
        await addItem({ item: this.item });
        this.dialog = false;
      } catch (error) {
        console.log(error);
        this.error = error as string;
      }
      this.item = {
        name: "",
        price: 0,
      };
      this.loading = false;
    },
    async removeItem(item: Item) {
      this.loading = true;
      try {
        const removeItem = httpsCallable(functions, "removeItem");
        await removeItem({ item: item });
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
            this.items = doc.data().food as Item[];
          }
        });
      } else {
        itemSub();
      }
    });
  },
});
</script>
