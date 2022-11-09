<template>
  <v-container fluid align="center">
    <v-row>
      <v-col>
        <v-progress-circular indeterminate />
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="json">
{
  "path": "/",
  "name": "home",
  "meta": {
    "requiresAuth": false
  }
}
</route>
