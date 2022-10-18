<script setup lang="ts">
import { ref } from "vue";
import { auth } from "utils/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const alert = ref(false);
const error = ref({
  message: "",
  status: "",
});

const provider = new GoogleAuthProvider();
const signIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      router.push("/");
    })
    .catch((err) => {
      alert.value = true;
      const { error } = JSON.parse(err.message.match(/{.*}/g));
      console.log(error);
      error.value = error;
    });
};
</script>

<template>
  <VContainer class="d-flex justify-center align-center">
    <VCard color="dark-grey" width="400" class="text-center">
      <VCardTitle class="text-center">
        <h1>Login</h1>
      </VCardTitle>
      <VDivider />
      <VCardText>
        <VAlert type="error" v-if="alert" variant="outlined" prominent>
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
        </VAlert>
        <VBtn @click="signIn()" v-else>
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
