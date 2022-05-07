const ERC721 = artifacts.require("RandomSpeechERC721");
const RandomSpeech = artifacts.require("RandomSpeech");

let erc721Instance;
let rsInstance;

const baseURL = "https://osaguild.com/";
const originSpeech = [
  "origin agenda 1",
  "origin agenda 2",
  "origin agenda 3",
  "origin agenda 4",
  "origin agenda 5"
];
const randomSpeech = [
  "random agenda",
  "random agenda",
  "random agenda",
  "random agenda",
  "random agenda"
];

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
      assert.equal(speech[0], randomSpeech[0], `speech is not ${randomSpeech[0]}`);
      assert.equal(speech[1], randomSpeech[1], `speech is not ${randomSpeech[1]}`);
      assert.equal(speech[2], randomSpeech[2], `speech is not ${randomSpeech[2]}`);
      assert.equal(speech[3], randomSpeech[3], `speech is not ${randomSpeech[3]}`);
      assert.equal(speech[4], randomSpeech[4], `speech is not ${randomSpeech[4]}`);
    });

  });

  it("angkor speech", async () => {

    // angkor speech
    await rsInstance.angkor(1);

    // check angkor speech
    await rsInstance.getSpeech(1).then(speech => {
      assert.equal(speech[0], originSpeech[0], `speech is not ${originSpeech[0]}`);
      assert.equal(speech[1], originSpeech[1], `speech is not ${originSpeech[1]}`);
      assert.equal(speech[2], originSpeech[2], `speech is not ${originSpeech[2]}`);
      assert.equal(speech[3], originSpeech[3], `speech is not ${originSpeech[3]}`);
      assert.equal(speech[4], originSpeech[4], `speech is not ${originSpeech[4]}`);
    });

  });
});