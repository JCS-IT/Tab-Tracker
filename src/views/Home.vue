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

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/firebase";

export default defineComponent({
  name: "HomeView",
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$router.push("/user");
      } else {
        this.$router.push("/login");
      }
    });
  },
});
</script>
