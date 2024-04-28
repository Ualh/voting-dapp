import React, { useState, useEffect } from "react";
import { Button, Select, Box } from "@chakra-ui/react";
import { sendInput, inspect } from "./utils";

function Vote({ signer }) {
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState('');
    const [vote, setVote] = useState('');

    useEffect(() => {
        const fetchPolls = async () => {
            const response = await inspect({ method: "get_polls" });
            if (response && response.polls) {
                setPolls(response.polls);
            }
        };

        if (signer) {
            fetchPolls();
        }
    }, [signer]); // Ensure this re-runs when signer changes

    const handleVote = async () => {
        if (!selectedPoll || !vote) return;
        const payload = JSON.stringify({
            method: "vote",
            poll_id: selectedPoll,
            option: vote
        });
        await sendInput(payload, signer);
    };

    return (
        <Box>
            <Select placeholder="Select Poll" value={selectedPoll} onChange={e => setSelectedPoll(e.target.value)}>
                {polls.map(poll => (
                    <option key={poll.id} value={poll.id}>{poll.question}</option>
                ))}
            </Select>
            <Select placeholder="Select Option" value={vote} onChange={e => setVote(e.target.value)}>
                {selectedPoll && polls.find(poll => poll.id === selectedPoll)?.options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </Select>
            <Button onClick={handleVote} colorScheme="green">Vote</Button>
        </Box>
    );
}

export default Vote;
