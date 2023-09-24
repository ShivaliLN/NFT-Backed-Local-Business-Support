// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Notice: @dev Contract for NFT-Backed Local Business Support
contract LocalBusinessNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    Counters.Counter public _tokenIdsForBusiness;
    Counters.Counter public _tokenIdsForUsers;

    // Notice: @dev Mapping from token ID to service or product description
    mapping(uint256 => string) public serviceDescription;

    // Notice: @dev Mapping from token ID to business name
    mapping(uint256 => string) public businessName;

    // Notice: @dev Mapping from business name to an array of token IDs
    mapping(string => uint256[]) public tokensOfBusiness;

    // New mapping to keep track of NFTs minted by users
    mapping(address => uint256[]) public tokensOfUser;

    // Notice: @dev Event emitted when a new NFT is minted
    event NFTMinted(address owner, uint256 tokenId, string description, string business);

    // Notice: @dev Event emitted when an NFT is redeemed
    event NFTRedeemed(address owner, uint256 tokenId);

    constructor() ERC721("LocalBusinessNFT", "LBNFT") {}

    // Notice: @dev Function to mint a new NFT by the contract owner
    function mintNFTByOwner(address to, string memory _description, string memory _business, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIdsForBusiness.increment();
        _tokenIds.increment();  
        uint256 tokenId = _tokenIds.current();
        return _mintNFT(to, tokenId, _description, _business, tokenURI);
    }

    // Notice: @dev Function to mint a new NFT by any user
    function mintNFTByUser(string memory _description, string memory _business, string memory tokenURI) public returns (uint256) {
        _tokenIdsForUsers.increment();
        _tokenIds.increment();  
        uint256 tokenId = _tokenIds.current();
        tokensOfUser[msg.sender].push(tokenId);  // Add the token to the user's list
        return _mintNFT(msg.sender, tokenId, _description, _business, tokenURI);
    }

    // Notice: @dev Internal function to handle the minting logic
    function _mintNFT(address to, uint256 tokenId, string memory _description, string memory _business, string memory tokenURI) internal returns (uint256) {
       _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        serviceDescription[tokenId] = _description;
        businessName[tokenId] = _business;
        tokensOfBusiness[_business].push(tokenId);

        emit NFTMinted(to, tokenId, _description, _business);

        return tokenId;
    }

    // Notice: @dev Function to redeem an NFT, only the NFT owner can call this
    function redeemNFT(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this token");

        // Remove token from tokensOfBusiness mapping
        string memory _business = businessName[tokenId];
        uint256[] storage tokens = tokensOfBusiness[_business];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }

        // Burn the NFT
        _burn(tokenId);

        emit NFTRedeemed(msg.sender, tokenId);
    }
}
