<template>
  <VDialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props }">
      <VBtn color="green-lighten-2" dark v-bind="props">Feedback</VBtn>
    </template>
    <VCard :loading="loading" :disabled="loading">
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
      <VCardTitle class="headline">Feedback</VCardTitle>
      <VCardText>
        <VForm ref="input" lazy-validation>
          <VTextarea
            v-model="input.text"
            :rules="rules"
            label="Feedback"
            placeholder="Enter your feedback here"
            required
          />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn color="green-lighten-2" text @click="submit()">Submit</VBtn>
        <VBtn color="red-lighten-2" text @click="cancel()">Cancel</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { auth, db } from "utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const dialog = ref(false);
const input = ref({
  text: "",
});
const loading = ref(false);
const error = ref("Hello World");
const rules = [
  (v: string) => !!v || "Field cannot be empty",
  (v: string) => v.length >= 10 || "Min 10 characters",
];

const submit = async () => {
  // @ts-ignore
  const { valid } = await input.value.validate();
  console.log(valid);
  if (!valid) return;
  loading.value = true;
  if (auth.currentUser) {
    await addDoc(collection(db, "feedback"), {
      date: Timestamp.now(),
      email: auth.currentUser?.email,
      name: auth.currentUser?.displayName,
      text: input.value.text,
    });
  }
};

const cancel = () => {
  dialog.value = false;
  input.value.text = "";
  loading.value = false;
  error.value = "";
};
</script>
