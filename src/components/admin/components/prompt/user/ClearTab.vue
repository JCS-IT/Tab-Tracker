<template>
  <VDialog v-model="dialog" max-width="300px">
    <template v-slot:activator="{ props }">
      <VBtn v-bind="props" color="red" :loading="dialog"> Clear Tab </VBtn>
    </template>
    <VCard :disabled="loading" :loading="loading">
      <VCardTitle>Are you sure?</VCardTitle>
      <VCardSubtitle>this action cannot be undone.</VCardSubtitle>
      <VCardText>
        Are you sure you want to clear the tab for <strong>{{ name }}</strong
        >?
      </VCardText>
      <VCardActions>
        <VBtn
          color="error"
          @click="clearTab()"
          :disabled="loading"
          :loading="loading"
        >
          Confirm
        </VBtn>
        <VBtn color="primary" @click="dialog = false">Cancel</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { functions } from "@/firebase";
import { httpsCallable } from "@firebase/functions";

const props = defineProps<{
  name: string | undefined;
  email: string | undefined;
}>();

const dialog = ref(false);
const loading = ref(false);
const error = ref(null as Error | null);

const clearTab = async () => {
  loading.value = true;
  try {
    const clearTab = httpsCallable(functions, "clearTab");
    await clearTab({ email: props.email });
    dialog.value = false;
  } catch (err) {
    error.value = err as Error;
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<!-- <script lang="ts">
export default defineComponent({
  name: "ClearTab",
  props: {
    email: {
      type: String as () => string | null | undefined,
      required: true,
    },
    name: {
      type: String as () => string | null | undefined,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      error: "",
    };
  },
  methods: {
    async clearTab() {
      this.loading = true;
      try {
        const clearTab = httpsCallable(functions, "clearTab");
        await clearTab({ email: this.email });
        this.dialog = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
</script> -->
