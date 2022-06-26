<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col align="center">
        <AddItem></AddItem>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="item in food" :key="item">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn color="info" v-bind="props">
              {{ item.name }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <DeleteItem :item="item"></DeleteItem>
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
import { query, where, onSnapshot, collection } from "firebase/firestore";

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
      food: [],
      input: "",
      props: false,
      nameRules: [(v) => !!v || "Name is required"],
      inputMenu: false,
      deleteItemMenu: false,
    };
  },
  methods: {
    async init() {
      const q = query(collection(db, "items"), where("type", "==", "food"));
      onSnapshot(q, (snapshot) => {
        this.food = [];
        snapshot.forEach((doc) => {
          this.food.push({
            id: doc.id,
            name: doc.data().name,
          });
        });
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
