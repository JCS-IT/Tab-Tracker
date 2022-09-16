<template>
  <v-container class="d-flex justify-center align-center">
    <v-card
      color="dark-grey"
      :width="alert ? '400' : '300'"
      :disabled="loading"
      :loading="loading"
    >
      <v-card-title class="text-center">
        <h1>Login</h1>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-alert type="error" v-if="alert" variant="outlined" prominent>
          <v-alert-title>
            {{ error.status.replace("_", " ") }}
          </v-alert-title>
          {{ error.message }}
          <v-divider />
          <v-btn
            variant="text"
            class="float-right"
            color="blue"
            @click="alert = false"
            >Dismiss</v-btn
          >
        </v-alert>
        <div class="text-center" v-else>
          <v-btn @click="signIn()">
            <v-img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              style="width: 20px; height: 20px; margin-right: 10px"
            />
            Continue with Google
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";

export default defineComponent({
  name: "Login-view",
  data() {
    return {
      loading: false,
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
          console.log(error);
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
  mounted() {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.$router.push("/user");
      }
    });
  },
});
</script>
