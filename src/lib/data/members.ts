/**
 * REAL RIGIS RECORDS (pre-Supabase).
 *
 * Entered by hand until members can manage their own profiles in the portal
 * (Phase 2), at which point these move into the database. Profile facts and
 * publication details come from each member's public Google Scholar profile
 * (October 2026); the publications were confirmed by the group for
 * publication. Photographs were supplied by the group. Biographies are drafts
 * written from the Scholar profiles and should be replaced by the members.
 *
 * Publications are stored once and linked to every RIGIS author, so papers
 * co-written by several members appear on each of their profiles.
 */
import type { PublicProfile, Publication, PublicationAuthor } from "@/types/domain";

const SHUZLINA = "p-shuzlina-abdul-rahman";
const AZLIZA = "p-azliza-mohd-ali";
const SHARIFALILLAH = "p-sharifalillah-nordin";
const SOFIANITA = "p-sofianita-mutalib";

const empty: Pick<
  PublicProfile,
  "photoUrl" | "qualifications" | "orcid" | "linkedin" | "publicEmail" | "publicPhone" | "office" | "isDemo"
> = {
  photoUrl: null,
  qualifications: [],
  orcid: null,
  linkedin: null,
  publicEmail: null,
  publicPhone: null,
  office: null,
  isDemo: false,
};

export const memberProfiles: PublicProfile[] = [
  {
    ...empty,
    id: SHUZLINA,
    slug: "shuzlina-abdul-rahman",
    photoUrl: "/images/people/shuzlina-abdul-rahman.webp",
    fullName: "Shuzlina Abdul Rahman",
    professionalTitle: "Assoc. Prof. Dr.",
    position: "Associate Professor",
    role: "LECTURER",
    biography:
      "Shuzlina Abdul Rahman is an Associate Professor at Universiti Teknologi MARA. Her research spans artificial intelligence, data analytics, data mining and machine learning.\n\nHer recent work includes sentiment analysis of code-mixed and review text, deep-learning object detection for solid-waste management, fairness-aware prediction models, and hallucination mitigation in multilingual large language models.",
    researchInterests: ["Artificial intelligence", "Data analytics", "Data mining", "Machine learning"],
    googleScholar: "https://scholar.google.com/citations?hl=en&user=mfqcNGsAAAAJ",
  },
  {
    ...empty,
    id: SOFIANITA,
    slug: "sofianita-mutalib",
    photoUrl: "/images/people/sofianita-mutalib.webp",
    fullName: "Sofianita Mutalib",
    professionalTitle: "Assoc. Prof.",
    position: "Associate Professor",
    role: "LECTURER",
    biography:
      "Sofianita Mutalib is an Associate Professor at Universiti Teknologi MARA. Her research focuses on data mining, machine learning and data analytics.\n\nHer recent work includes YOLO-based object detection for solid waste and industrial defects, text classification of news and scientific papers, and machine-learning approaches to disease identification.",
    researchInterests: ["Data mining", "Machine learning", "Data analytics"],
    googleScholar: "https://scholar.google.com/citations?hl=en&user=X-2H78MAAAAJ",
  },
  {
    ...empty,
    id: SHARIFALILLAH,
    slug: "sharifalillah-nordin",
    photoUrl: "/images/people/sharifalillah-nordin.webp",
    fullName: "Sharifalillah Nordin",
    professionalTitle: "Dr.",
    position: "Senior Lecturer",
    role: "LECTURER",
    biography:
      "Sharifalillah Nordin is a Senior Lecturer in Computer Science at Universiti Teknologi MARA. Her research interests are artificial intelligence, machine learning, knowledge management and biodiversity informatics.\n\nHer recent work includes cross-domain sentiment analysis, anomaly and outlier detection, clinical text models for diagnosis coding, and applications of large language models in education and finance.",
    researchInterests: ["Artificial intelligence", "Machine learning", "Knowledge management", "Biodiversity informatics"],
    googleScholar: "https://scholar.google.com/citations?hl=en&user=JgwC0C0AAAAJ",
  },
  {
    ...empty,
    id: AZLIZA,
    slug: "azliza-mohd-ali",
    photoUrl: "/images/people/azliza-mohd-ali.webp",
    fullName: "Azliza Mohd Ali",
    professionalTitle: "Dr.",
    position: "Senior Lecturer",
    role: "LECTURER",
    biography:
      "Azliza Mohd Ali is a Senior Lecturer at Universiti Teknologi MARA. Her research interests are intelligent systems and anomaly detection.\n\nHer recent work includes adaptive outlier-detection algorithms, anomaly detection in medical images, and natural language applications of large language models for low-resource Malay and religious texts.",
    researchInterests: ["Intelligent systems", "Anomaly detection"],
    googleScholar: "https://scholar.google.com/citations?hl=en&user=L52PakYAAAAJ",
  },
];

