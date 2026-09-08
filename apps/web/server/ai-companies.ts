export const AI_COMPANY_CATEGORIES = [
  { name: "AI Labs", slug: "ai-lab" },
  { name: "Developer Tools", slug: "developer-tools" },
  { name: "Infrastructure", slug: "infrastructure" },
  { name: "Enterprise AI", slug: "enterprise" },
  { name: "Robotics", slug: "robotics" },
  { name: "Consumer AI", slug: "consumer-ai" },
] as const;

export const AI_COUNTRY_OPTIONS = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "IN", label: "India" },
  { code: "FR", label: "France" },
  { code: "CA", label: "Canada" },
  { code: "DE", label: "Germany" },
  { code: "IL", label: "Israel" },
  { code: "AU", label: "Australia" },
  { code: "JP", label: "Japan" },
] as const;

export const AI_COMPANY_STATUSES = [
  { value: "STARTUP", label: "Startup" },
  { value: "GROWTH", label: "Growth" },
  { value: "PUBLIC", label: "Public" },
  { value: "ACQUIRED", label: "Acquired" },
] as const;

export type AiCompanyStatus = (typeof AI_COMPANY_STATUSES)[number]["value"];
export type AiCompanyCategorySlug =
  (typeof AI_COMPANY_CATEGORIES)[number]["slug"];
export type AiCompanyCountryCode = (typeof AI_COUNTRY_OPTIONS)[number]["code"];
export type AiCompanySort = "popular" | "newest" | "name" | "products";

export interface AiProductDefinition {
  name: string;
  slug: string;
  description: string;
  category: string;
  url?: string;
}

export interface AiCompanyDefinition {
  name: string;
  slug: string;
  description: string;
  website: string;
  city: string;
  country: AiCompanyCountryCode;
  foundedYear: number;
  status: AiCompanyStatus;
  popularityScore: number;
  featured: boolean;
  capabilities: string[];
  categories: AiCompanyCategorySlug[];
  products: AiProductDefinition[];
}

export interface AiCompanyQuery {
  search?: string;
  category?: AiCompanyCategorySlug;
  country?: AiCompanyCountryCode;
  status?: AiCompanyStatus;
  sort: AiCompanySort;
  page: number;
  limit: number;
}

export interface AiCompanyCategory {
  name: string;
  slug: AiCompanyCategorySlug;
  count: number;
}

export interface AiCompanyDirectoryEntry {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  city: string;
  country: AiCompanyCountryCode;
  foundedYear: number;
  status: AiCompanyStatus;
  categories: Array<{ name: string; slug: string }>;
  capabilities: string[];
  productCount: number;
  featured: boolean;
}

export interface AiCompanyDetailData extends AiCompanyDirectoryEntry {
  website: string;
  products: AiProductDefinition[];
  relatedCompanies: AiCompanyDirectoryEntry[];
}

export function getAiCompanyLogoUrl(website?: string | null) {
  if (!website) return null;

  try {
    const hostname = new URL(website).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
  } catch {
    return null;
  }
}

