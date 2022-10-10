<template>
  <VBtn color="red" :loading="dialog" :disabled="dialog" @click="dialog = true">
    <VIcon>mdi-delete</VIcon>
  </VBtn>
  <VDialog
    v-model="dialog"
    overlay
    transition="dialog-transition"
    maxWidth="400px"
  >
    <VCard class="text-center">
      <VCardTitle>
        <span class="headline">Delete Item</span>
      </VCardTitle>
      <VCardSubtitle>
        {{ item?.name }} at {{ item?.date.toDate().toLocaleString() }}
      </VCardSubtitle>
      <VCardText>
        <span> Are you sure you want to delete this item? </span>
      </VCardText>
      <VCardActions>
        <VBtn
          color="green"
          @click="deleteItem"
          :loading="loading"
          :disabled="loading"
        >
          Delete
        </VBtn>
        <VBtn color="red" @click="dialog = false"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth, db } from "@/firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { useDisplay } from "vuetify";

export default defineComponent({
  name: "DeleteItem",
  props: {
    item: Object,
    tab: Object,
  },
  setup() {
    const { mobile } = useDisplay();
    return { mobile };
  },
  data() {
    return {
      dialog: false,
      loading: false,
      error: false,
    };
  },
  methods: {
    async deleteItem() {
      this.loading = true;
      try {
        await updateDoc(doc(db, `users/${auth.currentUser?.uid}`), {
          tab: arrayRemove(this.item),
        });
      } catch (error) {
        this.error = true;
        console.error(error);
      } finally {
        this.loading = false;
        this.dialog = false;
      }
    },
  },
});
</script>
