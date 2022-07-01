<template>
  <v-container align="center">
    <v-row>
      <v-col>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-text-field v-model="search" placeholder="Search" v-bind="props">
            </v-text-field>
          </template>
          <v-list>
            <v-list-item
              v-for="(user, index) in searchForUser"
              :key="index"
              :value="index"
            >
              <v-list-item-title
                @click="
                  $router.push({
                    name: 'User',
                    params: { id: user.id, from: 'admin' },
                  })
                "
              >
                {{ user.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <div v-for="letter in list" :key="letter" :id="letter">
      <v-card>
        <v-card-title primary-title>
          {{ letter.toUpperCase() }}
        </v-card-title>
        <v-row class="my-10">
          <v-col v-for="user in filterStaff(letter)" :key="user.displayName">
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
                  <router-link :to="`/admin/user/${user.id}`">
                    <v-btn color="success" width="107px">
                      <v-icon class="ml-n5 mr-1">mdi-account-hard-hat</v-icon>
                      Go to
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
    </div>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
export default {
  name: "staff menu",
  data() {
    return {
      props: null,
      search: "",
      deleteUserMenu: false,
      staffMenu: false,
      staff: [],
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
        this.staff.forEach((user) => {
          if (user.name.toLowerCase().includes(this.search.toLowerCase())) {
            filter.push(user);
          }
        });
      } else {
        filter = this.staff;
      }
      return filter;
    },
  },
  components: {
    DeleteUser: defineAsyncComponent(() =>
      import("@prompts/admin/DeleteUser.vue")
    ),
  },
  methods: {
    async init() {
      onSnapshot(collection(db, "staff"), (snapshot) => {
        this.staff = [];
        snapshot.forEach((doc) => {
          this.staff.push({
            id: doc.id,
            name: doc.data().name,
          });
        });
      });
    },
    filterStaff(letter) {
      return this.staff?.filter((person) => {
        return person.name
          .split(" ")[1]
          ?.toUpperCase()
          .startsWith(letter.toUpperCase());
      });
    },
  },
  mounted() {
    this.init();
  },
};
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
