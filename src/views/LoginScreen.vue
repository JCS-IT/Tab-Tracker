<template>
  <VContainer class="d-flex justify-center align-center">
    <VCard color="dark-grey" :width="alert ? '400' : '300'">
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
        <template v-else>
          <VBtn @click="signIn()">
            <VImg
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              style="width: 20px; height: 20px; margin-right: 10px"
              icon
            />
            Continue with Google
          </VBtn>
        </template>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
</script>

<script lang="ts">
export default defineComponent({
  name: "Login-view",
  data() {
    return {
      alert: false,
      error: {
        status: "",
        message: "",
      } as {
        message: string;
        status: string;
      },
    };
  },
  methods: {
    signIn() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then(() => {
          this.$router.push("/user");
        })
        .catch((error) => {
          try {
            const errorMessage = error.message.match(/{.*}/g);
            const json = JSON.parse(errorMessage);
            this.error = json.error;
            this.alert = true;
          } catch {
            this.alert = true;
            this.error = {
              status: "UNKNOWN_ERROR",
              message: error.message,
            };
          }
        });
    },
  },
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$router.push("/user");
      }
    });
  },
});
</script>
