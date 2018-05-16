<template>
    <v-app>
        <!-- <v-navigation-drawer v-model="sidebar" app>
            <v-list>
                <v-list-tile
                    v-for="item in menuItems"
                    :key="item.title"
                    :to="item.path">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>{{ item.title }}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="userSignOut" v-if="isAuthenticated">
                    <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>Sign Out</v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer> -->

        <v-toolbar app color="red darken-3">
      <!-- <span class="hidden-sm-and-up">
        <v-toolbar-side-icon @click="sidebar = !sidebar">
        </v-toolbar-side-icon>
      </span> -->
            <v-toolbar-title>
                <router-link to="/" tag="span" style="cursor: pointer">
                    <font color = "white">{{ appTitle }}</font>
                </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-xs-only">
                <v-btn
                    flat
                    v-for="item in menuItems"
                    :key="item.title"
                    :to="item.path">
                    <v-icon left color="white">{{ item.icon }}</v-icon>
                    <div><font color = "white">{{ item.title }}</font></div>
                </v-btn>
                <v-btn flat v-if="isAuthenticated">
                    <v-icon color="white" left>account_circle</v-icon>
                    <font color = "white">Profile</font>
                </v-btn>
                <v-btn flat @click="userSignOut" v-if="isAuthenticated">
                    <v-icon color="white" left>exit_to_app</v-icon>
                    <font color = "white">Sign Out</font>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-content>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-content>

        <!-- <v-footer color="white--text red darken-3" class="pa-3">
            <v-spacer></v-spacer>
            <div>&copy;{{new Date().getFullYear()}}</div>
        </v-footer> -->
    </v-app>
</template>

<script>
export default {
  data() {
    return {
      sidebar: false
    };
  },
  computed: {
    appTitle() {
      return this.$store.state.appTitle;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    menuItems() {
      if (this.isAuthenticated) {
        return [];
      } else {
        return [
          { title: "Sign Up", path: "/signup", icon: "face" },
          { title: "Sign In", path: "/signin", icon: "lock_open" }
        ];
      }
    }
  },
  methods: {
    userSignOut() {
      this.$store.dispatch("userSignOut");
    }
  }
};
</script>
