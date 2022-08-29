<template>
  <v-btn
    color="green-lighten-2"
    :loading="dialog"
    :disabled="dialog"
    @click="dialog = true"
  >
    Add Item
  </v-btn>
  <v-dialog v-model="dialog">
    <v-container fluid align="center">
      <v-row>
        <v-col>
          <v-alert color="error" v-if="error">
            <v-alert-title>Error Detected</v-alert-title>
            please check the console for more information.
          </v-alert>
          <v-card min-width="300px">
            <v-card-title>
              <span class="headline">Add Item</span>
            </v-card-title>
            <v-card-text>
              <v-btn
                color="green-accent-1"
                v-for="(item, index) in items"
                :key="index"
                :loading="loading[item]"
                :disabled="loading[item]"
                @click="addItem(item)"
                class="ma-1"
              >
                {{ item }}
              </v-btn>
            </v-card-text>
            <v-card-actions>
              <v-btn color="red" @click="dialog = false"> Cancel </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth, db } from "@/firebase";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";

export default defineComponent({
  name: "AddItem",
  props: {
    items: {
      type: Array as () => string[],
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      loading: {} as { [key: string]: boolean },
      error: false,
    };
  },
  methods: {
    async addItem(item: string) {
      this.loading[item] = true;
      try {
        await updateDoc(doc(db, `users/${auth.currentUser?.uid}`), {
          tab: arrayUnion({
            name: item,
            date: Timestamp.now(),
          }),
        });
      } catch (error) {
        this.error = true;
        console.error(error);
      } finally {
        this.dialog = false;
        this.loading[item] = false;
      }
    },
  },
  mounted() {
    this.items.forEach((item) => {
      this.loading[item] = false;
    });
  },
});
</script>
