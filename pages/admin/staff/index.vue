<script setup lang="ts">
import { User } from "@/types";
import { doc } from "firebase/firestore";

interface UserWithUid extends Omit<User["info"], "createdAt"> {
  uid: string;
}

const index = useDocument<{ users: UserWithUid[] }>(
  doc(useFirestore(), "admin/_index")
);

const router = useRouter();

// Data
const search = ref("");

// Computed
const isLoading = computed(() => {
  return index.pending.value;
});

const filterUsers = computed(() => {
  return index.value?.users.filter((user) => {
    return user.displayName.toLowerCase().includes(search.value.toLowerCase());
  });
});
</script>

<template>
  <div
    class="h-full flex flex-col justify-center items-center"
    v-if="isLoading"
  >
    <span class="loading loading-infinity loading-lg" />
  </div>

  <div class="grid justify-center" v-else>
    <div class="card w-96 bg-base-200 shadow-xl">
      <div class="card-body">
        <input
          type="search"
          class="input input-bordered"
          placeholder="Search"
          v-model="search"
        />
        <ul class="grid gap-2">
          <li
            class="hover:bg-base-300 p-2 rounded-xl"
            v-for="user in filterUsers"
            @click="router.push(`/admin/staff/${user.uid}`)"
          >
            <div class="grid grid-cols-2">
              <div class="avatar">
                <div class="w-10 rounded-full">
                  <img :src="user.photoURL" referrerpolicy="no-referrer" />
                </div>
              </div>
              <h2 class="mt-[5%]">
                {{ user.displayName }}
              </h2>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
