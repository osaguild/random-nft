<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Register Form</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-text-field
          v-model="nftAddress"
          label="address"
          required
        ></v-text-field>
        <v-btn @click="registerSpeech">mint</v-btn>
        <v-data-table
          :headers="headers"
          :items="tokens"
          :items-per-page="10"
          class="elevation-1"
          disable-sort
          hide-default-footer
        >
        </v-data-table>
      </v-container>
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
      currentAccount: null,
      nftAddress: null,
      erc721Address: "0x74675f68b517d150301bd71f671b271aBb0044e0",
      erc721Abi: [
        "function mint(string memory tokenURI) public returns (uint256)",
        "function ownerOf(uint256 tokenId) public view virtual override returns (address)",
        "function tokenURI(uint256 tokenId) public view virtual override returns (string memory)",
      ],
      headers: [
        { text: "token id", value: "tokenId" },
        { text: "token URL", value: "tokenURI" },
        { text: "owner", value: "owner" },
      ],
      tokens: [],
    };
  },
  mounted: async function () {
    await this.connectWallet();
    await this.getTokens();
  },
  methods: {
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
    getTokens: async function () {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const erc721Instance = await new ethers.Contract(
          this.erc721Address,
          this.erc721Abi,
          provider
        );

        for (let i = 1; i <= 5; i++) {
          const owner = await erc721Instance.ownerOf(i);
          const tokenURI = await erc721Instance.tokenURI(i);
          this.tokens.push({
            tokenId: i,
            tokenURI: tokenURI,
            owner: owner,
          });
        }
      } catch (error) {
        console.log("failed to get token", error);
      }
    },
    registerSpeech: async function () {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const erc721Instance = await new ethers.Contract(
          this.erc721Address,
          this.erc721Abi,
          provider
        );
        const erc721WithSigner = erc721Instance.connect(signer);
        const tx = await erc721WithSigner.mint(this.nftAddress);
        console.log("transaction", tx);
      } catch (error) {
        console.log("failed to send transaction", error);
      }
    },
  },
};
</script>
