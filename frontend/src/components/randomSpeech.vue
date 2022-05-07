<template>
  <v-container>
    <v-text-field v-model="speech[0]" label="agenda" required></v-text-field>
    <v-text-field v-model="speech[1]" label="agenda" required></v-text-field>
    <v-text-field v-model="speech[2]" label="agenda" required></v-text-field>
    <v-text-field v-model="speech[3]" label="agenda" required></v-text-field>
    <v-text-field v-model="speech[4]" label="agenda" required></v-text-field>
    <v-btn @click="registerSpeech">register speech</v-btn>
    <v-data-table
      :headers="headers"
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
  name: "RandomSpeech",
  data() {
    return {
      rsAddress: process.env.VUE_APP_RANDOM_SPEECH_ADDRESS,
      rsAbi: [
        "function registerSpeech(string[] memory _speech) external",
        "function angkor(uint256 _tokenId) external",
        "function getSpeech(uint256 _tokenId) external view returns (string[] memory)",
        "event RegisterSpeech(uint256 _tokenId, string[] _originSpeech, string[] _ramdomSpeech, bool _isAngkor)",
      ],
      headers: [
        { text: "token id", value: "tokenId" },
        { text: "speech", value: "speech" },
        { text: "angkor", value: "angkor" },
      ],
      speech: ["agenda 1","agenda 2","agenda 3","agenda 4","agenda 5"],
      speeches: [],
    };
  },
  mounted: async function () {
    console.log("random speech address: " + this.rsAddress);
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
