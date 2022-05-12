<template>
  <div class="container">
    <div class="select" v-if="!showGrid">
      <div class="btn-grid">
        <button
          class="btn"
          v-if="!showNewUserMenu"
          @click="showNewUserMenu = true"
        >
          Add User
        </button>
        <form @submit.prevent="addUser(newUser)" v-else>
          <input
            type="text"
            v-model="newUser"
            placeholder="Enter your name..."
          />
          <input type="submit" value="Add User" />
        </form>
      </div>
      <div class="staff">
        <button
          class="btn"
          v-for="user in staff"
          :key="user"
          @click="getUser(user)"
        >
          {{ user.name }}
        </button>
      </div>
    </div>
    <div class="grid" v-if="showGrid">
      <button class="back" @click="showGrid = false">
        <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> Back
      </button>
      <div class="select"></div>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";
import {
  doc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
export default {
  data() {
    return {
      showNewUserMenu: false,
      newUser: "",
      showGrid: false,
      staff: null,
      tab: null,
    };
  },
  methods: {
    async init() {
      const q = query(collection(db, "staff"), where("name", "!=", null));
      onSnapshot(q, (snapshot) => {
        this.staff = [];
        snapshot.forEach((doc) => {
          this.staff.push({
            id: doc.id,
            name: doc.data().name,
          });
        });
      });
    },
    async addUser(user) {
      this.newUser = "";
      this.showNewUserMenu = false;
      await addDoc(collection(db, "staff"), {
        name: user,
      });
    },
    async getUser(user) {
      this.showGrid = true;
      const docRef = doc(db, `staff/${user.id}`);
      const docSnap = await getDoc(docRef);

      console.log(docSnap.data());
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.container {
  .select {
    display: grid;
    justify-content: center;
    .btn-grid {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px;
      padding: 4px;
      .btn {
        -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        border: none;
        border-radius: 2px;
        display: inline-block;
        height: 36px;
        line-height: 36px;
        padding: 0 16px;
        text-transform: uppercase;
        vertical-align: middle;
        -webkit-tap-highlight-color: transparent;
        text-decoration: none;
        color: #fff;
        background-color: #26a69a;
        text-align: center;
        letter-spacing: 0.5px;
        -webkit-transition: background-color 0.2s ease-out;
        transition: background-color 0.2s ease-out;
        cursor: pointer;
      }
      .btn:hover {
        background-color: #2bbbad;
        -webkit-box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
          0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
          0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
      }
    }
    .staff {
      display: grid;
      gap: 5px;
      .btn {
        -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        border: none;
        border-radius: 2px;
        display: inline-block;
        height: 36px;
        line-height: 36px;
        padding: 0 16px;
        vertical-align: middle;
        -webkit-tap-highlight-color: transparent;
        text-decoration: none;
        color: #fff;
        background-color: #2673a6;
        text-align: center;
        letter-spacing: 0.5px;
        -webkit-transition: background-color 0.2s ease-out;
        transition: background-color 0.2s ease-out;
        cursor: pointer;
      }
      .btn:hover {
        background-color: #2b9ebb;
        -webkit-box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
          0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
          0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
      }
    }
  }
  .grid {
    .back {
      background-color: red;
      border: none;
      color: white;
      border-radius: 8px;
      font-size: 15px;
      padding: 10px;
      -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    }
    .back:hover {
      background-color: rgb(255, 102, 102);
      -webkit-box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
        0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
      box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
        0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
