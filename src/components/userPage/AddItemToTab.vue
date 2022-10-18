<template>
  <VDialog
    v-model="dialog"
    :fullscreen="mobile"
    :max-Width="mobile ? width : '500px'"
    min-width="300px"
  >
    <template v-slot:activator="{ props }">
      <VBtn
        color="green-lighten-2"
        v-bind="props"
        :loading="dialog"
        :disabled="dialog"
      >
        Add Item
      </VBtn>
    </template>
    <VAlert
      v-if="error.code !== null"
      type="error"
      variant="outlined"
      prominent
      class="text-center"
      elevation="2"
    >
      <VAlertTitle>
        {{ error.code }}
      </VAlertTitle>
      {{ error.message }}
    </VAlert>
    <VCard>
      <VCardTitle class="text-center">
        <span>Add Item</span>
      </VCardTitle>
      <VCardText>
        <VBtn v-for="item in items" :key="item.name" @click="addItem(item)">
          {{ item.name }}
        </VBtn>
      </VCardText>
      <VCardActions>
        <VBtn color="red" @click="cancel()"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { auth, db } from "utils/firebase";
import { doc, arrayUnion } from "firebase/firestore";
import type { Item } from "types";
import { useDisplay } from "vuetify";

const dialog = ref(false);
const loading = ref({});
const error = ref({
  code: null as string | null,
  message: null as string | null,
});
const { mobile, width } = useDisplay();

const props = defineProps<{
  items: Item[];
}>();

props.items.forEach((item) => {
  loading.value[item.name] = false;
});

const cancel = () => {
  dialog.value = false;
  loading.value = {};
  error.value = {
    code: null,
    message: null,
  };
};
</script>
