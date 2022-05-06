<template>
  <v-container>
    <v-text-field v-model="speech" label="speech" required></v-text-field>
    <v-btn @click="registerSpeech">register speech</v-btn>
    <v-data-table
      :headers="speechHeaders"
      :items="speeches"
      :items-per-page="10"
      class="elevation-1"
      disable-sort
      hide-default-footer
    >
      <template v-slot:[`item.angkor`]="{ item }">
        <v-btn @click="angkor(item.angkor)">angkor</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import { ethers } from "ethers";

export default {
  name: "App",
  data() {
    return {
      speech: null,
      rsAddress: "0x0e6C71de731FCCef16EA2bD2D1676B56159BC18D",
      rsAbi: [
        "function registerSpeech(string memory _speech) external",
        "function angkor(uint256 _tokenId) external",
        "function getSpeech(uint256 _tokenId) external view returns (string memory)",
        "event RegisterSpeech(uint256 _tokenId,string _originSpeech,string _ramdomSpeech,bool _isAngkor)",
      ],
      speechHeaders: [
        { text: "token id", value: "tokenId" },
        { text: "speech", value: "speech" },
        { text: "angkor", value: "angkor" },
      ],
      speeches: [],
    };
  },
  mounted: async function () {
    await this.getSpeeches();
  },
  methods: {
    registerSpeech: async function () {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const rsInstance = await new ethers.Contract(
          this.rsAddress,
          this.rsAbi,
          provider
        );
        const rsWithSigner = rsInstance.connect(signer);
        const tx = await rsWithSigner.registerSpeech(this.speech);
        console.log("transaction", tx);
      } catch (error) {
        console.log("failed to send transaction", error);
      }
    },
    getSpeeches: async function () {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const rsInstance = await new ethers.Contract(
          this.rsAddress,
          this.rsAbi,
          provider
        );

        for (let i = 1; i <= 5; i++) {
          const speech = await rsInstance.getSpeech(i);
          this.speeches.push({
            tokenId: i,
            speech: speech,
            angkor: i,
          });
        }
      } catch (error) {
        console.log("failed to get token", error);
      }
    },
    angkor: async function (tokenId) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const rsInstance = await new ethers.Contract(
          this.rsAddress,
          this.rsAbi,
          provider
        );
        const rsWithSigner = rsInstance.connect(signer);
        const tx = await rsWithSigner.angkor(tokenId);
        console.log("transaction", tx);
      } catch (error) {
        console.log("failed to send transaction", error);
      }
    },
  },
};
</script>
