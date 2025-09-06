import { refineReadmeWithGroq } from "../services/aiService.js";

export const refineReadme = async (req, res) => {
  const { currentReadme, userRequest } = req.body;
  if (!currentReadme || !userRequest) {
    return res
      .status(400)
      .json({ message: "Both current README and user request are required." });
  }
  try {
    const updatedReadme = await refineReadmeWithGroq(
      currentReadme,
      userRequest
    );
    res.json({ readme: updatedReadme });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
