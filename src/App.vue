<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  mounted() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Registration succesful, scope: " + reg.scope);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>

<style>
* {
  text-decoration: none;
}
</style>
