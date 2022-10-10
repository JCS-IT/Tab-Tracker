<template>
  <VCard
    width="200px"
    :loading="loading.update || loading.delete"
    :disabled="loading.update"
  >
    <VAlert v-if="error != null">
      {{ error }}
    </VAlert>
    <VCardTitle>
      {{ item.name }}
    </VCardTitle>
    <VCardText class="pb-0">
      <VForm>
        <VTextField
          label="Price"
          variant="outlined"
          type="number"
          v-model="item.price"
          prefix="$"
          :rules="rules.price"
          @keyup.enter="updateItem()"
        />
      </VForm>
    </VCardText>
    <VCardActions>
      <VBtn @click="updateItem()" color="green" :loading="loading.update">
        Update
      </VBtn>
      <DeleteItem :item="item" />
    </VCardActions>
  </VCard>
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
