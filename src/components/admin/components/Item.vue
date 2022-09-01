<template>
  <v-card width="200px" :loading="loading" :disabled="loading">
    <v-alert v-if="error != null">
      {{ error }}
    </v-alert>
    <v-card-title>
      {{ item.name }}
    </v-card-title>
    <v-card-text class="pb-0">
      <v-form>
        <v-text-field
          label="Price"
          variant="outlined"
          type="number"
          v-model="item.price"
          prefix="$"
          :rules="rules.price"
          @keyup.enter="updateItem()"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="updateItem()" color="green" :loading="loading">
        Update
      </v-btn>
      <v-btn @click="removeItem(item)" prepend-icon="mdi-delete" color="red">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { functions } from "@/firebase";
import { httpsCallable } from "@firebase/functions";
import type { Item } from "@/types";

export default defineComponent({
  name: "ItemComponent",
  data() {
    return {
      loading: false,
      dialog: false,
      error: null as string | null,
      rules: {
        price: [(v: unknown) => !!v || "Price is required"],
      },
      item: {
        name: this.input.name,
        price: this.input.price,
      } as Item,
    };
  },
  props: {
    input: {
      type: Object as () => Item,
      required: true,
    },
    items: {
      type: Array as () => Item[],
      required: true,
    },
  },
  methods: {
    async updateItem() {
      this.loading = true;
      try {
        // update item in array
        const temp = [...this.items] as Item[];
        const index = this.items.findIndex((i) => i.name === this.item.name);
        temp[index].price = this.item.price;

        const updateItem = httpsCallable(functions, "updateItem");
        await updateItem({
          items: temp,
        });
      } catch (error) {
        this.error = error as string;
      } finally {
        this.loading = false;
      }
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
});
</script>
