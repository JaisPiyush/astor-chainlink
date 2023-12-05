

const cashPool = '0xC4F10f35326f648954b9264cD1771b0dFf977016';
const baseUrl = args[0]
const url = `${baseUrl}?address=${cashPool}`;
console.log(url)


const exchangeDataFetchRequest = Functions.makeHttpRequest({
    url: url,
    headers: {
        "Content-Type": "application/json",
    },
});

const exchangeDataFetchResponse = await exchangeDataFetchRequest;
if (exchangeDataFetchResponse.error) {
    console.log(exchangeDataFetchResponse.error);
    throw Error("Request failed");
}

const data = exchangeDataFetchResponse['data'];
if (data.Response === "Error") {
    console.error(data.Message);
    throw Error(`Functional error. Read message: ${data.Message}`);
}


const re =  Uint8Array.from(data.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
console.log(re.length)
return re
