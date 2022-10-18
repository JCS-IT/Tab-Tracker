<template>
  <VDialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props }">
      <VBtn v-bind="props" color="green-lighten-2" @click="dialog = true">
        Feedback
      </VBtn>
    </template>
    <VCard :loading="loading">
      <VAlert
        v-if="error"
        type="error"
        dismissible
        transition="scale-transition"
        elevation="2"
        color="red"
      >
        {{ error }}
      </VAlert>
      <VCardTitle class="headline">Feedback Submission</VCardTitle>
      <VCardText>
        <VForm ref="input">
          <VTextarea
            v-model="input.text"
            label="Feedback"
            placeholder="Enter your feedback here..."
            outlined
            rows="5"
            :rules="rules.text"
          />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn color="green-lighten-2" text @click="submit">Submit</VBtn>
        <VBtn color="error" text @click="dialog = false">Cancel</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { auth, db } from "@/firebase";
import { addDoc, Timestamp, collection } from "firebase/firestore";

const dialog = ref(false);
const input = ref({
  text: "",
});
const loading = ref(false);
const error = ref("");
const rules = {
  text: [(v: string) => !!v || "Field cannot be empty"],
};

const submit = async () => {
  // @ts-expect-error
  const inputValidation = await input.value?.validate();
  if (inputValidation.valid === false) return;
  loading.value = true;
  try {
    await addDoc(collection(db, "feedback"), {
      name: auth.currentUser?.displayName,
      email: auth.currentUser?.email,
      date: Timestamp.now(),
      text: input.value.text,
    });
    input.value.text = "";
    error.value = "";
    dialog.value = false;
  } catch (err) {
    // @ts-ignore
    error.value = err.message as string;
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>
