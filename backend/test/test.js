const ERC721 = artifacts.require("RandomSpeechERC721");
const RandomSpeech = artifacts.require("RandomSpeech");

let erc721Instance;
let rsInstance;

const baseURL = "https://osaguild.com/";
const originSpeech = "speech 001";
const randomSpeech = "random speech";

contract("Random Speech", (accounts) => {

  it("check deploy", async () => {

    // ERC721
    erc721Instance = await ERC721.deployed();
    assert(erc721Instance.address, "deploy of ERC721 is failed");

    // RandomSpeech
    rsInstance = await RandomSpeech.deployed();
    assert(rsInstance.address, "deploy of RandomSpeech is failed");

  });

  it("mint NFT", async () => {

    // mint 10 NFT
    for (let i = 1; i <= 10; i++) {
      await erc721Instance.mint(baseURL + i);
    }

    // check minted NFT owner
    for (let i = 1; i <= 10; i++) {
      await erc721Instance.ownerOf(i).then(owner => {
        assert.equal(owner, accounts[0], "owner is not accounts[0]");
      });
    };

    // check minted NFT tokenURI
    for (let i = 1; i <= 10; i++) {
      await erc721Instance.tokenURI(i).then(tokenURI => {
        assert.equal(tokenURI, baseURL + i, `uri is not ${baseURL + i}`);
      });
    };

  });

  it("register speech", async () => {

    // register speech
    await rsInstance.registerSpeech(originSpeech);

    // check registered speech
    await rsInstance.getSpeech(1).then(speech => {
      assert.equal(speech, randomSpeech, `speech is not ${randomSpeech}`);
    });

  });

  it("angkor speech", async () => {

    // angkor speech
    await rsInstance.angkor(1);

    // check angkor speech
    await rsInstance.getSpeech(1).then(speech => {
      assert.equal(speech, originSpeech, `speech is not ${originSpeech}`);
    });

  });
});