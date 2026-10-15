/**
 * RIGIS research areas.
 *
 * Status "provisional": the area names were supplied as the group's current
 * focus areas but their descriptions are draft text awaiting confirmation.
 *
 * interestKeywords connect researchers to an area only when one of the
 * researcher's own listed interests contains the keyword. Keep them specific:
 * a broad term such as "artificial intelligence" would link everyone to
 * everything and say nothing.
 */
import type { ResearchArea } from "@/types/domain";

const provisional = { status: "provisional", isDemo: false } as const;

export const researchAreas: ResearchArea[] = [
  {
    ...provisional,
    id: "area-ml",
    slug: "machine-learning",
    name: "Machine Learning & Data Analytics",
    shortName: "Machine Learning",
    accent: "#B89B68",
    description:
      "Learning algorithms, predictive modelling, data mining and the analysis of complex, real-world datasets.",
    interestKeywords: ["machine learning", "data analytics", "data mining", "anomaly detection", "predictive"],
  },
  {
    ...provisional,
    id: "area-cv",
    slug: "computer-vision",
    name: "Computer Vision & Imaging",
    shortName: "Computer Vision",
    accent: "#6A93B8",
    description:
      "Image understanding, object detection and visual analysis for scientific and applied settings.",
    interestKeywords: ["computer vision", "image processing", "imaging", "object detection"],
  },
  {
    ...provisional,
    id: "area-nlp",
    slug: "natural-language-processing",
    name: "Natural Language Processing",
    shortName: "Language Processing",
    accent: "#8B76A5",
    description:
      "Computational methods for understanding, generating and analysing human language, including sentiment analysis and large language models.",
    interestKeywords: ["natural language", "nlp", "text mining", "sentiment", "language model"],
  },
  {
    ...provisional,
    id: "area-dss",
    slug: "decision-support",
    name: "Intelligent Decision Support",
    shortName: "Decision Support",
    accent: "#6F9C86",
    description:
      "Optimisation, reasoning and recommender systems that help people make better decisions.",
    interestKeywords: ["decision support", "recommender", "optimisation", "optimization"],
  },
  {
    ...provisional,
    id: "area-iot",
    slug: "iot-embedded-intelligence",
    name: "IoT & Embedded Intelligence",
    shortName: "IoT & Embedded",
    accent: "#C2825F",
    description:
      "Sensing, edge computing and intelligent behaviour in connected and embedded devices.",
    interestKeywords: ["internet of things", "iot", "edge computing", "embedded"],
  },
  {
    ...provisional,
    id: "area-rai",
    slug: "responsible-ai",
    name: "Responsible & Explainable AI",
    shortName: "Responsible AI",
    accent: "#B97893",
    description:
      "Transparency, fairness, accountability and human-centred evaluation of intelligent systems.",
    interestKeywords: ["explainable", "responsible ai", "fairness", "ai ethics"],
  },
];
