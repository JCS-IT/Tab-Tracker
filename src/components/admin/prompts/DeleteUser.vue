<template>
  <div class="text-center">
    <v-dialog
      v-model="deleteUserMenu"
      :fullscreen="mobile"
      overlay
      transition="dialog-transition"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          color="error"
          v-bind="props"
          width="107px"
          prepend-icon="mdi-nuke"
          :disabled="user?.admin"
        >
          Delete
        </v-btn>
      </template>
      <v-card
        max-width="450px"
        max-height="320px"
        :loading="loading"
        :disabled="loading"
      >
        <v-alert v-if="error.message != ''">
          <v-alert-title>
            An Error occured while deleting this user.
          </v-alert-title>
          {{ error.message }}
        </v-alert>
        <v-card-title>
          Are you sure you want to delete this user?
        </v-card-title>
        <v-card-subtitle> This action can not be undone </v-card-subtitle>
        <v-card-text>
          deleting this user will result in them not showing up in this list
          until they remake their account
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="success"
            @click="deleteUser(user?.uid)"
            :loading="loading"
          >
            Yes
          </v-btn>
          <v-btn color="error" @click="cancel()"> No </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { functions } from "@/firebase";
import { httpsCallable } from "@firebase/functions";
import { defineComponent } from "vue";
import { useDisplay } from "vuetify";
export default defineComponent({
  name: "DeleteUser",
  props: {
    user: Object,
  },
  setup() {
    const { mobile } = useDisplay();
    return { mobile };
  },
  data() {
    return {
      deleteUserMenu: false,
      loading: false,
      error: {
        message: "",
      },
    };
  },
  methods: {
    async deleteUser(uid: string) {
      this.loading = true;
      try {
        const deleteUser = httpsCallable(functions, "deleteUser");
        await deleteUser({ uid });
        this.deleteUserMenu = false;
      } catch (error) {
        this.error.message = error as string;
      }
      this.loading = false;
    },
    cancel() {
      this.deleteUserMenu = false;
    },
  },
});
</script>
