<script setup lang="ts">
import { auth } from "@/firebase";
import router from "@/router";

if (auth.currentUser) {
  router.push({ name: "User" });
} else {
  router.push({ name: "Login" });
}
</script>

<template>
  <VContainer align="center">
    <VRow>
      <VCol>
        <VCard color="blue-lighten-2" width="300px">
          <VCardTitle> Please wait... </VCardTitle>
          <VCardText>
            <VProgressCircular indeterminate />
          </VCardText>
          <VCardActions>
            <VBtn
              color="primary"
              variant="text"
              @click="$router.push({ name: 'User' })"
            >
              stuck? click here
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
