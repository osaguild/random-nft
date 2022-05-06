<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>Register Form</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Menu </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item v-on:click="changePage('/erc721')">
          <v-list-item-content>
            <v-list-item-title> ERC721 </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="changePage('/randomSpeech')">
          <v-list-item-content>
            <v-list-item-title> RancomSpeech </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer padless app>
      <v-col class="text-center" cols="12">
        <strong>@ {{ new Date().getFullYear() }} osaguild.com</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import { ethers } from "ethers";

export default {
  name: "App",
  data() {
    return {
      drawer: false,
      currentAccount: null,
    };
  },
  mounted: async function () {
    await this.connectWallet();
  },
  methods: {
    changePage: function (page) {
      if (this.$route.path !== page) {
        this.$router.push(page);
      }
      this.drawer = false;
    },
    connectWallet: async function () {
      try {
        if (!window.ethereum) {
          alert("you need metamask to use Dapp");
          return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        console.log("Connected", accounts[0]);
        this.currentAccount = accounts[0];
      } catch (error) {
        console.log("reject your connection request", error);
      }
    },
  },
};
</script>