function toSlug(value: string) {
  return value
    .toLocaleLowerCase("en-US")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function product(
  name: string,
  category: string,
  description: string,
  url?: string,
): AiProductDefinition {
  return { name, slug: toSlug(name), description, category, url };
}

function company(
  definition: Omit<AiCompanyDefinition, "products"> & {
    products: Array<Omit<AiProductDefinition, "slug"> & { slug?: string }>;
  },
): AiCompanyDefinition {
  return {
    ...definition,
    products: definition.products.map((item) => ({
      ...item,
      slug: item.slug ?? toSlug(item.name),
    })),
  };
}

export const AI_COMPANY_DEFINITIONS: AiCompanyDefinition[] = [
  company({
    name: "OpenAI",
    slug: "openai",
    description:
      "Builds frontier AI models and products for people and developers.",
    website: "https://openai.com",
    city: "San Francisco",
    country: "US",
    foundedYear: 2015,
    status: "GROWTH",
    popularityScore: 100,
    featured: true,
    capabilities: ["LLMs", "Multimodal", "Developer API", "Video Generation"],
    categories: ["ai-lab", "developer-tools", "consumer-ai"],
    products: [
      product(
        "ChatGPT",
        "Conversational AI",
        "An everyday assistant for research, writing, and analysis.",
      ),
      product(
        "OpenAI API",
        "Developer Platform",
        "Model APIs for building intelligent products.",
      ),
      product(
        "Sora",
        "Video Generation",
        "A model for creating and transforming short videos.",
      ),
    ],
  }),
  company({
    name: "Anthropic",
    slug: "anthropic",
    description: "Develops reliable, interpretable AI systems and assistants.",
    website: "https://anthropic.com",
    city: "San Francisco",
    country: "US",
    foundedYear: 2021,
    status: "GROWTH",
    popularityScore: 98,
    featured: true,
    capabilities: ["LLMs", "AI Safety", "Developer API", "Enterprise AI"],
    categories: ["ai-lab", "developer-tools", "enterprise"],
    products: [
      product(
        "Claude",
        "Conversational AI",
        "An assistant for writing, reasoning, and coding.",
      ),
      product(
        "Claude API",
        "Developer Platform",
        "A model platform for production AI applications.",
      ),
      product(
        "Claude for Work",
        "Enterprise AI",
        "Team and enterprise access to Claude workflows.",
      ),
    ],
  }),
  company({
    name: "Google DeepMind",
    slug: "google-deepmind",
    description:
      "A research lab advancing general-purpose AI and scientific discovery.",
    website: "https://deepmind.google",
    city: "London",
    country: "GB",
    foundedYear: 2010,
    status: "GROWTH",
    popularityScore: 97,
    featured: true,
    capabilities: ["AI Research", "Multimodal", "Robotics", "Scientific AI"],
    categories: ["ai-lab", "infrastructure", "robotics"],
    products: [
      product(
        "Gemini",
        "Foundation Models",
        "A family of multimodal models across Google products.",
      ),
      product(
        "AlphaFold",
        "Scientific AI",
        "A system for predicting protein structures.",
      ),
      product(
        "Gemini API",
        "Developer Platform",
        "Developer access to Gemini models and tooling.",
      ),
    ],
  }),
  company({
    name: "Mistral AI",
    slug: "mistral-ai",
    description:
      "Builds efficient open and commercial language models from Europe.",
    website: "https://mistral.ai",
    city: "Paris",
    country: "FR",
    foundedYear: 2023,
    status: "GROWTH",
    popularityScore: 93,
    featured: true,
    capabilities: ["LLMs", "Open Models", "Developer API"],
    categories: ["ai-lab", "developer-tools"],
    products: [
      product(
        "Le Chat",
        "Conversational AI",
        "A multilingual assistant powered by Mistral models.",
      ),
      product(
        "La Plateforme",
        "Developer Platform",
        "API access to Mistral's model family.",
      ),
      product(
        "Mistral Large",
        "Foundation Models",
        "A high-capability language model for enterprise use.",
      ),
    ],
  }),
  company({
    name: "Cohere",
    slug: "cohere",
    description:
      "Provides language models and retrieval systems for enterprise software.",
    website: "https://cohere.com",
    city: "Toronto",
    country: "CA",
    foundedYear: 2019,
    status: "GROWTH",
    popularityScore: 89,
    featured: true,
    capabilities: ["LLMs", "Retrieval", "Enterprise AI", "Developer API"],
    categories: ["ai-lab", "developer-tools", "enterprise"],
    products: [
      product(
        "Command",
        "Foundation Models",
        "Language models designed for business applications.",
      ),
      product(
        "Embed",
        "Embeddings",
        "Multilingual embeddings for search and retrieval.",
      ),
      product(
        "North",
        "Enterprise AI",
        "A secure workspace for enterprise AI workflows.",
      ),
    ],
  }),
  company({
    name: "Perplexity",
    slug: "perplexity",
    description:
      "Builds answer-focused search experiences grounded in the web.",
    website: "https://perplexity.ai",
    city: "San Francisco",
    country: "US",
    foundedYear: 2022,
    status: "GROWTH",
    popularityScore: 91,
    featured: true,
    capabilities: ["AI Search", "Retrieval", "Conversational AI"],
    categories: ["consumer-ai", "developer-tools"],
    products: [
      product(
        "Perplexity Search",
        "AI Search",
        "An answer engine with citations and web context.",
      ),
      product(
        "Perplexity API",
        "Developer Platform",
        "Search and answer capabilities for applications.",
      ),
    ],
  }),
  company({
    name: "Hugging Face",
    slug: "hugging-face",
    description:
      "An open platform for sharing, discovering, and deploying machine learning.",
    website: "https://huggingface.co",
    city: "New York",
    country: "US",
    foundedYear: 2016,
    status: "GROWTH",
    popularityScore: 92,
    featured: true,
    capabilities: ["Open Models", "Model Hub", "Datasets", "Developer Tools"],
    categories: ["developer-tools", "ai-lab"],
    products: [
      product(
        "Hub",
        "Model Registry",
        "A collaborative registry for models and datasets.",
      ),
      product(
        "Spaces",
        "App Hosting",
        "A place to demo and share machine learning applications.",
      ),
      product(
        "Inference Endpoints",
        "Model Hosting",
        "Managed deployment for production models.",
      ),
    ],
  }),
  company({
    name: "Scale AI",
    slug: "scale-ai",
    description:
      "Builds data and evaluation infrastructure for reliable AI systems.",
    website: "https://scale.com",
    city: "San Francisco",
    country: "US",
    foundedYear: 2016,
    status: "GROWTH",
    popularityScore: 88,
    featured: true,
    capabilities: [
      "Data Labeling",
      "Model Evaluation",
      "Generative AI",
      "Defense AI",
    ],
    categories: ["infrastructure", "enterprise", "ai-lab"],
    products: [
      product(
        "Scale Data Engine",
        "Data Platform",
        "Data curation and labeling infrastructure for AI teams.",
      ),
      product(
        "SEAL",
        "Model Evaluation",
        "Evaluation workflows for frontier and enterprise models.",
      ),
      product(
        "Donovan",
        "Defense AI",
        "Decision support software for defense operations.",
      ),
    ],
  }),
  company({
    name: "Runway",
    slug: "runway",
    description:
      "Creates generative tools for filmmakers, designers, and storytellers.",
    website: "https://runwayml.com",
    city: "New York",
    country: "US",
    foundedYear: 2018,
    status: "GROWTH",
    popularityScore: 86,
    featured: true,
    capabilities: ["Video Generation", "Image Generation", "Creative Tools"],
    categories: ["consumer-ai", "ai-lab"],
    products: [
      product(
        "Gen-4",
        "Video Generation",
        "A generative video model for consistent scenes and characters.",
      ),
      product(
        "Runway Studio",
        "Creative Tools",
        "An AI-native workspace for video creation.",
      ),
    ],
  }),
  company({
    name: "ElevenLabs",
    slug: "elevenlabs",
    description:
      "Builds natural voice technology for creators, developers, and media teams.",
    website: "https://elevenlabs.io",
    city: "New York",
    country: "US",
    foundedYear: 2022,
    status: "GROWTH",
    popularityScore: 87,
    featured: true,
    capabilities: ["Voice AI", "Audio Generation", "Developer API"],
    categories: ["consumer-ai", "developer-tools"],
    products: [
      product(
        "Voice Library",
        "Voice AI",
        "A catalog of expressive synthetic and designed voices.",
      ),
      product(
        "Eleven API",
        "Developer Platform",
        "Speech generation and transcription APIs.",
      ),
    ],
  }),
  company({
    name: "Midjourney",
    slug: "midjourney",
    description: "Researches and builds imaginative image generation tools.",
    website: "https://midjourney.com",
    city: "San Francisco",
    country: "US",
    foundedYear: 2021,
    status: "GROWTH",
    popularityScore: 85,
    featured: true,
    capabilities: ["Image Generation", "Creative Tools", "Visual AI"],
    categories: ["consumer-ai"],
    products: [
      product(
        "Midjourney",
        "Image Generation",
        "A creative image generation experience for visual exploration.",
      ),
      product(
        "Editor",
        "Creative Tools",
        "A workspace for iterating on generated images.",
      ),
    ],
  }),
  company({
    name: "Stability AI",
    slug: "stability-ai",
    description:
      "Develops open generative models for images, video, and audio.",
    website: "https://stability.ai",
    city: "London",
    country: "GB",
    foundedYear: 2019,
    status: "GROWTH",
    popularityScore: 79,
    featured: false,
    capabilities: [
      "Open Models",
      "Image Generation",
      "Video Generation",
      "Audio AI",
    ],
    categories: ["consumer-ai", "ai-lab"],
    products: [
      product(
        "Stable Diffusion",
        "Image Generation",
        "An open family of image generation models.",
      ),
      product(
        "Stable Audio",
        "Audio Generation",
        "Generative audio tools for creators.",
      ),
    ],
  }),
  company({
    name: "Together AI",
    slug: "together-ai",
    description:
      "Provides fast infrastructure for training and serving open models.",
    website: "https://together.ai",
    city: "San Francisco",
    country: "US",
    foundedYear: 2022,
    status: "GROWTH",
    popularityScore: 82,
    featured: false,
    capabilities: [
      "Model Hosting",
      "Open Models",
      "GPU Infrastructure",
      "Developer API",
    ],
    categories: ["infrastructure", "developer-tools"],
    products: [
      product(
        "Together Inference",
        "Model Hosting",
        "Low-latency inference for open generative models.",
      ),
      product(
        "Together Fine-tuning",
        "Model Training",
        "Managed fine-tuning workflows for language models.",
      ),
    ],
  }),
  company({
    name: "Groq",
    slug: "groq",
    description:
      "Builds specialized inference hardware and a fast model serving platform.",
    website: "https://groq.com",
    city: "Mountain View",
    country: "US",
    foundedYear: 2016,
    status: "GROWTH",
    popularityScore: 84,
    featured: true,
    capabilities: ["AI Chips", "Inference", "Developer API"],
    categories: ["infrastructure", "ai-lab"],
    products: [
      product(
        "GroqCloud",
        "Inference Platform",
        "Hosted inference powered by the LPU architecture.",
      ),
      product(
        "LPU Inference Engine",
        "AI Hardware",
        "Specialized hardware for high-throughput inference.",
      ),
    ],
  }),
  company({
    name: "Cerebras",
    slug: "cerebras",
    description:
      "Designs wafer-scale systems for training and running large AI models.",
    website: "https://cerebras.ai",
    city: "Sunnyvale",
    country: "US",
    foundedYear: 2016,
    status: "GROWTH",
    popularityScore: 80,
    featured: false,
    capabilities: ["AI Chips", "Model Training", "Inference"],
    categories: ["infrastructure", "ai-lab"],
    products: [
      product(
        "Cerebras CS-3",
        "AI Hardware",
        "A wafer-scale system for large model training.",
      ),
      product(
        "Cerebras Cloud",
        "Inference Platform",
        "Cloud access to Cerebras compute and models.",
      ),
    ],
  }),
  company({
    name: "NVIDIA",
    slug: "nvidia",
    description:
      "Builds the computing platforms that power modern AI development.",
    website: "https://nvidia.com",
    city: "Santa Clara",
    country: "US",
    foundedYear: 1993,
    status: "PUBLIC",
    popularityScore: 96,
    featured: true,
    capabilities: [
      "AI Chips",
      "Cloud Infrastructure",
      "Developer Tools",
      "Robotics",
    ],
    categories: ["infrastructure", "enterprise", "robotics"],
    products: [
      product(
        "CUDA",
        "Developer Platform",
        "A parallel computing platform for accelerated workloads.",
      ),
      product(
        "DGX Cloud",
        "Cloud Infrastructure",
        "Managed infrastructure for enterprise AI teams.",
      ),
      product(
        "Isaac",
        "Robotics Platform",
        "Simulation and software tools for robotics developers.",
      ),
    ],
  }),
  company({
    name: "Databricks",
    slug: "databricks",
    description:
      "Unifies data, analytics, and AI development on a collaborative platform.",
    website: "https://databricks.com",
    city: "San Francisco",
    country: "US",
    foundedYear: 2013,
    status: "GROWTH",
    popularityScore: 90,
    featured: true,
    capabilities: ["Data Platform", "Lakehouse", "MLOps", "Enterprise AI"],
    categories: ["infrastructure", "enterprise", "developer-tools"],
    products: [
      product(
        "Mosaic AI",
        "Enterprise AI",
        "Tools for building, evaluating, and serving AI applications.",
      ),
      product(
        "Lakehouse Platform",
        "Data Platform",
        "A shared foundation for data engineering and analytics.",
      ),
      product(
        "MLflow",
        "MLOps",
        "Open tooling for the machine learning lifecycle.",
      ),
    ],
  }),
  company({
    name: "Cursor",
    slug: "cursor",
    description: "Builds an AI-first coding environment for software teams.",
    website: "https://cursor.com",
    city: "San Francisco",
    country: "US",
    foundedYear: 2022,
    status: "STARTUP",
    popularityScore: 94,
    featured: true,
    capabilities: ["Coding AI", "Developer Tools", "AI Agents"],
    categories: ["developer-tools", "consumer-ai"],
    products: [
      product(
        "Cursor Editor",
        "Coding Assistant",
        "An editor with codebase-aware AI assistance.",
      ),
      product(
        "Cursor Agents",
        "AI Agents",
        "Task-oriented coding agents inside the editor.",
      ),
    ],
  }),
  company({
    name: "Replit",
    slug: "replit",
    description:
      "Makes software creation accessible through collaborative, AI-assisted tools.",
    website: "https://replit.com",
    city: "San Francisco",
    country: "US",
    foundedYear: 2016,
    status: "GROWTH",
    popularityScore: 83,
    featured: false,
    capabilities: ["Coding AI", "AI Agents", "App Hosting", "Developer Tools"],
    categories: ["developer-tools", "consumer-ai"],
    products: [
      product(
        "Replit Agent",
        "AI Agents",
        "An agent that turns natural language into working software.",
      ),
      product(
        "Replit Workspace",
        "Developer Platform",
        "A browser-based environment for building and deploying apps.",
      ),
    ],
  }),
  company({
    name: "Pika",
    slug: "pika",
    description:
      "Creates intuitive generative video tools for playful visual storytelling.",
    website: "https://pika.art",
    city: "Palo Alto",
    country: "US",
    foundedYear: 2023,
    status: "STARTUP",
    popularityScore: 76,
    featured: false,
    capabilities: ["Video Generation", "Creative Tools", "Image-to-Video"],
    categories: ["consumer-ai"],
    products: [
      product(
        "Pika",
        "Video Generation",
        "A prompt-driven tool for creating and editing short videos.",
      ),
      product(
        "Pika Effects",
        "Creative Tools",
        "Transformative effects for AI-assisted video creation.",
      ),
    ],
  }),
  company({
    name: "xAI",
    slug: "xai",
    description:
      "Builds large-scale AI systems and assistants for broad reasoning tasks.",
    website: "https://x.ai",
    city: "Palo Alto",
    country: "US",
    foundedYear: 2023,
    status: "GROWTH",
    popularityScore: 88,
    featured: true,
    capabilities: ["LLMs", "AI Research", "Conversational AI"],
    categories: ["ai-lab", "consumer-ai"],
    products: [
      product(
        "Grok",
        "Conversational AI",
        "A conversational assistant with real-time context.",
      ),
      product(
        "Grok API",
        "Developer Platform",
        "Developer access to xAI models.",
      ),
    ],
  }),
  company({
    name: "AI21 Labs",
    slug: "ai21-labs",
    description:
      "Develops language models and reasoning tools for enterprise applications.",
    website: "https://ai21.com",
    city: "Tel Aviv",
    country: "IL",
    foundedYear: 2017,
    status: "GROWTH",
    popularityScore: 74,
    featured: false,
    capabilities: ["LLMs", "Summarization", "Developer API"],
    categories: ["ai-lab", "developer-tools"],
    products: [
      product(
        "Jamba",
        "Foundation Models",
        "A long-context model family for efficient applications.",
      ),
      product(
        "AI21 Studio",
        "Developer Platform",
        "APIs and tools for production language applications.",
      ),
    ],
  }),
  company({
    name: "Inflection AI",
    slug: "inflection-ai",
    description:
      "Builds personal AI experiences with a focus on helpful conversation.",
    website: "https://inflection.ai",
    city: "Palo Alto",
    country: "US",
    foundedYear: 2022,
    status: "ACQUIRED",
    popularityScore: 67,
    featured: false,
    capabilities: ["LLMs", "Conversational AI", "Personal AI"],
    categories: ["ai-lab", "consumer-ai"],
    products: [
      product(
        "Pi",
        "Personal AI",
        "A conversational personal intelligence assistant.",
      ),
      product(
        "Inflection Models",
        "Foundation Models",
        "Language models designed for empathetic dialogue.",
      ),
    ],
  }),
  company({
    name: "Character.AI",
    slug: "character-ai",
    description:
      "Lets people create and interact with expressive AI characters.",
    website: "https://character.ai",
    city: "Menlo Park",
    country: "US",
    foundedYear: 2021,
    status: "GROWTH",
    popularityScore: 81,
    featured: false,
    capabilities: ["Conversational AI", "Generative Characters", "Consumer AI"],
    categories: ["consumer-ai", "ai-lab"],
    products: [
      product(
        "Character Platform",
        "Conversational AI",
        "A platform for creating and discovering AI characters.",
      ),
      product(
        "Character Calls",
        "Voice AI",
        "Voice conversations with user-created characters.",
      ),
    ],
  }),
  company({
    name: "Adept AI",
    slug: "adept-ai",
    description:
      "Researches AI agents that can operate software on behalf of people.",
    website: "https://adept.ai",
    city: "San Francisco",
    country: "US",
    foundedYear: 2022,
    status: "ACQUIRED",
    popularityScore: 64,
    featured: false,
    capabilities: ["AI Agents", "Multimodal", "Enterprise AI"],
    categories: ["ai-lab", "enterprise", "developer-tools"],
    products: [
      product(
        "ACT-1",
        "AI Agents",
        "An agent research system for interacting with software.",
      ),
      product(
        "Adept Models",
        "Foundation Models",
        "Models designed for action-oriented computer use.",
      ),
    ],
  }),
  company({
    name: "Harvey",
    slug: "harvey",
    description:
      "Builds AI workflows for legal professionals and knowledge workers.",
    website: "https://harvey.ai",
    city: "San Francisco",
    country: "US",
    foundedYear: 2022,
    status: "GROWTH",
    popularityScore: 78,
    featured: false,
    capabilities: ["Legal AI", "Enterprise AI", "AI Agents"],
    categories: ["enterprise", "developer-tools"],
    products: [
      product(
        "Harvey Assistant",
        "Legal AI",
        "AI-assisted research and drafting for legal teams.",
      ),
      product(
        "Harvey Workflows",
        "Enterprise AI",
        "Configurable workflows for professional services.",
      ),
    ],
  }),
  company({
    name: "Writer",
    slug: "writer",
    description:
      "Provides enterprise generative AI with control, governance, and workflow tools.",
    website: "https://writer.com",
    city: "San Francisco",
    country: "US",
    foundedYear: 2020,
    status: "GROWTH",
    popularityScore: 77,
    featured: false,
    capabilities: ["Enterprise AI", "LLMs", "AI Agents", "Governance"],
    categories: ["enterprise", "developer-tools"],
    products: [
      product(
        "Palmyra",
        "Foundation Models",
        "Enterprise language models with configurable behavior.",
      ),
      product(
        "Writer Platform",
        "Enterprise AI",
        "A governed workspace for building generative workflows.",
      ),
    ],
  }),
  company({
    name: "Glean",
    slug: "glean",
    description:
      "Connects company knowledge to searchable and actionable enterprise AI.",
    website: "https://glean.com",
    city: "Palo Alto",
    country: "US",
    foundedYear: 2019,
    status: "GROWTH",
    popularityScore: 75,
    featured: false,
    capabilities: ["Enterprise Search", "Retrieval", "AI Agents"],
    categories: ["enterprise", "developer-tools"],
    products: [
      product(
        "Glean Search",
        "Enterprise Search",
        "Search across an organization's applications and knowledge.",
      ),
      product(
        "Glean Assistant",
        "Enterprise AI",
        "An assistant grounded in company context.",
      ),
    ],
  }),
  company({
    name: "Dataminr",
    slug: "dataminr",
    description:
      "Detects real-time signals from public data for organizations and teams.",
    website: "https://dataminr.com",
    city: "New York",
    country: "US",
    foundedYear: 2009,
    status: "GROWTH",
    popularityScore: 68,
    featured: false,
    capabilities: ["Real-time AI", "Risk Intelligence", "Enterprise AI"],
    categories: ["enterprise", "ai-lab"],
    products: [
      product(
        "Pulse",
        "Risk Intelligence",
        "Real-time alerts from emerging public signals.",
      ),
      product(
        "First Alert",
        "Enterprise AI",
        "Operational intelligence for organizations.",
      ),
    ],
  }),
  company({
    name: "Weights & Biases",
    slug: "weights-and-biases",
    description:
      "Provides experiment tracking and collaboration tools for ML teams.",
    website: "https://wandb.ai",
    city: "San Francisco",
    country: "US",
    foundedYear: 2017,
    status: "GROWTH",
    popularityScore: 80,
    featured: false,
    capabilities: ["MLOps", "Experiment Tracking", "Model Evaluation"],
    categories: ["developer-tools", "infrastructure"],
    products: [
      product(
        "Weights & Biases",
        "MLOps",
        "Experiment tracking and model development collaboration.",
      ),
      product(
        "Weave",
        "Model Evaluation",
        "Tracing and evaluation for generative AI applications.",
      ),
    ],
  }),
  company({
    name: "LangChain",
    slug: "langchain",
    description:
      "Builds developer frameworks and observability for language model applications.",
    website: "https://langchain.com",
    city: "San Francisco",
    country: "US",
    foundedYear: 2022,
    status: "STARTUP",
    popularityScore: 86,
    featured: true,
    capabilities: ["AI Agents", "Developer Tools", "Observability"],
    categories: ["developer-tools", "infrastructure"],
    products: [
      product(
        "LangChain",
        "Developer Framework",
        "Frameworks for composing language model applications.",
      ),
      product(
        "LangSmith",
        "Observability",
        "Tracing and evaluation for AI applications and agents.",
      ),
      product(
        "LangGraph",
        "AI Agents",
        "A framework for stateful, controllable agent workflows.",
      ),
    ],
  }),
  company({
    name: "Luma AI",
    slug: "luma-ai",
    description:
      "Builds multimodal generative tools for images, video, and 3D content.",
    website: "https://lumalabs.ai",
    city: "Palo Alto",
    country: "US",
    foundedYear: 2021,
    status: "GROWTH",
    popularityScore: 73,
    featured: false,
    capabilities: ["Video Generation", "3D AI", "Image Generation"],
    categories: ["consumer-ai", "ai-lab"],
    products: [
      product(
        "Dream Machine",
        "Video Generation",
        "A generative video model for creative production.",
      ),
      product(
        "Luma Capture",
        "3D AI",
        "Tools for capturing and generating 3D scenes.",
      ),
    ],
  }),
  company({
    name: "Magic AI",
    slug: "magic-ai",
    description:
      "Researches software agents that can collaborate with engineering teams.",
    website: "https://magic.dev",
    city: "San Francisco",
    country: "US",
    foundedYear: 2022,
    status: "STARTUP",
    popularityScore: 70,
    featured: false,
    capabilities: ["Coding AI", "AI Agents", "Long Context"],
    categories: ["developer-tools", "ai-lab"],
    products: [
      product(
        "Magic LTM",
        "Foundation Models",
        "Long-context models for software development tasks.",
      ),
      product(
        "Magic Agents",
        "AI Agents",
        "Agents designed to collaborate on codebases.",
      ),
    ],
  }),
  company({
    name: "Modal",
    slug: "modal",
    description: "Makes cloud compute programmable for data and AI workloads.",
    website: "https://modal.com",
    city: "New York",
    country: "US",
    foundedYear: 2021,
    status: "STARTUP",
    popularityScore: 72,
    featured: false,
    capabilities: ["GPU Infrastructure", "Serverless", "Developer Tools"],
    categories: ["infrastructure", "developer-tools"],
    products: [
      product(
        "Modal Cloud",
        "Cloud Infrastructure",
        "Serverless compute for AI and data workloads.",
      ),
      product(
        "Modal Sandboxes",
        "Developer Platform",
        "Isolated environments for running code and agents.",
      ),
    ],
  }),
  company({
    name: "Replicate",
    slug: "replicate",
    description:
      "Provides an approachable API for running open machine learning models.",
    website: "https://replicate.com",
    city: "San Francisco",
    country: "US",
    foundedYear: 2019,
    status: "GROWTH",
    popularityScore: 79,
    featured: false,
    capabilities: ["Model Hosting", "Open Models", "Developer API"],
    categories: ["developer-tools", "infrastructure"],
    products: [
      product(
        "Replicate API",
        "Developer Platform",
        "An API for running and integrating machine learning models.",
      ),
      product(
        "Cog",
        "Model Deployment",
        "An open tool for packaging models in containers.",
      ),
    ],
  }),
  company({
    name: "Anyscale",
    slug: "anyscale",
    description:
      "Builds a distributed computing platform for production AI applications.",
    website: "https://anyscale.com",
    city: "San Francisco",
    country: "US",
    foundedYear: 2019,
    status: "GROWTH",
    popularityScore: 71,
    featured: false,
    capabilities: ["Distributed Compute", "MLOps", "Model Training"],
    categories: ["infrastructure", "developer-tools"],
    products: [
      product(
        "Anyscale Platform",
        "AI Infrastructure",
        "A platform for scaling AI workloads from laptop to cloud.",
      ),
      product(
        "Ray",
        "Distributed Compute",
        "An open framework for distributed Python and AI workloads.",
      ),
    ],
  }),
  company({
    name: "Fireworks AI",
    slug: "fireworks-ai",
    description:
      "Optimizes model inference and customization for production AI teams.",
    website: "https://fireworks.ai",
    city: "Redwood City",
    country: "US",
    foundedYear: 2022,
    status: "GROWTH",
    popularityScore: 78,
    featured: false,
    capabilities: ["Inference", "Open Models", "Developer API"],
    categories: ["infrastructure", "developer-tools"],
    products: [
      product(
        "Fireworks Serverless",
        "Inference Platform",
        "Fast hosted inference for open and custom models.",
      ),
      product(
        "Fireworks Fine-tuning",
        "Model Training",
        "Fine-tuning workflows optimized for production use.",
      ),
    ],
  }),
  company({
    name: "Baseten",
    slug: "baseten",
    description:
      "Helps teams deploy and scale machine learning models in production.",
    website: "https://baseten.co",
    city: "New York",
    country: "US",
    foundedYear: 2019,
    status: "STARTUP",
    popularityScore: 69,
    featured: false,
    capabilities: ["Model Hosting", "Inference", "MLOps"],
    categories: ["infrastructure", "developer-tools"],
    products: [
      product(
        "Truss",
        "Model Deployment",
        "An open source framework for packaging models.",
      ),
      product(
        "Baseten Inference",
        "Inference Platform",
        "Production serving for custom machine learning models.",
      ),
    ],
  }),
  company({
    name: "Sakana AI",
    slug: "sakana-ai",
    description:
      "Explores nature-inspired methods for building efficient foundation models.",
    website: "https://sakana.ai",
    city: "Tokyo",
    country: "JP",
    foundedYear: 2023,
    status: "STARTUP",
    popularityScore: 66,
    featured: false,
    capabilities: ["AI Research", "Open Models", "Scientific AI"],
    categories: ["ai-lab"],
    products: [
      product(
        "Evolutionary Model Merge",
        "AI Research",
        "Research systems inspired by evolution and collective behavior.",
      ),
      product(
        "Sakana Models",
        "Foundation Models",
        "Efficient model families for multilingual applications.",
      ),
    ],
  }),
  company({
    name: "H2O.ai",
    slug: "h2o-ai",
    description:
      "Delivers open and enterprise machine learning platforms and assistants.",
    website: "https://h2o.ai",
    city: "Mountain View",
    country: "US",
    foundedYear: 2012,
    status: "GROWTH",
    popularityScore: 70,
    featured: false,
    capabilities: ["MLOps", "Enterprise AI", "Open Models"],
    categories: ["enterprise", "ai-lab", "developer-tools"],
    products: [
      product(
        "H2O LLM Studio",
        "Model Training",
        "A no-code and low-code workspace for fine-tuning LLMs.",
      ),
      product(
        "Driverless AI",
        "Enterprise AI",
        "Automated machine learning for enterprise teams.",
      ),
    ],
  }),
  company({
    name: "Dataiku",
    slug: "dataiku",
    description:
      "Provides a governed platform for enterprise data science and AI.",
    website: "https://dataiku.com",
    city: "Paris",
    country: "FR",
    foundedYear: 2013,
    status: "GROWTH",
    popularityScore: 74,
    featured: false,
    capabilities: ["MLOps", "Enterprise AI", "Data Platform", "Governance"],
    categories: ["enterprise", "developer-tools"],
    products: [
      product(
        "Dataiku DSS",
        "Data Platform",
        "A collaborative workspace for data and AI projects.",
      ),
      product(
        "Dataiku LLM Mesh",
        "Enterprise AI",
        "Governed access to models and generative workflows.",
      ),
    ],
  }),
  company({
    name: "Aleph Alpha",
    slug: "aleph-alpha",
    description:
      "Develops sovereign generative AI systems for European organizations.",
    website: "https://aleph-alpha.com",
    city: "Heidelberg",
    country: "DE",
    foundedYear: 2019,
    status: "GROWTH",
    popularityScore: 65,
    featured: false,
    capabilities: ["LLMs", "Enterprise AI", "Multimodal", "Sovereign AI"],
    categories: ["ai-lab", "enterprise"],
    products: [
      product(
        "Luminous",
        "Foundation Models",
        "Multilingual foundation models for regulated environments.",
      ),
      product(
        "PhariaAI",
        "Enterprise AI",
        "A governed platform for enterprise generative AI.",
      ),
    ],
  }),
  company({
    name: "Figure AI",
    slug: "figure-ai",
    description:
      "Builds humanoid robots intended to work safely alongside people.",
    website: "https://figure.ai",
    city: "Sunnyvale",
    country: "US",
    foundedYear: 2022,
    status: "GROWTH",
    popularityScore: 83,
    featured: true,
    capabilities: ["Humanoid Robotics", "Embodied AI", "Computer Vision"],
    categories: ["robotics", "ai-lab"],
    products: [
      product(
        "Figure 01",
        "Humanoid Robotics",
        "A general-purpose humanoid robot platform.",
      ),
      product(
        "Helix",
        "Embodied AI",
        "A vision-language-action system for robot control.",
      ),
    ],
  }),
  company({
    name: "Skild AI",
    slug: "skild-ai",
    description: "Develops general-purpose intelligence for capable robots.",
    website: "https://skild.ai",
    city: "Pittsburgh",
    country: "US",
    foundedYear: 2023,
    status: "STARTUP",
    popularityScore: 62,
    featured: false,
    capabilities: ["Embodied AI", "Robotics", "Computer Vision"],
    categories: ["robotics", "ai-lab"],
    products: [
      product(
        "Skild Brain",
        "Embodied AI",
        "A general-purpose model for robot perception and control.",
      ),
      product(
        "Skild Simulation",
        "Robotics Platform",
        "Simulation tools for training robotic behaviors.",
      ),
    ],
  }),
  company({
    name: "Covariant",
    slug: "covariant",
    description:
      "Builds AI systems that help robots perceive and manipulate the physical world.",
    website: "https://covariant.ai",
    city: "Berkeley",
    country: "US",
    foundedYear: 2017,
    status: "GROWTH",
    popularityScore: 68,
    featured: false,
    capabilities: ["Robotics", "Computer Vision", "Warehouse Automation"],
    categories: ["robotics", "enterprise"],
    products: [
      product(
        "Covariant Brain",
        "Robotics Platform",
        "A foundation model for warehouse robot tasks.",
      ),
      product(
        "Robotic Picking",
        "Warehouse Automation",
        "Vision-guided systems for fulfillment operations.",
      ),
    ],
  }),
  company({
    name: "Agility Robotics",
    slug: "agility-robotics",
    description:
      "Designs mobile robots for logistics and human-centered workplaces.",
    website: "https://agilityrobotics.com",
    city: "Corvallis",
    country: "US",
    foundedYear: 2015,
    status: "GROWTH",
    popularityScore: 67,
    featured: false,
    capabilities: ["Humanoid Robotics", "Warehouse Automation", "Embodied AI"],
    categories: ["robotics", "enterprise"],
    products: [
      product(
        "Digit",
        "Humanoid Robotics",
        "A bipedal robot for logistics and industrial tasks.",
      ),
      product(
        "RoboFab",
        "Robotics Manufacturing",
        "A facility for scaling humanoid robot production.",
      ),
    ],
  }),
  company({
    name: "Nuro",
    slug: "nuro",
    description:
      "Develops autonomous vehicles and delivery systems for local commerce.",
    website: "https://nuro.ai",
    city: "Mountain View",
    country: "US",
    foundedYear: 2016,
    status: "GROWTH",
    popularityScore: 69,
    featured: false,
    capabilities: ["Autonomous Vehicles", "Robotics", "Computer Vision"],
    categories: ["robotics", "enterprise"],
    products: [
      product(
        "Nuro Driver",
        "Autonomous Driving",
        "An autonomy stack for low-speed delivery vehicles.",
      ),
      product(
        "Nuro R3",
        "Delivery Robotics",
        "A purpose-built autonomous delivery vehicle.",
      ),
    ],
  }),
  company({
    name: "Physical Intelligence",
    slug: "physical-intelligence",
    description:
      "Researches general-purpose foundation models for physical tasks.",
    website: "https://physicalintelligence.company",
    city: "San Francisco",
    country: "US",
    foundedYear: 2024,
    status: "STARTUP",
    popularityScore: 73,
    featured: false,
    capabilities: ["Embodied AI", "Robotics", "AI Research"],
    categories: ["robotics", "ai-lab"],
    products: [
      product(
        "π0",
        "Embodied AI",
        "A general-purpose vision-language-action model for robots.",
      ),
      product(
        "Physical Intelligence Platform",
        "Robotics Platform",
        "Research infrastructure for learning physical skills.",
      ),
    ],
  }),
];

export function getAiCountryLabel(country: string) {
  return (
    AI_COUNTRY_OPTIONS.find((option) => option.code === country)?.label ??
    country
  );
}

export function getAiStatusLabel(status: AiCompanyStatus) {
  return (
    AI_COMPANY_STATUSES.find((option) => option.value === status)?.label ??
    status
  );
}

export function getAiCategoryLabel(slug: string) {
  return (
    AI_COMPANY_CATEGORIES.find((category) => category.slug === slug)?.name ??
    slug
  );
}
