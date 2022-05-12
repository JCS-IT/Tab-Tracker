<template>
	<div class="container">
		<div class="btn-grid">
			<button class="btn" v-if="!showNewUserMenu" @click="showNewUserMenu = true">Add User</button>
			<form @submit.prevent="addUser(newUser)" v-else>
				<input type="text" v-model="newUser" placeholder="Enter your name..." />
				<input type="submit" value="Add User" />
			</form>
		</div>
		<div class="users">
			<button v-for="user in users" :key="user">{{ user.name }}</button>
		</div>
	</div>
</template>

<script>
import { doc, setDoc } from "firebase/firestore";
export default {
	data() {
		return {
			showNewUserMenu: false,
			newUser: "",
			users: null,
		};
	},
	methods: {
		register(user) {
			const docRef()
			if (user != '') {

			}
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	justify-content: center;

	&.btn-grid {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		margin: 8px;
		padding: 4px;
	}
}
</style>
