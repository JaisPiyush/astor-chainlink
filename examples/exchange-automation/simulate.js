const fs = require("fs");
const path = require("path");
const {
  SecretsManager,
  simulateScript,
  buildRequestCBOR,
  ReturnType,
  decodeResult,
  Location,
  CodeLanguage,
} = require("@chainlink/functions-toolkit");
const automatedFunctionsConsumerAbi = require("../../abi/automatedFunctions.json");
const ethers = require("ethers");
require("@chainlink/env-enc").config();

const updateRequestMumbai = async () => {
    // hardcoded for Polygon Mumbai
    const routerAddress = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C";
    const donId = "fun-polygon-mumbai-1";
    const gatewayUrls = [
      "https://01.functions-gateway.testnet.chain.link/",
      "https://02.functions-gateway.testnet.chain.link/"
    ];
    const explorerUrl = "https://mumbai.polygonscan.com";
  
    // Initialize functions settings
    const source = fs
      .readFileSync(path.resolve(__dirname, "source.js"))
      .toString();
    const backendURL = "http://localhost:3000/api/cashPool/exchange" //TODO: Add
    const args = [backendURL];
    const secrets = {  };
    const slotIdNumber = 0; // slot ID where to upload the secrets
    const expirationTimeMinutes = 150; // expiration time in minutes of the secrets
    const gasLimit = 300000;
  
    // Initialize ethers signer and provider to interact with the contracts onchain
    const privateKey = process.env.PRIVATE_KEY; // fetch PRIVATE_KEY
    if (!privateKey)
      throw new Error(
        "private key not provided - check your environment variables"
      );
  
    const rpcUrl = process.env.POLYGON_MUMBAI_RPC_URL; // fetch mumbai RPC URL
  
    if (!rpcUrl)
      throw new Error(`rpcUrl not provided  - check your environment variables`);
  
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider); // create ethers signer for signing transactions
  
    ///////// START SIMULATION ////////////
  
    console.log("Start simulation...");
  
    const response = await simulateScript({
      source: source,
      args: args,
      bytesArgs: [], // bytesArgs - arguments can be encoded off-chain to bytes.
      secrets: secrets,
    });
  
    console.log("Simulation result", response);
    const errorString = response.errorString;
    if (errorString) {
      console.log(`❌ Error during simulation: `, errorString);
    } else {
      const returnType = ReturnType.uint256;
      const responseBytesHexstring = response.responseBytesHexstring;
      if (ethers.utils.arrayify(responseBytesHexstring).length > 0) {
        const decodedResponse = decodeResult(
          response.responseBytesHexstring,
          returnType
        );
        console.log(`✅ Decoded response to ${returnType}: `, decodedResponse);
      }
    }
  };
  
  updateRequestMumbai().catch((e) => {
    console.error(e);
    process.exit(1);
  });
  