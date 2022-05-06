const ERC721 = artifacts.require("RandomSpeechERC721");
//const RandomSpeech = artifacts.require("RandomSpeech");

module.exports = async function(deployer) {
  await deployer.deploy(ERC721);
//  await deployer.deploy(RandomSpeech);
};