const ext = (displayName: string): PublicationAuthor => ({ profileId: null, displayName });
const shuzlina = (n = "S. Abdul-Rahman"): PublicationAuthor => ({ profileId: SHUZLINA, displayName: n });
const sofianita = (n = "S. Mutalib"): PublicationAuthor => ({ profileId: SOFIANITA, displayName: n });
const sharifalillah = (n = "S. Nordin"): PublicationAuthor => ({ profileId: SHARIFALILLAH, displayName: n });
const azliza = (n = "A. Mohd Ali"): PublicationAuthor => ({ profileId: AZLIZA, displayName: n });

const AIDAS_2026 = "2026 7th International Conference on Artificial Intelligence and Data Sciences (AiDAS), IEEE";
const AIDAS_2025 = "2025 6th International Conference on Artificial Intelligence and Data Sciences (AiDAS), IEEE";
const SCI_SPRINGER = "International Conference on Smart Computing and Informatics, Springer Nature Switzerland";
const IJRISS = "International Journal of Research and Innovation in Social Science";

type Pub = Omit<Publication, "isDemo">;
const pub = (p: Pub): Publication => ({ ...p, isDemo: false });

/**
 * Ten most recent publications per member (Google Scholar, sorted by date,
 * October 2026), de-duplicated across members.
 */
