import axios from "axios";

export const generateReadmeWithQwen = async (fileTree, repoName) => {
  console.log("Sending data to AI...");

const systemPrompt = `
You are an expert software developer and technical writer. Your task is to generate a clean, professional, and beginner-friendly GitHub README.md in GitHub Flavored Markdown, based solely on the provided file structure.

The README must include these key sections:

1. **Project Title & Description** – A clear title and two sentences description.
2. **Table of Contents** – Organized and clickable.
3. **About The Project** – What the project does, why it exists, and the problem it solves, and also its features.
4. **Tech Stack** – List the main technologies, frameworks, and tools used in a structured manner.
5. **Getting Started**
   - Prerequisites
   - Installation steps
   - Running locally
6. **Contact / Support** – How users can reach the maintainers.

Keep the tone professional, concise, and clear. Use proper Markdown formatting with headings, lists, and code blocks. Do not include logos, images, or badges. Return only the README content.
`;

const userPrompt = `
Generate a professional README.md for a project named "${repoName}", using the file structure below:

\`\`\`
${fileTree.join("\n")}
\`\`\`

Follow the structure and guidelines from the system prompt. Do not add any commentary outside the README content.
`;
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // Free tier model - very fast
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const readmeContent = response.data.choices[0].message.content;
    console.log("AI generation complete with Groq.");
    return readmeContent;
  } catch (error) {
    console.error("Error calling Groq AI:", error.message);

    if (error.response?.status === 429) {
      throw new Error(
        "Rate limit exceeded. Please try again in a few minutes."
      );
    } else if (error.response?.status === 401) {
      throw new Error("Invalid API key. Please check your Groq API key.");
    } else {
      throw new Error("Failed to generate README from AI. Please try again.");
    }
  }
};

export const refineReadmeWithGroq = async (currentReadme, userRequest) => {
  console.log("🗣️ Refining README with AI...");
  const systemPrompt = `You are an expert README editor. Your task is to modify the provided README content based on the user's request. Respond ONLY with the full, updated README.md content. Do not add any of your own commentary like "Here is the updated README".`;

  const userPrompt = `
    Here is the current README.md:
    ---
    ${currentReadme}
    ---

    Now, please apply the following change: "${userRequest}".

    Remember to return the complete, updated README file.
    `;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 2000, 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const readmeContent = response.data.choices[0].message.content;
    console.log("AI refinement complete with Groq.");
    return readmeContent;
  } catch (error) {
    console.error("Error calling Groq AI for refinement:", error.message);
    throw new Error("Failed to refine README from AI.");
  }
};
