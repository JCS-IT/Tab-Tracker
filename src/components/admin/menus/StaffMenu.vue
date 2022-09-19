<template>
  <v-container fluid>
    <v-row>
      <v-col width="100px">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="search"
              label="Search"
              v-bind="props"
              append-inner-icon="mdi-magnify"
            />
          </template>
          <v-list>
            <v-list-item v-for="(user, index) in searchForUser" :key="index">
              <v-list-item-title @click="getUser(user)">
                {{ user?.data?.displayName }}
              </v-list-item-title>
              <v-divider />
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-expansion-panels v-model="panels" multiple>
        <v-expansion-panel
          v-for="letter in letters"
          :key="letter"
          :id="letter"
          :value="letter"
          class="mb-2"
        >
          <v-expansion-panel-title>
            <b>{{ letter.toUpperCase() }}</b>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <User
              v-for="user in filterUsers(letter)"
              :key="user?.data?.email"
              :user="user"
              :items="items"
              :ref="user?.data?.email"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { auth, db } from "@/firebase";
import type { User, Item } from "@/types";
import { doc, collection, onSnapshot } from "@firebase/firestore";

let userSnap: () => void;
let itemSnap: () => void;

export default defineComponent({
  name: "StaffMenu",
  components: {
    User: defineAsyncComponent(
      () => import("@/components/admin/components/User.vue")
    ),
  },
  data() {
    return {
      search: "",
      items: [] as Item[],
      panels: [] as string[],
      users: [] as User[],
      letters: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
      ] as string[],
    };
  },
  computed: {
    searchForUser() {
      return this.users.filter((user: User) => {
        return user.data.displayName
          .toLowerCase()
          .includes(this.search.toLowerCase()) as boolean;
      }) as User[];
    },
  },
  methods: {
    getUser(user: User) {
      this.panels = [];
      const panel = user.data.displayName.split(" ")[1].toLowerCase().charAt(0);
      this.panels.push(panel);
      const element = document.getElementById(panel);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.$refs[user.data.email][0].dialog = true;
      }, 500);
    },
    filterUsers(letter: string) {
      return this.users?.filter((user: User) => {
        return user.data.displayName
          .split(" ")[1]
          ?.toLowerCase()
          .startsWith(letter);
      });
    },
  },
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        userSnap = onSnapshot(collection(db, "users"), (snap) => {
          this.users = [];
          snap.forEach((doc) => {
            this.users.push(doc.data() as User);
          });
        });
        itemSnap = onSnapshot(doc(db, "admin/items"), (doc) => {
          if (doc.exists()) {
            this.items = doc.data().food as Item[];
          }
        });
      } else {
        userSnap();
        itemSnap();
      }
    });
  },
});
</script>
