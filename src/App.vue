<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-toolbar-title>JCS Tabs</v-toolbar-title>
      <v-spacer />
      <div id="firebaseui-auth-container"></div>
      <v-btn color="info" v-if="!loggedIn" @click="showAuthMenu"> Login </v-btn>
      <v-btn v-else @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
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
      props: {},
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
        callbacks: {
          signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            return false;
          },
        },
        signInFlow: "popup",
        signInOptions: [
          {
            provider: GoogleAuthProvider.PROVIDER_ID,
          },
        ],
      };
      setTimeout(() => {
        ui.start("#firebaseui-auth-container", uiConfig);
      }, 4);
    },
    logout() {
      auth.signOut();
    },
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
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
