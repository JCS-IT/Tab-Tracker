<template>
  <v-container align="center" v-if="user && items">
    <v-row>
      <v-col>
        <AddItemToTab :items="items" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card max-width="800px">
          <v-card-title> Current Tab </v-card-title>
          <v-card-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in items" :key="index">
                  <tr v-if="count()[item.name] > 0">
                    <td>{{ item.name }}</td>
                    <td>{{ count()[item.name] }}</td>
                    <td>
                      {{
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(item.price)
                      }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-text>
            <v-row>
              <v-col align="right">
                <h3 class="mr-2">Total: {{ total() }}</h3>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card max-width="800px">
          <v-card-title> Recent Transactions </v-card-title>
          <v-card-text>
            <v-pagination v-model="page" :length="MathTime()" />
            <v-table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in visibleItems" :key="index">
                  <tr v-if="count()[item.name] > 0">
                    <td>{{ item.name }}</td>
                    <td>
                      {{
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(item.price)
                      }}
                    </td>
                    <td>
                      {{ item.date.toDate().toLocaleDateString() }}
                    </td>
                    <td>
                      {{ item.date.toDate().toLocaleTimeString() }}
                    </td>
                    <DeleteItemFromTab
                      :item="item"
                      v-if="canDelete(item.date)"
                    />
                  </tr>
                </template>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-footer app color="primary" height="50px">
          <v-row justify="center" no-gutters>
            <FeedBack />
          </v-row>
        </v-footer>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else fluid align="center">
    <v-row>
      <v-col> <h1>Fetching your profile...</h1></v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-progress-linear indeterminate />
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="json">
{
  "path": "/user",
  "name": "user",
  "meta": {
    "requiresAuth": true
  }
}
</route>

<script setup lang="ts">
import type { Timestamp } from "firebase/firestore";
import type { User, Item } from "@/types";

const { mobile } = useDisplay();
const router = useRouter();

// data
const page = ref(1);
const perPage = 5;
const user = ref<User | null>(null);
const items = ref<Item[]>([]);

// firebase
const itemSub = onSnapshot(doc(db, "admin/items"), (doc) => {
  items.value = doc.data()?.food as Item[];
});

const userSub = onSnapshot(
  // @ts-expect-error
  doc(db, "users", auth.currentUser.uid),
  (doc) => {
    if (doc.exists()) {
      user.value = doc.data() as User;
      user.value.tab.reverse();
    } else {
      console.log("No such document!");
    }
  }
);

onBeforeUnmount(() => {
  itemSub();
  userSub();
});
// computed properties
const count = () => {
  const total = {} as { [key: string]: number };
  items.value?.forEach((item) => {
    total[item.name] = 0;
  });
  user.value?.tab?.forEach((item) => {
    total[item.name]++;
  });
  return total;
};

const total = () => {
  let total = 0;
  user.value?.tab?.forEach((item) => {
    total += item.price;
  });
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(total);
};

const visibleItems = computed(() => {
  return user.value?.tab.slice(
    (page.value - 1) * perPage,
    page.value * perPage
  );
});

const canDelete = (date: Timestamp) => {
  const now = new Date();
  const diff = now.getTime() - date.toDate().getTime();
  return diff < 300000;
};

// methods
const MathTime = () => {
  if (user.value?.tab.length) {
    return Math.ceil(user.value.tab.length / perPage);
  }
};

setTimeout(() => {
  if (!user.value) {
    router.push({
      name: "error",
    });
  }
}, 5000);
</script>
