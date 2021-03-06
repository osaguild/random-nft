const ERC721 = artifacts.require("RandomSpeechERC721");
const RandomSpeech = artifacts.require("RandomSpeech");
const RandomNumber = artifacts.require("RandomNumber");

let erc721Instance;
let rsInstance;
let rnInstance;

const baseURL = "https://osaguild.com/";
const originSpeech = [
  "origin agenda 1",
  "origin agenda 2",
  "origin agenda 3",
  "origin agenda 4",
  "origin agenda 5"
];

contract("Random Speech", (accounts) => {

  it("check deploy", async () => {

    // ERC721
    erc721Instance = await ERC721.deployed();
    assert(erc721Instance.address, "deploy of ERC721 is failed");

    // RandomSpeech
    rsInstance = await RandomSpeech.deployed();
    assert(rsInstance.address, "deploy of RandomSpeech is failed");

    // RandomNumber
    rnInstance = await RandomNumber.deployed();
    assert(rnInstance.address, "deploy of RandomNumber is failed");

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
    await rsInstance.registerSpeech(rnInstance.address, 10, originSpeech);

    // check registered speech
    await rsInstance.getSpeech(1).then(speech => {
      assert.equal(speech[0], "what is your hobby?", 'speech is not "what is your hobby"');
      assert.equal(speech[1], originSpeech[1], `speech is not ${originSpeech[1]}`);
      assert.equal(speech[2], originSpeech[2], `speech is not ${originSpeech[2]}`);
      assert.equal(speech[3], originSpeech[3], `speech is not ${originSpeech[3]}`);
      assert.equal(speech[4], originSpeech[4], `speech is not ${originSpeech[4]}`);
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

  it("get random number", async () => {

    // get and check random number speech
    await rnInstance.getRandomNumber(5, 3).then(random => {
      assert.equal(random, 2, `random number is not 2`);
    });

    // get and check random number speech
    await rnInstance.getRandomNumber(10, 5).then(random => {
      assert.equal(random, 0, `random number is not 0`);
    });

  });

});