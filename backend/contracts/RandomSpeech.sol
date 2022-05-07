// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./RandomSpeechERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./RandomNumber.sol";

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/utils/Counters.sol";

contract RandomSpeech {
    // current token id
    using Counters for Counters.Counter;
    Counters.Counter private _currentTokenId;

    // speech data
    mapping(uint256 => string[]) private _originSpeech;
    mapping(uint256 => string[]) private _randomSpeech;
    mapping(uint256 => bool) private _isAngkor;

    // register speech
    function registerSpeech(address _address, string[] memory _speech) external {
        // increament token id
        _currentTokenId.increment();
        uint256 _tokenId = _currentTokenId.current();

        // decide random agenda
        RandomNumber rnInstance = RandomNumber(_address);
        uint256 index = rnInstance.getRandomNumber(10, _speech.length);

        // register speech_
        for (uint256 _i = 0; _i < _speech.length; _i++) {
            _originSpeech[_tokenId].push(_speech[_i]);
            if (_i == index) {
                _randomSpeech[_tokenId].push("random agenda");
            } else {
                _randomSpeech[_tokenId].push(_speech[_i]);
            }
        }
        _isAngkor[_tokenId] = false;

        // emit event
        emit RegisterSpeech(
            _tokenId,
            _originSpeech[_tokenId],
            _randomSpeech[_tokenId],
            _isAngkor[_tokenId]
        );
    }

    // angkor speech
    function angkor(uint256 _tokenId) external {
        _isAngkor[_tokenId] = true;
    }

    // get speech
    function getSpeech(uint256 _tokenId)
        external
        view
        returns (string[] memory)
    {
        if (_isAngkor[_tokenId]) {
            return _originSpeech[_tokenId];
        } else {
            return _randomSpeech[_tokenId];
        }
    }

    // event
    event RegisterSpeech(
        uint256 _tokenId,
        string[] _originSpeech,
        string[] _ramdomSpeech,
        bool _isAngkor
    );
}
