import type { ParsedToken } from "firebase/auth";

interface AdminClaims extends ParsedToken {
  admin: boolean;
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = await useFirebaseAuth();

  if (!auth?.currentUser) abortNavigation();

  const claims = auth?.currentUser
    ?.getIdTokenResult()
    .then((r) => r?.claims) as AdminClaims | undefined;

  if (!claims?.admin) abortNavigation();
});
