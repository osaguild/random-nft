const ERC721 = artifacts.require("RandomSpeechERC721");
const RandomSpeech = artifacts.require("RandomSpeech");
const RandomNumber = artifacts.require("RandomNumber");

module.exports = async function(deployer) {
  await deployer.deploy(ERC721);
  await deployer.deploy(RandomSpeech);
  await deployer.deploy(RandomNumber);
};
