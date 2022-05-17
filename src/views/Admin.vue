<template>
	<v-navigation-drawer permanent>
		<v-container grid-list-xs align="space-between">
			<v-row>
				<v-col>
					<router-link to="/">
						<v-btn color="success"><i class="fa fa-arrow-circle-left" aria-hidden="true" /> Home
						</v-btn>
					</router-link>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<v-btn color="info" @click="active = 'staff'">Staff Menu</v-btn>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<v-btn color="info">Item Menu</v-btn>
				</v-col>
			</v-row>
		</v-container>
	</v-navigation-drawer>
	<StaffMenu v-if="active == 'staff'" />
</template>

<script>
import StaffMenu from '../components/StaffMenu.vue';

export default {
	data() {
		return {
			active: '',
		}
	},
	components: {
		StaffMenu
	}
}
</script>
