<script setup lang="ts">
const route = useRoute();
const codes: Record<string, string> = {
  "503": "There was an error talking to firebase",
  "408": "We timed out trying to fetch your profile",
};

const resolveCode = () => {
  const code = route.query.err?.toString() ?? "503";
  return codes[code];
};
</script>

<template>
  <VContainer align="center">
    <VRow>
      <VCol>
        <h1>{{ resolveCode() }}</h1>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VBtn @click="$router.back()">Try Again</VBtn>
      </VCol>
    </VRow>
  </VContainer>
</template>

<route lang="json">
{
  "path": "/error",
  "name": "error",
  "meta": {
    "requiresAuth": false,
    "transition": "fade-transition"
  }
}
</route>
