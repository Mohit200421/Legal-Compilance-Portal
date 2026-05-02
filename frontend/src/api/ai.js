import API from "./axios";

const aiApi = {
  ask: (question, documentText = "") =>
    API.post("/ai-chat", { question, documentText }),
};

export default aiApi;
