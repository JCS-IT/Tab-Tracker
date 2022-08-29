<template>
  <v-container>
    <v-row>
      <v-col width="100px">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="search"
              placeholder="Search"
              v-bind="props"
            />
          </template>
          <v-list>
            <v-list-item v-for="(user, index) in searchForUser" :key="index">
              <v-list-item-title @click="getUser(user)">
                {{ user.data.displayName }}
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
          :value="letter"
          :id="letter"
        >
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
                <v-btn
                  icon
                  v-bind="props"
                  @click="dialog[user.data.uid] = true"
                >
                  <v-avatar>
                    <v-img :src="user?.data.photoURL" alt="Avatar" />
                  </v-avatar>
                </v-btn>
                <v-dialog v-model="dialog[user.data.uid]" persistent>
                  <v-card>
                    <v-card-title>
                      <v-avatar>
                        <v-img :src="user?.data.photoURL" alt="Avatar" />
                      </v-avatar>
                      <span>{{ user.data.displayName }}</span>
                    </v-card-title>
                    <v-divider />
                    <v-card-text>
                      <h4>Tab:</h4>
                      <v-list>
                        <v-list-item
                          v-for="(item, index) in items"
                          :key="index"
                        >
                          <v-list-item-title>
                            {{ item }}s:
                            {{ total(item, user) }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                    <v-divider />
                    <v-card-text>
                      <h4>Roles:</h4>
                      <v-switch
                        :loading="loading"
                        :disabled="loading"
                        :model-value="user.roles.admin"
                        label="Administrator"
                        @click="toggleAdmin(user)"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        color="primary"
                        @click="dialog[user.data.uid] = false"
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
import { auth, db, functions } from "@/firebase";
import { doc, collection, onSnapshot, Timestamp } from "firebase/firestore";
import { httpsCallable } from "@firebase/functions";
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
  roles: {
    admin: boolean;
    dev: boolean;
  };
}

interface Dialog {
  [key: string]: boolean;
}

export default defineComponent({
  components: {
    DeleteUser: defineAsyncComponent(() => import("../prompts/DeleteUser.vue")),
    ClearTab: defineAsyncComponent(() => import("../prompts/ClearTab.vue")),
  },
  data() {
    return {
      dialog: {} as Dialog,
      users: [] as User[],
      items: [] as string[],
      search: "" as string,
      panels: [] as string[],
      loading: false as boolean,
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
  computed: {
    searchForUser() {
      return this.users.filter((user: any) => {
        return user.data.displayName
          .toLowerCase()
          .includes(this.search.toLowerCase());
      }) as User[];
    },
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
    getUser(user: User) {
      this.panels = [];
      const panel = user.data.displayName.split(" ")[1].toLowerCase().charAt(0);
      this.panels.push(panel);
      const element = document.getElementById(panel);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      this.dialog[user.data.uid] = true;
    },
    async toggleAdmin(user: User) {
      this.loading = true;
      try {
        const toggleRole = httpsCallable(functions, "toggleAdmin");
        await toggleRole({
          uid: user.data.uid,
          email: user.data.email,
          admin: !user.roles.admin,
        });
      } catch (err) {
        this.$emit("error", err);
      }
      this.loading = false;
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
