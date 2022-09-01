<template>
  <v-container fluid align="center">
    <v-row>
      <v-col>
        <add-item />
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
              <v-row>
                <v-col>
                  <v-btn
                    color="red"
                    @click="removeItem(item)"
                    :loading="loading"
                    prepend-icon="mdi-delete"
                    width="100%"
                  >
                    Delete
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { auth, db, functions } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "@firebase/functions";
import type { Item } from "@/types";

let itemSub: () => void;

export default defineComponent({
  name: "ItemMenu",
  data() {
    return {
      items: [] as Item[],
      rules: {
        name: [(v: unknown) => !!v || "Name is required"],
        price: [(v: unknown) => !!v || "Price is required"],
      },
      loading: false,
      dialog: false,
      error: null as string | null,
    };
  },
  components: {
    AddItem: defineAsyncComponent(
      () => import("../components/prompt/items/AddItem.vue")
    ),
  },
  methods: {
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
