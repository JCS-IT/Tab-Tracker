<script setup>
import { useDataStore } from "./stores/tabs.vue";

const store = useDataStore();
</script>
<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title>JCS Tabs</v-toolbar-title>
      <v-spacer />
      <user-menu v-if="loggedIn" :user="user" @logout="logout()"></user-menu>
    </v-app-bar>
    <v-main>
      <!-- <router-view /> -->
      <div id="firebaseui-auth-container"></div>
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent } from "vue";
import { auth } from "./firebase";
import { GoogleAuthProvider } from "@firebase/auth";
import "firebaseui";
import UserMenu from "./components/UserMenu.vue";

export default defineComponent({
  name: "App",
  components: { UserMenu },
  data() {
    return {
      loginMenu: false,
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
        this.user = {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
      } else {
        this.loggedIn = false;
        this.showAuthMenu();
      }
    });
  },
});
</script>

<style>
* {
  text-decoration: none;
}
</style>
