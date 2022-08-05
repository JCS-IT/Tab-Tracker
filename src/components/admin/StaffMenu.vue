<template>
  <v-container>
    <v-row>
      <v-col>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-text-field v-model="search" placeholder="Search" v-bind="props">
            </v-text-field>
          </template>
          <v-list>
            <v-list-item v-for="(user, index) in searchForUser" :key="index">
              <v-list-item-title
                @click="$router.push(`/admin/user/${user.id}`)"
              >
                {{ user.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-container v-for="letter in list" :key="letter" class="mb-3">
      <v-card>
        <v-card-title primary-title>
          {{ letter.toUpperCase() }}
        </v-card-title>
        <v-row class="my-10">
          <v-col
            v-for="user in filterUsers(letter)"
            :key="user.displayName"
            align="center"
          >
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  color="info"
                  v-bind="props"
                  :id="user.name.split(' ')[1]"
                >
                  {{ user.name }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <router-link :to="`/admin/user/${user.uid}`">
                    <v-btn
                      color="success"
                      width="107px"
                      prepend-icon="mdi-account-hard-hat"
                    >
                      Go To
                    </v-btn>
                  </router-link>
                </v-list-item>
                <v-list-item>
                  <DeleteUser :user="user"></DeleteUser>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import { defineAsyncComponent, defineComponent } from "vue";
import { auth, db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default defineComponent({
  name: "users menu",
  data() {
    return {
      props: null,
      search: "",
      deleteUserMenu: false,
      usersMenu: false,
      users: [],
      list: [
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
      let filter = [];
      if (this.search.length > 0) {
        this.users.forEach((user) => {
          if (user.name.toLowerCase().includes(this.search.toLowerCase())) {
            filter.push(user);
          }
        });
      } else {
        filter = this.users;
      }
      return filter;
    },
  },
  components: {
    DeleteUser: defineAsyncComponent(() =>
      import("@/components/prompts/admin/DeleteUser.vue")
    ),
  },
  methods: {
    filterUsers(letter) {
      return this.users?.filter((person) => {
        return person.name
          .split(" ")[1]
          ?.toUpperCase()
          .startsWith(letter.toUpperCase());
      });
    },
  },
  async mounted() {
    let unsubscribe = () => {};
    auth.onAuthStateChanged((user) => {
      if (user) {
        unsubscribe = onSnapshot(doc(db, "admin/users"), (doc) => {
          this.users = doc.data().index;
        });
      } else {
        unsubscribe();
      }
    });
  },
});
</script>

<style lang="scss">
* {
  text-decoration: none;
}

#nav {
  position: sticky;
  top: 0;
}
</style>
