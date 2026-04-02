export interface Project {
  title: string;
  description: string;
  technologies: string[];
  category: 'ML' | 'WebDev';
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
}

export const allProjects: Project[] = [
  {
    title: "LibreChat LiteLLM Proxy",
    description: "A lightweight proxy implementation that bridges LibreChat with LiteLLM, enabling unified access to multiple LLMs. Experimental setup trying to replace Openwebui and being the real open-source Cuba Libre.",
    technologies: ["litellm", "librechat", "docker", "fastapi"],
    category: "ML",
    githubUrl: "https://github.com/kevinkunkel98/LibreChat-LiteLLM-Proxy",
    imageUrl: "/assets/libre.jpeg"
  },
  {
    title: "FSR RAG Chat Assistant",
    description: "The FSR RAG Chat Assistant is a Retrieval-Augmented Generation (RAG) chatbot designed to support the student council of the computer science faculty at the University of Leipzig.",
    technologies: ["ollama", "spring-ai", "react", "shadcn-ui", "pgvector"],
    category: "ML",
    githubUrl: "https://github.com/kevinkunkel98/fsr-rag-assistant.git",
    imageUrl: "/assets/fsrchat.png"
  },
  {
    title: "Computer Science Faculty Website",
    description: "Web presence static page that displays all relevant information, news, and events related to the elected council members of the computer science faculty at the University of Leipzig.",
    technologies: ["astro", "node", "flowbite", "netlify"],
    category: "WebDev",
    liveUrl: "https://fsinf.informatik.uni-leipzig.de/",
    imageUrl: "/assets/fsinf.png"
  },
  {
    title: "90s Forum Post SVM Classifier",
    description: "Support Vector Machine that classifies forum posts from the 90s into different topics based on their content using TF-IDF vectorization and gives insights into early internet shitposting.",
    technologies: ["scikit-learn", "kaggle", "fastapi", "react"],
    category: "ML",
    githubUrl: "https://github.com/kevinkunkel98/90sInternetSVM.git",
    imageUrl: "/assets/netscape.jpg"
  },
  {
    title: "Vilkulakis - The Online Game",
    description: "Online real-time multiplayer version of the card game Werewolves that has one lobby and supports 20 active players with a chat GUI.",
    technologies: ["node", "socket-io", "express", "mongodb"],
    category: "WebDev",
    githubUrl: "https://github.com/kevinkunkel98/VilkulakisGame.git",
    imageUrl: "/assets/vilkulakis.png"
  },
  {
    title: "Study BrAIn - Study Smarter Chat",
    description: "RAG Chat that helps you study and chat with your lecture slides and embed notes using GPT 3.5 and ChromaDB.",
    technologies: ["flask", "bootstrap", "langchain", "chromadb"],
    category: "ML",
    githubUrl: "https://github.com/kevinkunkel98/Study-Brain-Chatbot",
    imageUrl: "/assets/studybrain.png"
  },
  {
    title: "Linux Dev Blog and Portfolio Website",
    description: "My first real portfolio website that I used to document my journey into web development and Arch Linux customizations.",
    technologies: ["astro", "react", "express", "tailwind"],
    category: "WebDev",
    liveUrl: "https://kevin-kunkel.netlify.app/",
    imageUrl: "/assets/devblog.png"
  }
];
