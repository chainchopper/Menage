// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MenageCoin.sol";

contract NFTMaturity is ERC721, ERC721URIStorage, Ownable {
    struct Egg {
        uint256 tokenId;
        uint256 maturityTime;
        uint256 currentSize;
        bool hasHatched;
    }

    mapping(uint256 => Egg) public eggs;
    uint256 private _nextTokenId;
    MenageCoin public mncToken;

    constructor(address mncAddress) ERC721("NFTMaturity", "NMT") {
        mncToken = MenageCoin(mncAddress);
    }

    function mintEgg(address to, uint256 initialSize, uint256 maturityTime) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        eggs[tokenId] = Egg({
            tokenId: tokenId,
            maturityTime: block.timestamp + maturityTime,
            currentSize: initialSize,
            hasHatched: false
        });
        _safeMint(to, tokenId);
    }

    function boostEgg(uint256 tokenId, uint256 amount) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(!eggs[tokenId].hasHatched, "Already hatched");
        
        mncToken.transferFrom(msg.sender, address(this), amount);
        eggs[tokenId].currentSize += amount;
    }

    function hatchEgg(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(!eggs[tokenId].hasHatched, "Already hatched");
        require(block.timestamp >= eggs[tokenId].maturityTime, "Not mature");

        eggs[tokenId].hasHatched = true;
        _setTokenURI(tokenId, "ipfs://hatched-egg-metadata");
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
