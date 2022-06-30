<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col align="center">
        <AddItem :items="items"></AddItem>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="item in items" :key="item">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="info" v-bind="props">
              {{ item }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <DeleteItem :item="item" :items="items"></DeleteItem>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default {
  name: "ItemMenu",
  components: {
    AddItem: defineAsyncComponent(() => import("@prompts/admin/AddItem.vue")),
    DeleteItem: defineAsyncComponent(() =>
      import("@prompts/admin/DeleteItem.vue")
    ),
  },
  data() {
    return {
      items: [],
      input: "",
      props: false,
      nameRules: [(v) => !!v || "Name is required"],
      inputMenu: false,
      deleteItemMenu: false,
    };
  },
  methods: {
    async init() {
      onSnapshot(doc(db, "items/foods"), (snapshot) => {
        this.items = snapshot.data().items;
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
