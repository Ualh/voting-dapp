import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ChakraProvider } from "@chakra-ui/react";
import CreatePoll from "./CreatePoll";
import Vote from "./Vote";
import Results from "./results";

function App() {
    const [signer, setSigner] = useState(undefined);

    useEffect(() => {
        const setupEthereum = async () => {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                setSigner(signer);
            } else {
                alert("MetaMask is required to use this application.");
            }
        };

        setupEthereum();

        window.ethereum.on('accountsChanged', setupEthereum); // Re-setup if account changes
    }, []);

    return (
        <ChakraProvider>
            <div className="App">
                <CreatePoll signer={signer} />
                <Vote signer={signer} />
                <Results signer={signer} />
            </div>
        </ChakraProvider>
    );
}

export default App;
