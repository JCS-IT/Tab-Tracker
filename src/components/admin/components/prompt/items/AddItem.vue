<template>
  <VBtn color="green-lighten-2" @click="dialog = true"> Add Item </VBtn>
  <VDialog v-model="dialog" persistent>
    <VCard width="300px" :loading="loading" :disabled="loading">
      <VAlert v-if="error">
        <VAlertTitle>Error Occurred</VAlertTitle>
        {{ error }}
      </VAlert>
      <VCardTitle>
        <span class="headline">Add Item</span>
      </VCardTitle>
      <VCardText>
        <VForm ref="item" lazy-validation>
          <VTextField
            label="Item Name"
            variant="outlined"
            v-model="item.name"
            :rules="rules.name"
            @keyup.enter="addItem"
          />
          <VTextField
            label="Item Price"
            variant="outlined"
            type="number"
            v-model="item.price"
            prefix="$"
            :rules="rules.price"
            @keyup.enter="addItem"
          />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn color="green-lighten-2" @click="addItem" :loading="loading">
          Submit
        </VBtn>
        <VBtn
          color="red"
          @click="
            item.name = '';
            item.price = null;
            dialog = false;
          "
        >
          Cancel
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
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
