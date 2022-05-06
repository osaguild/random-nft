<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Register Form</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-text-field
          v-model="tokenURI"
          label="token URI"
          required
        ></v-text-field>
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
      tokenURI: null,
      erc721Address: "0x74675f68b517d150301bd71f671b271aBb0044e0",
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
    await this.connectWallet();
    await this.getTokens();
    await this.getSpeeches();
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
