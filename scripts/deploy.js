const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MenageCoin
  const MenageCoin = await hre.ethers.getContractFactory("MenageCoin");
  const mnc = await MenageCoin.deploy();
  await mnc.waitForDeployment();
  console.log("MenageCoin deployed to:", await mnc.getAddress());

  // Deploy NFTMaturity
  const NFTMaturity = await hre.ethers.getContractFactory("NFTMaturity");
  const nft = await NFTMaturity.deploy(await mnc.getAddress());
  await nft.waitForDeployment();
  console.log("NFTMaturity deployed to:", await nft.getAddress());

  // Mint initial tokens
  await mnc.mint(deployer.address, hre.ethers.parseEther("1000"));
  console.log("Minted 1000 MNC to deployer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
