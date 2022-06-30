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
import { Timestamp } from "@firebase/firestore";

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
      }
    });
    console.log(Timestamp.now().toDate().getFullYear());
  },
};
</script>

<style>
* {
  text-decoration: none;
}
</style>
