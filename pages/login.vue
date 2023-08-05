<script setup lang="ts">
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const ignoreErrorCode = [
  "auth/account-exists-with-different-credential",
  "auth/credential-already-in-use",
  "auth/cancelled-popup-request",
  "auth/popup-closed-by-user",
];

const router = useRouter();
const route = useRoute();
const auth = useFirebaseAuth()!;
const provider = new GoogleAuthProvider();

const error = ref<string | null>(null);

const to = route.query.r?.toString() || "/";

// lifecycle
const currentUser = await getCurrentUser();
if (currentUser) {
  router.push(to);
} else {
  signInWithPopup(auth, provider)
    .then(() => {
      router.push(to);
    })
    .catch((err) => {
      if (err.code === "auth/popup-blocked") {
        error.value = "Please allow popups to continue";
        return;
      }
      if (ignoreErrorCode.includes(err.code)) return;

      error.value = err.message;
      console.error(err);
    });
}
</script>

<template>
  <div class="h-full flex items-center">
    <div class="alert alert-error" v-if="error">
      {{ error }}
    </div>
    <span class="loading loading-infinity loading-lg" v-else />
  </div>
</template>
