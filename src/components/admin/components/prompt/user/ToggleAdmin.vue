<template>
  <VDialog
    v-model="dialog"
    :max-width="user?.roles.admin ? '350px' : '500px'"
    :overlay="true"
    persistent
    transition="dialog-transition"
  >
    <template v-slot:activator="{ props }">
      <VSwitch
        color="primary"
        label="Administrator"
        v-bind="props"
        :model-value="user?.roles?.admin"
        :disabled="message().disabled"
        :loading="loading.switch"
        @click="(dialog = true), (loading.switch = true)"
        :messages="message().message"
      />
    </template>
    <VCard
      :loading="loading.dialog"
      :max-height="user?.roles.admin ? '120px' : '340px'"
    >
      <VCardTitle>Are you sure?</VCardTitle>
      <VCardSubtitle>
        This will {{ user.roles.admin ? "remove" : "add" }} the user as an
        administrator.
      </VCardSubtitle>
      <VCardText v-if="!user.roles.admin">
        When a user is an administrator they can:
        <VList>
          <VListItem v-for="(item, index) in list" :key="item">
            <VListItemTitle>{{ index + 1 + ". " + item }}</VListItemTitle>
          </VListItem>
        </VList>
      </VCardText>
      <VCardActions>
        <VBtn
          color="primary"
          text
          @click="toggleAdmin(user.info.email)"
          :loading="loading.dialog"
        >
          OK
        </VBtn>
        <VBtn color="red" text @click="cancel()"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import { auth, functions } from "@/firebase";
import { httpsCallable } from "@firebase/functions";
import type { User } from "@/types";
</script>

<script lang="ts">
export default defineComponent({
  name: "TogglePerms",
  props: {
    user: {
      type: Object as () => User,
      required: true,
    },
  },
  data() {
    return {
      loading: {
        switch: false,
        dialog: false,
      },
      error: {
        status: false,
        message: "",
      },
      dialog: false,
      list: [
        "can edit any user",
        "can edit any item",
        "can mark any order as completed",
      ],
    };
  },
  methods: {
    async toggleAdmin(email: string) {
      this.loading.dialog = true;
      try {
        const toggleRole = httpsCallable(functions, "toggleAdmin");
        await toggleRole({
          email: email,
          admin: !this.user.roles.admin,
        });
      } catch (err) {
        this.$emit("error", err);
      }
      this.dialog = false;
      this.loading.dialog = false;
    },
    cancel() {
      this.dialog = false;
      this.loading.switch = false;
    },
    message() {
      if (this.user.info.email == auth.currentUser?.email) {
        return {
          disabled: true,
          message: "You cannot change your own permissions",
        };
      }
      if (this.user.roles.admin) {
        return {
          disabled: false,
          message: "Click to remove admin permissions",
        };
      }
      if (this.user.roles.dev) {
        return {
          disabled: true,
          message: "This user is a developer",
        };
      }
      return {
        disabled: false,
        message: "Click to add admin permissions",
      };
    },
  },
});
</script>
