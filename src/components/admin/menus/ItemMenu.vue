<template>
  <v-container grid-list-xs align="center">
    <v-row>
      <v-col>
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

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { auth, db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";

let unsubscribe = () => {};

export default defineComponent({
  name: "ItemMenu",
  components: {
    AddItem: defineAsyncComponent(
      () => import("@/components/admin/prompts/AddItem.vue")
    ),
    DeleteItem: defineAsyncComponent(
      () => import("@/components/admin/prompts/DeleteItem.vue")
    ),
  },
  data() {
    return {
      items: [],
      input: "",
      props: false,
      nameRules: [(v: any) => !!v || "Name is required"],
      inputMenu: false,
      deleteItemMenu: false,
    };
  },
  mounted() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        unsubscribe = onSnapshot(doc(db, "admin/items"), (snapshot) => {
          this.items = snapshot.data()?.food;
        });
      } else {
        unsubscribe();
      }
    });
  },
});
</script>
