<template>
  <RouterView v-slot="{ Component }">
    <Transition name="slide-x-transition" mode="out-in" appear>
      <KeepAlive :include="['Staff', 'Items']">
        <component :is="Component" />
      </KeepAlive>
    </Transition>
  </RouterView>
  <v-bottom-navigation>
    <v-tabs>
      <v-tab value="staff" to="/admin/staff">
        <v-icon icon="manage_accounts" />
        Staff
      </v-tab>
      <v-tab value="items" to="/admin/items">
        <v-icon icon="inventory_2" />
        Items
      </v-tab>
    </v-tabs>
  </v-bottom-navigation>
</template>
