// utils.js
import { ethers } from "ethers";
import { INPUTBOX_ADDRESS, DAPP_ADDRESS, DEFAULT_URL } from "./constants";

const InputBoxABI = [
    {
        "inputs": [],
        "name": "InputSizeExceedsLimit",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "dapp",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "inputIndex",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "input",
                "type": "bytes"
            }
        ],
        "name": "InputAdded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_dapp",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "_input",
                "type": "bytes"
            }
        ],
        "name": "addInput",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const sendInput = async (value, signer) => {
    const inputBox = new ethers.Contract(INPUTBOX_ADDRESS, InputBoxABI, signer);
    const inputBytes = ethers.utils.toUtf8Bytes(value);
    const tx = await inputBox.addInput(DAPP_ADDRESS, inputBytes);
    await tx.wait();
};

export const inspect = async (payload, signer) => {
    const response = await fetch(`${DEFAULT_URL}`, { // Corrected the URL path to use DEFAULT_URL directly
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // More descriptive error message
    }

    return await response.json();
};
