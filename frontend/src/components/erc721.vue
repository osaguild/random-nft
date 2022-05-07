<template>
  <v-container>
    <v-text-field v-model="tokenURI" label="token URI" required></v-text-field>
    <v-btn @click="mint">mint</v-btn>
    <v-data-table
      :headers="tokenHeaders"
      :items="tokens"
      :items-per-page="10"
      class="elevation-1"
      disable-sort
      hide-default-footer
    >
    </v-data-table>
  </v-container>
</template>

<script>
import { ethers } from "ethers";

export default {
  name: "ERC721",
  data() {
    return {
      tokenURI: null,
      erc721Address: process.env.VUE_APP_ERC721_ADDRESS,
      erc721Abi: [
        "function mint(string memory tokenURI) public returns (uint256)",
        "function ownerOf(uint256 tokenId) public view virtual override returns (address)",
        "function tokenURI(uint256 tokenId) public view virtual override returns (string memory)",
      ],
      tokenHeaders: [
        { text: "token id", value: "tokenId" },
        { text: "token URL", value: "tokenURI" },
        { text: "owner", value: "owner" },
      ],
      tokens: [],
    };
  },
  mounted: async function () {
    console.log("erc721 address: " + this.erc721Address);
    await this.getTokens();
  },
  methods: {
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
    mint: async function () {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const erc721Instance = await new ethers.Contract(
          this.erc721Address,
          this.erc721Abi,
          provider
        );
        const erc721WithSigner = erc721Instance.connect(signer);
        const tx = await erc721WithSigner.mint(this.tokenURI);
        console.log("transaction", tx);
      } catch (error) {
        console.log("failed to send transaction", error);
      }
    },
  },
};
</script>
