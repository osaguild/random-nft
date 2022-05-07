// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract RandomNumber {
  
  function getRandomNumber(uint256 _key, uint256 _total) external pure returns (uint256) {
    uint256 _random = _key % _total;
    return _random;
  }
}
