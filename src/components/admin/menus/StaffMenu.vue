<template>
  <VContainer fluid>
    <VRow>
      <VCol width="100px">
        <VMenu>
          <template v-slot:activator="{ props }">
            <VTextField
              v-model="search"
              label="Search"
              v-bind="props"
              append-inner-icon="mdi-magnify"
            />
          </template>
          <VList>
            <VListItem v-for="(user, index) in searchForUser" :key="index">
              <VListItemTitle @click="getUser(user)">
                {{ user?.info?.displayName }}
              </VListItemTitle>
              <VDivider />
            </VListItem>
          </VList>
        </VMenu>
      </VCol>
    </VRow>
    <VRow>
      <VExpansionPanels v-model="panels" multiple>
        <VExpansionPanel
          v-for="letter in letters"
          :key="letter"
          :id="letter"
          :value="letter"
          class="mb-2"
        >
          <VExpansionPanelTitle>
            <b>{{ letter.toUpperCase() }}</b>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <User
              v-for="user in filterUsers(letter)"
              :key="user?.info?.email"
              :user="user"
              :items="items"
              :ref="user?.info?.email"
            />
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </VRow>
  </VContainer>
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
        return user.info.displayName
          .toLowerCase()
          .includes(this.search.toLowerCase()) as boolean;
      }) as User[];
    },
  },
  methods: {
    getUser(user: User) {
      this.panels = [];
      const panel = user.info.displayName.split(" ")[1].toLowerCase().charAt(0);
      this.panels.push(panel);
      const element = document.getElementById(panel);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.$refs[user.info.email][0].dialog = true;
      }, 500);
    },
    filterUsers(letter: string) {
      return this.users?.filter((user: User) => {
        return user.info.displayName
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
