<script setup lang="ts">
import { User } from "@/types";
import { doc } from "firebase/firestore";

const route = useRoute("admin-staff-uid");
const router = useRouter();

const userDoc = useDocument<User>(
  doc(useFirestore(), `users/${route.params.uid}`)
);

const dedupedTab = computed(() => dedupeArray(userDoc.value?.tab ?? []));

const total = computed(() =>
  formatCurrency(sumTab(userDoc.data.value?.tab ?? []))
);
</script>
<template>
  <div class="flex justify-center h-full" v-if="!userDoc">
    <span class="loading loading-infinity w-[5rem]" />
  </div>
  <div class="card bg-base-200 p-5 shadow-lg" v-if="userDoc">
    <div class="card-title">
      <div class="avatar">
        <div class="w-[5rem] rounded-full">
          <img :src="userDoc?.info.photoURL" referrerpolicy="no-referrer" />
        </div>
      </div>
      <h3>
        {{ userDoc?.info.displayName }}
      </h3>
    </div>
    <div class="card-body">
      <h1 class="text-center">Current Tab: {{ total }}</h1>
      <div class="overflow-y-auto">
        <table class="table w-full table-zebra">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in dedupedTab" :key="index">
              <tr v-if="countItemsInTab(userDoc.tab)[item.name] > 0">
                <td>{{ item.name }}</td>
                <td>
                  {{ countItemsInTab(userDoc.tab)[item.name] }}
                </td>
                <td>
                  {{ formatCurrency(item.price) }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="divider" />
      <div tabindex="0" class="collapse collapse-arrow border border-zinc-400">
        <div class="collapse-title">
          <h1>
            <Icon name="mdi:history" />
            History
          </h1>
        </div>
        <div class="overflow-y-auto collapse-content">
          <table class="table w-full table-zebra">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in reverseTab(userDoc?.tab)"
                :key="index"
                v-memo="userDoc.tab"
              >
                <td>{{ item.name }}</td>
                <td>{{ formatCurrency(item.price) }}</td>
                <td>{{ item.date.toDate().toLocaleDateString() }}</td>
                <td>{{ item.date.toDate().toLocaleTimeString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="divider" />
      <div>
        <AdminToggleRole :user="userDoc" />
      </div>
      <div class="divider" />
      <div>
        <button class="btn btn-ghost" @click="router.push('/admin/staff')">
          Back
        </button>
        <ClearTab
          v-if="sumTab(userDoc.tab) > 0"
          :name="userDoc.info.displayName"
          :email="userDoc.info.email"
          text
        />
        <ClearHistory
          v-if="userDoc.tab.length > 0"
          :name="userDoc.info.displayName"
          :email="userDoc.info.email"
        />
      </div>
    </div>
  </div>
</template>
