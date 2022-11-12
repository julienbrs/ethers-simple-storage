const ethers = require("ethers");
const fs = require("fs-extra");

// async function!
async function main() {
  const provider = new ethers.providers.JsonRpcBatchProvider(
    "HTTP://127.0.0.1:7545"
  );
  const wallet = new ethers.Wallet("PRIVATE KEY", provider);
  const abi = fs.readFileSync("SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync("SimpleStorage_sol_SimpleStorage.bin", "utf8");
  const factory = new ethers.ContractFactory(abi, binary, wallet);

  console.log("Contract is deploying, please wait...");
  const contract = await factory.deploy();
  await contract.deployTransaction.wait(1);

  // /* Manual way to do tx settings */
  // const tx = {
  //   nonce: nonce,
  // const nonce = await wallet.getTransactionCount();
  //   gasPrice: 20000000000,
  //   gasLimit: 6721975,
  //   to: null, // we deploying contract, so there is no to address
  //   value: 0, // and no value
  //   data: binary, // contract binary
  //   chainId: 5777, // chainId of ganache
  // };
  // // now we need to sign transaction and send it to network
  // const sentTxResponse = await wallet.sendTransaction(tx);
  // // wait for transaction to be mined
  // const sentTxReceipt = await sentTxResponse.wait(1);
  // console.log(sentTxReceipt);

  const currentFavoriteNumber = await contract.retrieve();
  console.log("Current favorite number is: ", currentFavoriteNumber.toString());
  await contract.store(14);
  const newFavoriteNumber = await contract.retrieve();
  console.log("New favorite number is: ", newFavoriteNumber.toString());
}

main();
