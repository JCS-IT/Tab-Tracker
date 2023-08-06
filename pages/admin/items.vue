<script setup>
import { doc } from "firebase/firestore";
const items = useDocument(doc(useFirestore(), "admin/items"));

// Computed
const isLoading = computed(() => {
  return items.pending.value;
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
        <div class="overflow-y-auto">
          <table class="table w-full table-zebra">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th class="w-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item, index) in items.food" :key="index">
                <tr>
                  <td>{{ item.name }}</td>
                  <td>{{ formatCurrency(item.price) }}</td>
                  <td class="join">
                    <button class="btn btn-sm btn-ghost join-item">
                      <Icon
                        name="mdi:pencil"
                        class="text-green-500"
                        size="24"
                      />
                    </button>
                    <button class="btn btn-sm btn-ghost join-item">
                      <Icon name="mdi:delete" class="text-red-500" size="24 " />
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
