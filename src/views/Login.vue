<template>
  <v-container class="d-flex justify-center align-center">
    <v-card color="dark-grey" width="300">
      <v-card-title class="text-center">
        <h1>Login</h1>
      </v-card-title>
      <div id="firebaseui-auth-container"></div>
      <v-container id="loader" align="center">
        loading...
        <v-progress-circular indeterminate />
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/firebase";
import { GoogleAuthProvider } from "@firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
export default defineComponent({
  name: "Login-view",
  data() {
    return {
      loggedIn: false,
      user: {},
    };
  },
  methods: {
    showAuthMenu() {
      let ui = firebaseui.auth.AuthUI.getInstance();
      if (!ui) {
        ui = new firebaseui.auth.AuthUI(auth);
      }
      const uiConfig = {
        callbacks: {
          uiShown: () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            document.getElementById("loader")!.style.display = "none";
          },
        },
        signinFlow: "popup",
        signInSuccessUrl: "/",
        signInOptions: [
          {
            provider: GoogleAuthProvider.PROVIDER_ID,
            clientID:
              "557593235569-a0jimberq7k4j3s90klgju18msi1fel0.apps.googleusercontent.com",
          },
        ],
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
      };
      ui.start("#firebaseui-auth-container", uiConfig);
    },
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.showAuthMenu();
      }
    });
  },
});
</script>
