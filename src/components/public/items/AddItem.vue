<template>
  <VBtn
    color="green-lighten-2"
    :loading="dialog"
    :disabled="dialog"
    @click="dialog = true"
  >
    Add Item
  </VBtn>
  <VDialog
    v-model="dialog"
    :fullscreen="mobile"
    :maxWidth="mobile ? width : '500px'"
    minWidth="330px"
  >
    <VAlert color="error" v-if="error.code">
      <VAlertTitle>{{ error.code }}</VAlertTitle>
      {{ error.message }}
    </VAlert>
    <VCard>
      <VCardTitle align="center">
        <span class="headline">Add Item</span>
      </VCardTitle>
      <VCardText>
        <VBtn
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
        </VBtn>
      </VCardText>
      <VCardActions>
        <VBtn color="red" @click="dialog = false"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
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
    const { mobile, width } = useDisplay();
    return { mobile, width };
  },
  data() {
    return {
      dialog: false,
      loading: {} as { [key: string]: boolean },
      error: {
        code: null,
        message: null,
      } as { code: string | null; message: string | null },
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
      } catch (error: any) {
        this.error = {
          code: error.code,
          message: error.message,
        };
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
