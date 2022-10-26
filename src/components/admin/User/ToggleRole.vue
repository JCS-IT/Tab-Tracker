<script setup lang="ts">
import { ref } from "vue";
import { auth, functions } from "utils/firebase";
import { httpsCallable } from "firebase/functions";
import type { User } from "types";

const props = defineProps<{
  user: User | null;
  role: string;
}>();

// data
const dialog = ref(false);
const loading = ref({
  switch: false,
  dialog: false,
});
const error = ref({
  code: null,
  message: null,
} as { code: string | null; message: string | null });

const perms = {
  admin: ["can edit any user", "can edit any item", "clear users tab"],
};

// methods
const toggleRole = async () => {
  loading.value.switch = true;
  try {
    const toggleRole = httpsCallable(functions, "toggleRole");
    await toggleRole({ email: props.user?.info.email, role: props.role });
    loading.value.switch = false;
  } catch (err) {
    console.log(err);
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };
  } finally {
    loading.value.dialog = false;
  }
};

const checkPerms = () => {
  if (props.user?.info.email == auth.currentUser?.email) {
    return {
      disabled: true,
      message: "You cannot change your own permissions",
    };
  }
  if (props.user?.roles.admin) {
    return {
      disabled: false,
      message: `Click to remove ${props.role} permissions`,
    };
  }
  if (props.user?.roles.dev) {
    return {
      disabled: true,
      message: "This user is a developer",
    };
  }
  return {
    disabled: false,
    message: `Click to add ${props.role} permissions`,
  };
};

const close = () => {
  dialog.value = false;
};
</script>

<template>
  <v-dialog
    v-model="dialog"
    :max-width="user?.roles.admin ? '350px' : '500px'"
    :overlay="true"
    persistent
    transition="dialog-transition"
  >
    <template v-slot:activator="{ props }">
      <v-switch
        color="primary"
        label="Administrator"
        v-bind="props"
        :model-value="user?.roles?.admin"
        :disabled="checkPerms().disabled"
        :loading="loading.switch"
        @click="(dialog = true), (loading.switch = true)"
        :messages="checkPerms().message"
      />
    </template>
    <v-card
      :loading="loading.dialog"
      :max-height="user?.roles.admin ? '120px' : '340px'"
    >
      <v-card-title>Are you sure?</v-card-title>
      <v-card-subtitle>
        This will {{ user?.roles[props.role] ? "remove" : "add" }} the user as
        an {{ props.role }}.
      </v-card-subtitle>
      <v-card-text v-if="!user?.roles.admin">
        When a user is an administrator they can:
        <v-list>
          <v-list-item v-for="(item, index) in perms.admin" :key="item">
            <v-list-item-title>{{ index + 1 + ". " + item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          text
          @click="toggleRole()"
          :loading="loading.dialog"
        >
          OK
        </v-btn>
        <v-btn color="red" text @click="close()"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
