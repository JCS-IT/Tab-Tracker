<template>
  <v-card
    width="200px"
    :loading="loading.update || loading.delete"
    :disabled="loading.update"
  >
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
      <v-btn @click="updateItem()" color="green" :loading="loading.update">
        Update
      </v-btn>
      <delete-item :item="item" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { functions } from "@/firebase";
import { httpsCallable } from "@firebase/functions";
import type { Item } from "@/types";

export default defineComponent({
  name: "ItemComponent",
  data() {
    return {
      loading: {
        update: false,
        delete: false,
        dialog: false,
      },
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
      this.loading.update = true;
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
        this.loading.update = false;
      }
    },
  },
  components: {
    DeleteItem: defineAsyncComponent(
      () => import("../components/prompt/items/DeleteItem.vue")
    ),
  },
});
</script>
