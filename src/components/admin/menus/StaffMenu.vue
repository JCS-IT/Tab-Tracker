<template>
  <v-container>
    <v-row>
      <v-expansion-panels>
        <v-expansion-panel v-for="letter in letters" :key="letter">
          <v-expansion-panel-title>
            <b>{{ letter.toUpperCase() }}</b>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-tooltip
              bottom
              v-for="(user, index) in filterUsers(letter)"
              :key="index"
            >
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" @click="dialog[index] = true">
                  <v-avatar>
                    <v-img :src="user?.data.photoURL" alt="Avatar" />
                  </v-avatar>
                </v-btn>
                <v-dialog v-model="dialog[index]">
                  <v-card width="200px">
                    <v-card-title>
                      <v-avatar>
                        <v-img :src="user?.data.photoURL" alt="Avatar" />
                      </v-avatar>
                      <span>{{ user.data.displayName }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-list>
                        <v-list-item
                          v-for="(item, index) in items"
                          :key="index"
                        >
                          <v-list-item-title>{{ item }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ total(item, user) }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        color="primary"
                        @click="dialog[index] = false"
                        text
                      >
                        Close
                      </v-btn>
                      <ClearTab :uid="user.data.uid" />
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <span>{{ user?.data.displayName }}</span>
            </v-tooltip>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import { auth, db } from "@/firebase";
import { doc, collection, onSnapshot, Timestamp } from "firebase/firestore";
let userSub: () => void;
let itemSub: () => void;

interface User {
  data: {
    displayName: string;
    email: string;
    photoURL: string;
    uid: string;
  };
  tab: [
    {
      data: Timestamp;
      name: string;
    }
  ];
}

interface Dialog {
  [key: string]: boolean;
}

export default defineComponent({
  components: {
    DeleteUser: defineAsyncComponent(() => import("../prompts/DeleteUser.vue")),
    User: defineAsyncComponent(() => import("../components/User.vue")),
    ClearTab: defineAsyncComponent(() => import("../prompts/ClearTab.vue")),
  },
  data() {
    return {
      dialog: {} as Dialog,
      users: [] as User[],
      items: [] as string[],
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
      ],
    };
  },
  methods: {
    filterUsers(letter: string) {
      return this.users?.filter((user: User) => {
        return user.data.displayName
          .split(" ")[1]
          ?.toLowerCase()
          .startsWith(letter);
      });
    },
    total(item: string, user: User) {
      return user.tab.filter((tab: { name: string }) => {
        return tab.name === item;
      }).length;
    },
  },
  beforeDestroy() {
    userSub();
    itemSub();
  },
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        userSub = onSnapshot(collection(db, "users"), (snapshot) => {
          this.users = [];
          snapshot.forEach((doc) => {
            // @ts-ignore
            this.users.push(doc.data());
            this.dialog[doc.id] = false;
          });
        });
        itemSub = onSnapshot(doc(db, "admin/items"), (snapshot) => {
          this.items = snapshot.data()?.food;
        });
      } else {
        userSub();
        itemSub();
      }
    });
  },
});
</script>
