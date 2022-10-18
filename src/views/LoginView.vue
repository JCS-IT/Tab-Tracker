<template>
  <VContainer class="d-flex justify-center align-center">
    <VCard color="dark-grey" width="400">
      <VCardTitle class="text-center">
        <h1>Login</h1>
      </VCardTitle>
      <VDivider />
      <VCardText>
        <!-- <VAlert type="error" v-if="alert" variant="outlined" prominent>
          <VAlertTitle>
            {{ error.status.replace("_", " ") }}
          </VAlertTitle>
          {{ error.message }}
          <VDivider />
          <VBtn
            variant="text"
            class="float-right"
            color="blue"
            @click="alert = false"
          >
            Dismiss
          </VBtn>
        </VAlert> -->
        <VBtn @click="signIn()">
          <VImg
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            style="width: 20px; height: 20px; margin-right: 10px"
            icon
          />
          Continue with Google
        </VBtn>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import { auth } from "utils/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";

const router = useRouter();

const provider = new GoogleAuthProvider();
const signIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      router.push("/");
    })
    .catch((error) => {
      notify({
        title: error.status.replace("_", " "),
        text: error.message,
        type: "error",
      });
      console.log(error);
    });
};
</script>
