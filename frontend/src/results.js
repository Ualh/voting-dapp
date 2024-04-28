import React, { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { inspect } from "./utils";

function Results({ signer }) {
    const [results, setResults] = useState([]);

    useEffect(() => {
        async function fetchResults() {
            const response = await inspect({ method: "get_results" }, signer);
            if (response) {
                setResults(response.polls);
            }
        }

        fetchResults();
    }, [signer]);

    return (
        <Box>
            {results.map(result => (
                <Box key={result.id}>
                    <Text fontSize="xl">{result.question}</Text>
                    {Object.entries(result.votes).map(([option, count]) => (
                        <Text key={option}>{option}: {count}</Text>
                    ))}
                </Box>
            ))}
        </Box>
    );
}

export default Results;
