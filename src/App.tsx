import React, { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./App.css";

const App = () => {
  const [crulCommand, setcrulCommand] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleConvert = async () => {
    setError(null); // Reset any previous error state
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.qa.fastn.ai/api/v1/ConvertToKarate",
        {
          method: "POST",
          headers: {
            "x-fastn-api-key": "b1051126-9e4c-4d0e-85d5-14c6570864a3",
            "Content-Type": "application/json",
            "x-fastn-space-id": "1bace0da-fcc9-4889-ac1c-d5467703371d",
            stage: "LIVE",
          },
          body: JSON.stringify({
            input: {
              crulCommand, // Use correct spelling here
            },
          }),
        }
      );
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // For debugging

      // Ensure the API returns 'output' field, if not, check the response structure
      if (data && data.karateTest) {
        setOutput(data.karateTest);
      } else {
        throw new Error("No output returned from the API.");
      }
    } catch (error) {
      // Ensure error is handled properly
      if (error instanceof Error) {
        console.error("Error:", error.message);
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleCopy = () => {
    if (output) {
      navigator.clipboard
        .writeText(output)
        .then(() => {})
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };
  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <div className="text-black flex justify-center items-center flex-col">
        <img
          src="https://www.kloia.com/hubfs/karate-framework.png"
          className="w-[30%]"
          alt="Karate Framework Logo"
        />
        <h1 className="text-4xl text-black font-bold">Karate Convertor</h1>
      </div>

      <div className="flex justify-center gap-4">
        <textarea
          className="border p-2 bg-[#F8F8FF] text-black w-[600px] font-400 focus:outline-none "
          placeholder="Enter your cURL command here"
          value={crulCommand}
          onChange={(e) => setcrulCommand(e.target.value)}
        />

        <div className=" relative ">
          <SyntaxHighlighter
            language="javascript"
            className="w-[600px] min-h-[300px] text-start rounded-md"
            style={docco}
          >
            {output || "Converted Karate test will appear here"}
          </SyntaxHighlighter>
          {output && (
            <button
              className="copy absolute right-2 top-2 bg-transparent hover:bg-transparent text-blue-500 py-1 px-2 rounded z-20"
              onClick={handleCopy}
              aria-label="Copy output to clipboard"
            >
              <span
                data-text-end="Copied!"
                data-text-initial="Copy to clipboard"
                className="tooltip"
              ></span>
              <span>
                <svg
                  xmlSpace="preserve"
                  viewBox="0 0 6.35 6.35"
                  height="20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                  className="clipboard"
                >
                  <g>
                    <path
                      fill="currentColor"
                      d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"
                    />
                  </g>
                </svg>
                <svg
                  xmlSpace="preserve"
                  viewBox="0 0 24 24"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                  className="checkmark"
                >
                  <g>
                    <path
                      data-original="#000000"
                      fill="currentColor"
                      d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                    />
                  </g>
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500">
          <p>Error: {error}</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button
          onClick={handleConvert}
          className={`bg-blue-500 text-white py-2 px-4 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Converting..." : "Convert"}
        </button>
      </div>
    </div>
  );
};

export default App;
