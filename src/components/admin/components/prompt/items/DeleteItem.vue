<template>
  <VDialog v-model="dialog">
    <template v-slot:activator>
      <VBtn
        color="red"
        :loading="loading.pending"
        @click="
          dialog = true;
          loading.pending = true;
        "
      >
        Delete
      </VBtn>
    </template>
    <VCard :loading="loading.confirm" :disabled="loading.confirm">
      <VAlert v-if="error != null">
        {{ error }}
      </VAlert>
      <VCardTitle> Are you sure? </VCardTitle>
      <VCardSubtitle> This will permanently delete this item. </VCardSubtitle>
      <VCardActions>
        <VBtn @click="deleteItem()" color="red" :loading="loading.confirm">
          Delete
        </VBtn>
        <VBtn
          @click="
            dialog = false;
            loading.pending = false;
          "
          color="green"
        >
          Cancel
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { functions } from "@/firebase";
import { httpsCallable } from "@firebase/functions";
import type { Item } from "@/types";
</script>

<script lang="ts">
export default defineComponent({
  data() {
    return {
      loading: {
        pending: false,
        confirm: false,
      },
      dialog: false,
      error: null as string | null,
    };
  },
  props: {
    item: {
      type: Object as () => Item,
      required: true,
    },
  },
  methods: {
    async deleteItem() {
      try {
        const deleteItem = httpsCallable(functions, "deleteItem");
        await deleteItem({ item: this.item });
        this.dialog = false;
      } catch (error) {
        console.log(error);
        this.error = error as string;
      } finally {
        this.loading = {
          pending: false,
          confirm: false,
        };
      }
    },
  },
});
</script>
