<!-- eslint-disable vue/no-mutating-props -->
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
      {{ input.name }}
    </VCardTitle>
    <VCardText class="pb-0">
      <VForm>
        <VTextField
          label="Price"
          variant="outlined"
          type="number"
          v-model="input.price"
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
      <DeleteItem :item="input" />
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, defineProps } from "vue";
import { functions } from "@/firebase";
import { httpsCallable } from "@firebase/functions";
import type { Item } from "@/types";

const DeleteItem = defineAsyncComponent(
  () => import("./prompt/items/DeleteItem.vue")
);

const props = defineProps<{
  input: Item;
  items: Item[];
}>();

const loading = ref({
  update: false,
  delete: false,
  dialog: false,
});

const error = ref(null as string | null);

const rules = {
  price: [(v: number) => !!v || "Price is required"],
};

const updateItem = async () => {
  loading.value.update = true;
  try {
    await httpsCallable(
      functions,
      "updateItem"
    )({
      items: props.items,
    });
  } catch (err) {
    console.error(err);
    error.value = err as string;
  } finally {
    loading.value.update = false;
  }
};
</script>

<!-- <script lang="ts">
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
</script> -->
