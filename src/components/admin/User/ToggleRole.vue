<script setup lang="ts">
import { callCloudFunction } from "@/composables";
import type { User } from "@/types";

const auth = useFirebaseAuth();

const props = defineProps<{
  user: User;
  role: "admin" | "dev";
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
  loading.value.dialog = true;
  try {
    if (props.user == null) return;
    const { email } = props.user.info;
    const { role } = props;
    await callCloudFunction("toggleRole", { email, role });

    loading.value.switch = false;
    dialog.value = false;
  } catch (err) {
    console.log(err);
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };
  } finally {
    loading.value.dialog = false;
  }
};

const checkPerms = () => {
  if (props.user?.info.email == auth?.currentUser?.email) {
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
  loading.value.switch = false;
  loading.value.dialog = false;
};
</script>

<template>
  <VDialog
    v-model="dialog"
    :max-width="user?.roles.admin ? '350px' : '500px'"
    :overlay="true"
    persistent
    transition="dialog-transition"
  >
    <template #activator="{ props }">
      <VSwitch
        color="success"
        label="Administrator"
        v-bind="props"
        :model-value="user?.roles?.admin"
        :disabled="checkPerms().disabled"
        :loading="loading.switch"
        @click="(dialog = true), (loading.switch = true)"
        :messages="checkPerms().message"
      />
    </template>
    <VCard
      :loading="loading.dialog"
      :max-height="user?.roles.admin ? '120px' : '340px'"
    >
      <VCardTitle>Are you sure?</VCardTitle>
      <VCardSubtitle>
        This will {{ user?.roles[role] ? "remove" : "add" }} the user as an
        {{ role }}.
      </VCardSubtitle>
      <VCardText v-if="!user?.roles.admin">
        When a user is an administrator they can:
        <VList>
          <VListItem v-for="(item, index) in perms.admin" :key="item">
            <VListItemTitle>{{ index + 1 + ". " + item }}</VListItemTitle>
          </VListItem>
        </VList>
      </VCardText>
      <VCardActions>
        <VBtn
          color="auto"
          variant="text"
          @click="toggleRole()"
          :loading="loading.dialog"
        >
          Confirm
        </VBtn>
        <VBtn color="red" variant="text" @click="close()"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