export const memberPublications: Publication[] = [
  // ── Shared between several RIGIS members ─────────────────────────────
  pub({
    id: "pub-2026-yolo-solid-waste",
    title: "Scene-guided YOLO framework with contextual feature fusion for solid waste detection in diverse real-world environments",
    venue: "Discover Artificial Intelligence, Springer",
    year: 2026,
    publishedOn: "2026-08-10",
    publicationType: "journal",
    doi: "10.1007/s44163-026-01749-4",
    url: null,
    authors: [ext("F. Hu"), sofianita(), shuzlina(), ext("S. Gao")],
  }),
  pub({
    id: "pub-2026-llm-hallucination",
    title: "Hallucination Mitigation in Multilingual Large Language Models: A Review of Retrieval-Augmented Generation and Knowledge Graph Approaches",
    venue: "International Conference on Industrial, Engineering and Other Applications of Applied Intelligent Systems, Springer Nature Singapore, pp. 77–88",
    year: 2026,
    publishedOn: "2026-06-06",
    publicationType: "conference",
    doi: "10.1007/978-981-92-2885-0_7",
    url: null,
    authors: [ext("N. A. B. Iqbal Basheer"), sharifalillah(), shuzlina(), azliza(), sofianita(), ext("S. N. K. Kamarudin")],
  }),
  pub({
    id: "pub-2026-adaptive-lof",
    title: "Adaptive local outlier factor",
    venue: "Evolving Systems 17 (2), 44, Springer",
    year: 2026,
    publishedOn: "2026-06-01",
    publicationType: "journal",
    doi: "10.1007/s12530-026-09808-y",
    url: null,
    authors: [ext("M. Y. Iqbal Basheer"), azliza(), ext("N. H. Abdul Hamid"), sharifalillah(), ext("R. Osman"), ext("N. Yusoff"), ext("X. Gu")],
  }),
  pub({
    id: "pub-2026-faster-rcnn-garbage",
    title: "Edge-oriented lightweight attention-enhanced Faster R-CNN: A systematic study of innovative methods for garbage object detection",
    venue: "International Journal of Systematic Innovation",
    year: 2026,
    publishedOn: "2026-07-20",
    publicationType: "journal",
    doi: null,
    url: "https://article.accscience.com/journal/IJOSI/online_first/ijosi_202607_10(4)_026150050/article_ijosi_202607_10(4)_0261500501_cae512.pdf",
    authors: [ext("F. Hu"), sofianita(), shuzlina(), ext("Y. Gao")],
  }),
  pub({
    id: "pub-2026-edumate-ai",
    title: "Edumate. AI: A Generative AI Tutor to Improve Programming Skills Using Large Language Model (LLM)",
    venue: `${IJRISS} 10 (26), pp. 2073–2085`,
    year: 2026,
    publishedOn: null,
    publicationType: "journal",
    doi: null,
    url: "https://ideas.repec.org/a/bjf/ijriss/v10y2026i26p2073-2085.html",
    authors: [ext("N. S. A. Zairosezary"), sharifalillah(), ext("R. Osman"), azliza()],
  }),
  pub({
    id: "pub-2025-chest-xray-anomaly",
    title: "Chest X-ray Anomaly Detection Using Convolutional AutoEncoder Combined With Generate Adversarial Network (GAN)",
    venue: "2025 IEEE International Conference on Computing (ICOCO), pp. 303–307",
    year: 2025,
    publishedOn: "2025-10-06",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11334117/",
    authors: [ext("T. Yanli"), azliza(), ext("L. Quoqin"), sharifalillah()],
  }),
  pub({
    id: "pub-2025-arloff",
    title: "Autonomous Recursive Local Outlier Factor (ARLOFF)",
    venue: `${AIDAS_2025}, pp. 301–305`,
    year: 2025,
    publishedOn: "2025-09-02",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11213522/",
    authors: [ext("M. Y. Iqbal Basheer"), azliza(), sharifalillah(), ext("N. H. Abdul Hamid")],
  }),
  pub({
    id: "pub-2025-cybercrime-news",
    title: "Analyzing Cybercrime News Articles Using Supervised Text Classification",
    venue: `${AIDAS_2025}, pp. 153–158`,
    year: 2025,
    publishedOn: "2025-09-02",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11212863/",
    authors: [sofianita(), ext("N. M. F. Nor Muhamad Nizam"), ext("M. Y. Darus"), ext("H. Mokayed"), ext("Y. Mahmud"), shuzlina()],
  }),
  pub({
    id: "pub-2025-biodegradable-yolov9",
    title: "Biodegradable Waste Classification for Children Using YOLOv9",
    venue: `${AIDAS_2025}, pp. 397–402`,
    year: 2025,
    publishedOn: "2025-09-02",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11213735/",
    authors: [ext("P. N. Z. Noor Ridzuan"), shuzlina(), ext("N. Mohd Sabri"), sofianita()],
  }),
  pub({
    id: "pub-2025-face-mask",
    title: "Deep Convolutional Neural Networks for Face Mask Detection during COVID-19 Pandemic",
    venue: "Intelligent Systems of Computing and Informatics in Sustainable Urban Development, CRC Press, pp. 25–42",
    year: 2025,
    publishedOn: "2025-07-16",
    publicationType: "book-chapter",
    doi: null,
    url: null,
    authors: [ext("S. N. K. Kamarudin"), ext("H. I. Zainal Abidin"), ext("M. Hanafiah"), shuzlina(), sofianita()],
  }),

  // ── Shuzlina Abdul Rahman ────────────────────────────────────────────
  pub({
    id: "pub-2026-manglish-bert",
    title: "Manglish Code-Mixed Sentiment Analysis Using BERT-Base Algorithm",
    venue: `${AIDAS_2026}, pp. 512–517`,
    year: 2026,
    publishedOn: "2026-09-02",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11712659/",
    authors: [ext("N. A. Hamidun"), ext("N. Mohd Sabri"), ext("N. M. Nik Daud"), shuzlina()],
  }),
  pub({
    id: "pub-2026-network-anomaly-ensemble",
    title: "Hybrid Machine Learning Algorithms for Network Anomaly Detection: A Soft Voting Ensemble Approach",
    venue: `${AIDAS_2026}, pp. 165–173`,
    year: 2026,
    publishedOn: "2026-09-02",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11712810/",
    authors: [ext("A. N. Othman Kamal"), ext("S. I. Kamarudin"), ext("F. A. Bohani"), shuzlina()],
  }),
  pub({
    id: "pub-2026-geometric-transferability",
    title: "Quantifying Geometric Transferability: An Equivariant Diagnostic Framework with Application to Waste Classification",
    venue: "Preprint, Research Square",
    year: 2026,
    publishedOn: "2026-03-31",
    publicationType: "other",
    doi: null,
    url: "https://assets-eu.researchsquare.com/files/rs-9179600/v1_covered_3a855dce-5910-4181-9d47-c3cdc39f6eb8.pdf",
    authors: [ext("F. Hu"), sofianita(), shuzlina("S. Abdul Rahman"), ext("S. Gao"), ext("Y. Gao")],
  }),
  pub({
    id: "pub-2026-allergen-ocr",
    title: "Real-Time Allergen Detection in Packaged Foods Using OCR and NLP on Mobile Platform",
    venue: "2026 International Conference on Cognitive Systems and Computer Interaction (ICoSCI), IEEE, pp. 1–6",
    year: 2026,
    publishedOn: "2026-01-15",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11447524/",
    authors: [ext("N. U. Mohd Badli"), ext("N. Mohd Sabri"), shuzlina()],
  }),
  pub({
    id: "pub-2026-hotel-reviews",
    title: "Sentiment Analysis of Hotel Reviews Using Word2Vec Embeddings, TF-IDF and Machine",
    venue: "Smart Computing Paradigms: Proceedings of the Seventh International Conference on Smart Computing and Informatics (SCI 2025), Vol. 4, Springer Nature, p. 346",
    year: 2026,
    publishedOn: "2026-01-02",
    publicationType: "conference",
    doi: null,
    url: null,
    authors: [ext("S. N. Ot Abdul Satar"), shuzlina(), ext("N. N. Yusof")],
  }),
  pub({
    id: "pub-2026-fair-diabetes",
    title: "FAIR-Diabetes: A Hybrid Fairness-Aware Framework for Diabetes Prediction",
    venue: "Proceedings of the 2nd International Conference on Multi-Agent Systems for Collaborative Intelligence (ICMSCI 2026), IEEE",
    year: 2026,
    publishedOn: null,
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11469737/",
    authors: [ext("M. D. H. Mohd Hamdan"), ext("M. F. Ab Jabal"), shuzlina()],
  }),
  pub({
    id: "pub-2026-pineapple-vgg16",
    title: "Deep Learning-Based Classification of Malaysian Pineapple Ripeness Index Using Fine-Tuned VGG16",
    venue: "International Journal on Advanced Science, Engineering and Information Technology 16 (3), pp. 818–823",
    year: 2026,
    publishedOn: null,
    publicationType: "journal",
    doi: null,
    url: null,
    authors: [ext("M. Abdul Aziz"), ext("I. N. Moh Nasir"), ext("N. A. Mustakim"), shuzlina(), ext("J. H. Abawajy")],
  }),

  // ── Sofianita Mutalib ────────────────────────────────────────────────
  pub({
    id: "pub-2026-yolo-bp-welding",
    title: "YOLO-BP for detection of multi-scale and high intra-class variation electrode cap defects in resistance spot welding",
    venue: "PLOS ONE 21 (4), e0347336",
    year: 2026,
    publishedOn: "2026-04-20",
    publicationType: "journal",
    doi: "10.1371/journal.pone.0347336",
    url: null,
    authors: [ext("X. Zhao"), ext("S. H. Leong"), ext("B. Y. Lee"), sofianita(), ext("B. Qiu"), ext("M. Lyu"), ext("Z. Zuo")],
  }),
  pub({
    id: "pub-2026-bearing-defects",
    title: "Emulating self-attention with convolution embedded high-resolution shallow layer for detection of tiny bearing defects",
    venue: "Seventeenth International Conference on Graphics and Image Processing (ICGIP 2025), SPIE Vol. 14124, pp. 622–633",
    year: 2026,
    publishedOn: "2026-03-04",
    publicationType: "conference",
    doi: "10.1117/12.3094881",
    url: null,
    authors: [ext("X. Zhao"), ext("S. H. Leong"), ext("B. Y. Lee"), sofianita(), ext("M. Lyu"), ext("Z. Zuo")],
  }),
  pub({
    id: "pub-2026-monkeypox",
    title: "Monkeypox and Chickenpox Identification Using Machine Learning Approach",
    venue: "2026 International Conference on Cognitive Systems and Computer Interaction (ICoSCI), IEEE, pp. 1–6",
    year: 2026,
    publishedOn: "2026-01-15",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11447606/",
    authors: [ext("N. F. A. Mohd Azhar"), ext("S. A. Halim"), sofianita(), ext("R. Ahmad")],
  }),
  pub({
    id: "pub-2025-chinese-papers-bert-gcn",
    title: "Chinese Scientific Paper Classification Based on BERT, Graph Convolutional Networks, and Ensemble Learning",
    venue: "Engineering, Technology & Applied Science Research 15 (6), pp. 29292–29298",
    year: 2025,
    publishedOn: "2025-12-08",
    publicationType: "journal",
    doi: null,
    url: "https://www.etasr.com/index.php/ETASR/article/view/13540",
    authors: [ext("X. Luo"), ext("S. R. Syed Aris"), sofianita()],
  }),

  // ── Sharifalillah Nordin ─────────────────────────────────────────────
  pub({
    id: "pub-2026-indoor-air-quality",
    title: "Human-Centric Predictive Model for Indoor Air Quality and Thermal Comfort",
    venue: `${AIDAS_2026}, pp. 462–467`,
    year: 2026,
    publishedOn: "2026-09-02",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11712880/",
    authors: [ext("N. A. Aziz"), ext("T. R. Razak"), sharifalillah()],
  }),
  pub({
    id: "pub-2026-cross-domain-kd",
    title: "Efficient Cross-Domain Sentiment Analysis via Knowledge Distillation and Maximum Mean Discrepancy Alignment",
    venue: "2026 International Conference on Information Management and Technology (ICIMTech), IEEE, pp. 530–535",
    year: 2026,
    publishedOn: "2026-08-19",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11699061/",
    authors: [ext("U. F. Mohd Bahrin"), sharifalillah(), ext("N. Mohd Sabri")],
  }),
  pub({
    id: "pub-2026-polarity-drift-amazon",
    title: "Polarity Drift and Feature Entanglement in Cross-Domain Sentiment Analysis: Evidence from Amazon Product Reviews Case Study",
    venue: "2026 6th International Conference on Emerging Smart Technologies and Applications (eSmarTA), IEEE, pp. 1–5",
    year: 2026,
    publishedOn: "2026-08-04",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11652061/",
    authors: [ext("U. F. Mohd Bahrin"), sharifalillah(), ext("N. Mohd Sabri")],
  }),
  pub({
    id: "pub-2026-polarity-drift-review",
    title: "A Scoping Review of Polarity Drift in Cross-Domain Sentiment Analysis",
    venue: "2026 18th International Conference on Electronics, Computer, and Computation (ICECCO), IEEE, pp. 1–6",
    year: 2026,
    publishedOn: "2026-04-10",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11488831/",
    authors: [ext("U. F. Mohd Bahrin"), sharifalillah(), ext("N. Mohd Sabri")],
  }),
  pub({
    id: "pub-2026-financial-extraction-llm",
    title: "Automated Financial Data Extraction Using Large Language Models: An Application of OpenAI Apis",
    venue: `${IJRISS} 10 (2), pp. 1589–1598`,
    year: 2026,
    publishedOn: null,
    publicationType: "journal",
    doi: null,
    url: "https://ideas.repec.org/a/bjf/ijriss/v10y2026i2p1589-1598.html",
    authors: [ext("M. M. Chuweni"), sharifalillah(), ext("J. N. Ghazali"), ext("M. N. Sahroni"), ext("M. A. Abdul Malik")],
  }),

  // ── Azliza Mohd Ali ──────────────────────────────────────────────────
  pub({
    id: "pub-2026-hadith-chatbot",
    title: "Learning Hadith through Chatbot Using Large Language Model and Retrieval Augmented Generation",
    venue: `${AIDAS_2026}, pp. 412–416`,
    year: 2026,
    publishedOn: "2026-09-02",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11712567/",
    authors: [ext("A. A. Razali"), azliza(), ext("W. Abdul Latif"), ext("E. A. Kamaru-Zaman"), ext("F. S. Mohamed Rashid"), ext("N. H. Abdul Hamid")],
  }),
  pub({
    id: "pub-2026-malay-code-switch",
    title: "Hybrid Model for Code-Switch and Dialect Translation in Low-Resource Malay Language",
    venue: `${AIDAS_2026}, pp. 251–255`,
    year: 2026,
    publishedOn: "2026-09-02",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11712776/",
    authors: [ext("N. A. I. Noor Azmy"), ext("N. H. Abdul Hamid"), azliza()],
  }),
  pub({
    id: "pub-2026-crop-recommendation",
    title: "Machine Learning-Based Crop Recommendation System Using Soil Analysis Parameters",
    venue: `${AIDAS_2026}, pp. 552–557`,
    year: 2026,
    publishedOn: "2026-09-02",
    publicationType: "conference",
    doi: null,
    url: "https://ieeexplore.ieee.org/abstract/document/11712901/",
    authors: [ext("E. I. Idris"), ext("N. H. Abdul Hamid"), azliza()],
  }),
  pub({
    id: "pub-2026-ea-alm",
    title: "EA-ALM: An Evolutionary Algorithm-Based Adaptive Learner Model for Multi-objective Optimization",
    venue: `${SCI_SPRINGER}, pp. 330–341`,
    year: 2026,
    publishedOn: "2026-01-08",
    publicationType: "conference",
    doi: "10.1007/978-3-032-08240-4_28",
    url: null,
    authors: [ext("T. Yong"), azliza(), ext("S. A. Halim")],
  }),
  pub({
    id: "pub-2026-aqi-outlier",
    title: "Hybrid Feature Extraction and Outlier Detection for Image-Based Air Quality Index (AQI) Classification",
    venue: `${SCI_SPRINGER}, pp. 323–334`,
    year: 2026,
    publishedOn: "2026-01-07",
    publicationType: "conference",
    doi: "10.1007/978-3-032-08243-5_29",
    url: null,
    authors: [ext("U. N. Ahmad Razimi"), azliza(), ext("R. Osman")],
  }),
  pub({
    id: "pub-2026-medbioclinicalbert",
    title: "MedBioClinicalBERT: Leveraging Diagnosis Prediction for ICD Mapping",
    venue: `${SCI_SPRINGER}, pp. 284–294`,
    year: 2026,
    publishedOn: "2026-01-03",
    publicationType: "conference",
    doi: "10.1007/978-3-032-08253-4_25",
    url: null,
    authors: [ext("N. A. B. Iqbal Basheer"), sharifalillah(), ext("S. S. Kasim"), azliza(), ext("N. H. Abdul Hamid")],
  }),
];
