const hre = require("hardhat");

async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();
  console.log("Greeter deployed to:", greeter.address);

  saveFrontendFiles(greeter);
}

function saveFrontendFiles(greeter) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }

  fs.writeFileSync(
      contractsDir + "/contract-address.json",
      JSON.stringify({ Greeter: greeter.address }, undefined, 2)
    );

  const GreeterArtifact = artifacts.readArtifactSync("Greeter");

  fs.writeFileSync(
      contractsDir + "/Greeter.json",
      JSON.stringify(GreeterArtifact, null, 2)
    );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
