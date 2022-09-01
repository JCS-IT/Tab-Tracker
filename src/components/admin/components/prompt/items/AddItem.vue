<template>
  <v-btn color="green-lighten-2" @click="dialog = true"> Add Item </v-btn>
  <v-dialog v-model="dialog" persistent>
    <v-card width="300px" :loading="loading" :disabled="loading">
      <v-alert v-if="error">
        <v-alert-title>Error Occurred</v-alert-title>
        {{ error }}
      </v-alert>
      <v-card-title>
        <span class="headline">Add Item</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="item" lazy-validation>
          <v-text-field
            label="Item Name"
            variant="outlined"
            v-model="item.name"
            :rules="rules.name"
            @keyup.enter="addItem"
          />
          <v-text-field
            label="Item Price"
            variant="outlined"
            type="number"
            v-model="item.price"
            prefix="$"
            :rules="rules.price"
            @keyup.enter="addItem"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="green-lighten-2" @click="addItem" :loading="loading">
          Submit
        </v-btn>
        <v-btn
          color="red"
          @click="
            item.name = '';
            item.price = null;
            dialog = false;
          "
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { functions } from "@/firebase";
import { httpsCallable } from "@firebase/functions";

export default defineComponent({
  name: "AddItem",
  data() {
    return {
      dialog: false,
      item: {
        name: "" as string,
        price: null as number | null,
      },
      loading: false,
      error: null as string | null,
      rules: {
        name: [(v: unknown) => !!v || "Name is required"],
        price: [(v: unknown) => !!v || "Price is required"],
      },
    };
  },
  methods: {
    async addItem() {
      this.loading = true;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const checkValid = await this.$refs.item.validate();
      if (!checkValid.valid) {
        this.loading = false;
        return;
      }
      try {
        const addItem = httpsCallable(functions, "addItem");
        await addItem({ item: this.item });
        this.dialog = false;
        this.item = {
          name: "",
          price: 0,
        };
      } catch (error) {
        console.log(error);
        this.error = error as string;
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
