<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-toolbar-title>JCS Tabs</v-toolbar-title>
      <v-spacer />
      <v-btn color="info" @click="showAuthMenu" v-if="!loggedIn"> Login </v-btn>
      <v-btn v-else @click="logout" color="white">Logout</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />

      <div id="firebaseui-auth-container"></div>
    </v-main>
  </v-app>
</template>

<script>
import { auth } from "./firebase";
import { GoogleAuthProvider } from "@firebase/auth";
import "firebaseui";

export default {
  name: "App",
  data() {
    return {
      loginMenu: false,
      loggedIn: false,
    };
  },
  methods: {
    showAuthMenu() {
      let ui = firebaseui.auth.AuthUI.getInstance();
      if (!ui) {
        ui = new firebaseui.auth.AuthUI(auth);
      }
      const uiConfig = {
        signinFlow: "popup",
        signInSuccessUrl: "/",
        signInOptions: [
          {
            provider: GoogleAuthProvider.PROVIDER_ID,
            clientId:
              "557593235569-a0jimberq7k4j3s90klgju18msi1fel0.apps.googleusercontent.com",
          },
        ],
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
      };
      ui.start("#firebaseui-auth-container", uiConfig);
    },
    logout() {
      auth.signOut();
      this.$router.push("/");
      this.loggedIn = false;
    },
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
        this.showAuthMenu();
      }
    });
  },
};
</script>

<style>
* {
  text-decoration: none;
}
</style>
