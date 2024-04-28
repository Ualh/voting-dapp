import React, { useState } from "react";
import { Button, Input, Box, FormControl, FormLabel } from "@chakra-ui/react";
import { sendInput } from "./utils";

function CreatePoll({ signer }) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([""]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = JSON.stringify({
            method: "create_poll",
            question: question,
            options: options.filter(opt => opt.trim() !== "")
        });
        await sendInput(payload, signer);
    };

    const handleAddOption = () => {
        setOptions([...options, ""]);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = options.map((opt, i) => (i === index ? value : opt));
        setOptions(newOptions);
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel>Question</FormLabel>
                    <Input value={question} onChange={e => setQuestion(e.target.value)} required />
                </FormControl>
                {options.map((option, index) => (
                    <FormControl key={index}>
                        <FormLabel>Option {index + 1}</FormLabel>
                        <Input value={option} onChange={e => handleOptionChange(index, e.target.value)} required />
                    </FormControl>
                ))}
                <Button onClick={handleAddOption}>Add Option</Button>
                <Button type="submit" colorScheme="blue">Create Poll</Button>
            </form>
        </Box>
    );
}

export default CreatePoll;
