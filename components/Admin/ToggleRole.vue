<script setup lang="ts">
import type { User } from "@/types";
import { useToast } from "vue-toastification";

const auth = useFirebaseAuth();
const toast = useToast();

const { user } = defineProps<{
  user: User;
}>();

// data
const loading = ref(false);

const perms = {
  admin: ["can edit any user", "can edit any item", "clear users tab"],
};

const dialog = ref<HTMLDialogElement | null>(null);

// Methods
const toggleRole = async () => {
  loading.value = true;
  try {
    if (user == null) return;
    const { email } = user.info;
    await callCloudFunction("toggleRole", { email, role: "admin" });

    loading.value = false;
    dialog.value?.close();
  } catch (err) {
    console.log(err);
    const { code, message } = err as { code: string; message: string };

    const errorMessage = `${code}: ${message}`;
    toast.error(errorMessage);
  } finally {
    loading.value = false;
  }
};

const checkPerms = (role: string) => {
  if (user?.info.email == auth?.currentUser?.email) {
    return {
      disabled: true,
      message: "You cannot change your own permissions",
    };
  }
  if (user?.roles.admin) {
    return {
      disabled: false,
      message: `Click to remove ${role} permissions`,
    };
  }
  if (user?.roles.dev) {
    return {
      disabled: true,
      message: "This user is a developer",
    };
  }
  return {
    disabled: false,
    message: `Click to add ${role} permissions`,
  };
};
</script>

<template>
  <div class="form-control w-fit">
    <label class="label">
      <span class="label-text">Administrator</span>
      <input
        type="checkbox"
        class="toggle"
        :checked="user?.roles.admin"
        :disabled="checkPerms('admin').disabled"
        @change="dialog?.showModal()"
      />
    </label>
    <span class="text-gray-600 text-xs">{{ checkPerms("admin").message }}</span>
  </div>
  <dialog ref="dialog" class="modal">
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">Are you sure?</h3>
      <p class="py-4">
        This will {{ user?.roles.admin ? "remove" : "add" }} the user as an
        admin.
      </p>
      <div class="grid grid-cols-2 gap-2">
        <button
          class="btn btn-primary"
          :disabled="checkPerms('admin').disabled"
          @click="toggleRole()"
        >
          {{ user?.roles.admin ? "Remove" : "Add" }} Admin
        </button>
        <button class="btn" @click="dialog?.close()">Cancel</button>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
