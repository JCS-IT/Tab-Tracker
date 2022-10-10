<template>
  <VContainer fluid align="center">
    <VRow>
      <VCol>
        <AddItem />
      </VCol>
    </VRow>
    <VRow>
      <VCol v-for="item in items" :key="item.name">
        <Item :input="item" :items="items" />
      </VCol>
    </VRow>
  </VContainer>
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
    Item: defineAsyncComponent(() => import("../components/Item.vue")),
  },
  methods: {
    async deleteItem(item: Item) {
      this.loading = true;
      try {
        const deleteItem = httpsCallable(functions, "deleteItem");
        await deleteItem({ item: item });
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
