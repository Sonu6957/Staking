// SPDX-License-Identifier:Unlicensed
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";



contract NFT1155 is ERC1155, Ownable, ERC1155Burnable {
    constructor()
        ERC1155("https://ipfs.io/ipfs/QmfJY487dyg61UBvudkBimEhNeh9S8E5nRn4fWKawH3Vwy?filename=CryptoPunk.png")
    {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount)
        public onlyOwner
    {
        _mint(account, id, amount,"");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts)
        public onlyOwner
    {
        _mintBatch(to, ids, amounts,"");
    }
}