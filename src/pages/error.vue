<template>
  <v-container align="center">
    <v-row>
      <v-col>
        <h1>There was an error talking to firebase</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="$router.back()">Try Again</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="json">
{
  "path": "/error",
  "name": "error",
  "meta": {
    "requiresAuth": false
  }
}
</route>
