/**
 * REAL RIGIS RECORDS (pre-Supabase).
 *
 * Entered by hand until members can manage their own profiles in the portal
 * (Phase 2), at which point these move into the database. Publication details
 * were taken from the member's public Google Scholar profile and must be
 * confirmed by the member before launch.
 */
import type { PublicProfile, Publication } from "@/types/domain";

const SHUZLINA = "p-shuzlina-abdul-rahman";

export const memberProfiles: PublicProfile[] = [
  {
    id: SHUZLINA,
    slug: "shuzlina-abdul-rahman",
    fullName: "Shuzlina Abdul Rahman",
    professionalTitle: "Assoc. Prof. Dr.",
    position: "Associate Professor",
    role: "LECTURER",
    photoUrl: null,
    biography:
      "Shuzlina Abdul Rahman is an Associate Professor at Universiti Teknologi MARA. Her research spans artificial intelligence, data analytics, data mining and machine learning.\n\nHer recent work includes sentiment analysis of code-mixed and review text, deep-learning object detection for solid-waste management, fairness-aware prediction models, and hallucination mitigation in multilingual large language models.",
    qualifications: [],
    researchInterests: ["Artificial intelligence", "Data analytics", "Data mining", "Machine learning"],
    orcid: null,
    googleScholar: "https://scholar.google.com/citations?hl=en&user=mfqcNGsAAAAJ",
    linkedin: null,
    publicEmail: null,
    publicPhone: null,
    office: null,
    isDemo: false,
  },
];

const me = (displayName = "S. Abdul-Rahman") => ({ profileId: SHUZLINA, displayName });
const ext = (displayName: string) => ({ profileId: null, displayName });

/** Ten most recent publications, newest first (Google Scholar, October 2026). */
export const memberPublications: Publication[] = [
  {
    id: "pub-sar-2026-manglish",
    title: "Manglish Code-Mixed Sentiment Analysis Using BERT-Base Algorithm",
    venue: "2026 7th International Conference on Artificial Intelligence and Data Sciences (AiDAS), IEEE, pp. 512–517",
    year: 2026,
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11712659/",
    authors: [ext("N. A. Hamidun"), ext("N. Mohd Sabri"), ext("N. M. Nik Daud"), me()],
    isDemo: false,
  },
  {
    id: "pub-sar-2026-anomaly",
    title: "Hybrid Machine Learning Algorithms for Network Anomaly Detection: A Soft Voting Ensemble Approach",
    venue: "2026 7th International Conference on Artificial Intelligence and Data Sciences (AiDAS), IEEE, pp. 165–173",
    year: 2026,
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11712810/",
    authors: [ext("A. N. Othman Kamal"), ext("S. I. Kamarudin"), ext("F. A. Bohani"), me()],
    isDemo: false,
  },
  {
    id: "pub-sar-2026-yolo-waste",
    title: "Scene-guided YOLO framework with contextual feature fusion for solid waste detection in diverse real-world environments",
    venue: "Discover Artificial Intelligence, Springer",
    year: 2026,
    publicationType: "journal",
    doi: "10.1007/s44163-026-01749-4",
    url: null,
    authors: [ext("F. Hu"), ext("S. Mutalib"), me(), ext("S. Gao")],
    isDemo: false,
  },
  {
    id: "pub-sar-2026-llm-hallucination",
    title: "Hallucination Mitigation in Multilingual Large Language Models: A Review of Retrieval-Augmented Generation and Knowledge Graph Approaches",
    venue: "International Conference on Industrial, Engineering and Other Applications of Applied Intelligent Systems, Springer Nature Singapore, pp. 77–88",
    year: 2026,
    publicationType: "conference",
    doi: "10.1007/978-981-92-2885-0_7",
    url: null,
    authors: [
      ext("N. A. B. Iqbal Basheer"),
      ext("S. Nordin"),
      me(),
      ext("A. Mohd Ali"),
      ext("S. Mutalib"),
      ext("S. N. K. Kamarudin"),
    ],
    isDemo: false,
  },
  {
    id: "pub-sar-2026-geometric-transfer",
    title: "Quantifying Geometric Transferability: An Equivariant Diagnostic Framework with Application to Waste Classification",
    venue: "Preprint, Research Square",
    year: 2026,
    publicationType: "other",
    doi: null,
    url: "https://assets-eu.researchsquare.com/files/rs-9179600/v1_covered_3a855dce-5910-4181-9d47-c3cdc39f6eb8.pdf",
    authors: [ext("F. Hu"), ext("S. Mutalib"), me("S. Abdul Rahman"), ext("S. Gao"), ext("Y. Gao")],
    isDemo: false,
  },
  {
    id: "pub-sar-2026-allergen",
    title: "Real-Time Allergen Detection in Packaged Foods Using OCR and NLP on Mobile Platform",
    venue: "2026 International Conference on Cognitive Systems and Computer Interaction (ICoSCI), IEEE, pp. 1–6",
    year: 2026,
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11447524/",
    authors: [ext("N. U. Mohd Badli"), ext("N. Mohd Sabri"), me()],
    isDemo: false,
  },
  {
    id: "pub-sar-2026-hotel-reviews",
    // Title as listed on Google Scholar, which appears truncated — confirm with the author.
    title: "Sentiment Analysis of Hotel Reviews Using Word2Vec Embeddings, TF-IDF and Machine",
    venue: "Smart Computing Paradigms: Proceedings of the Seventh International Conference on Smart Computing and Informatics (SCI 2025), Vol. 4, Springer Nature, p. 346",
    year: 2026,
    publicationType: "conference",
    doi: null,
    url: null,
    authors: [ext("S. N. Ot Abdul Satar"), me(), ext("N. N. Yusof")],
    isDemo: false,
  },
  {
    id: "pub-sar-2026-faster-rcnn",
    title: "Edge-oriented lightweight attention-enhanced Faster R-CNN: A systematic study of innovative methods for garbage object detection",
    venue: "International Journal of Systematic Innovation",
    year: 2026,
    publicationType: "journal",
    doi: null,
    url: "https://article.accscience.com/journal/IJOSI/online_first/ijosi_202607_10(4)_026150050/article_ijosi_202607_10(4)_0261500501_cae512.pdf",
    authors: [ext("F. Hu"), ext("S. Mutalib"), me(), ext("Y. Gao")],
    isDemo: false,
  },
  {
    id: "pub-sar-2026-fair-diabetes",
    title: "FAIR-Diabetes: A Hybrid Fairness-Aware Framework for Diabetes Prediction",
    venue: "Proceedings of the 2nd International Conference on Multi-Agent Systems for Collaborative Intelligence (ICMSCI 2026), IEEE",
    year: 2026,
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11469737/",
    authors: [ext("M. D. H. Mohd Hamdan"), ext("M. F. Ab Jabal"), me()],
    isDemo: false,
  },
  {
    id: "pub-sar-2026-pineapple",
    title: "Deep Learning-Based Classification of Malaysian Pineapple Ripeness Index Using Fine-Tuned VGG16",
    venue: "International Journal on Advanced Science, Engineering and Information Technology 16 (3), pp. 818–823",
    year: 2026,
    publicationType: "journal",
    doi: null,
    url: null,
    authors: [
      ext("M. Abdul Aziz"),
      ext("I. N. Moh Nasir"),
      ext("N. A. Mustakim"),
      me(),
      ext("J. H. Abawajy"),
    ],
    isDemo: false,
  },
];
