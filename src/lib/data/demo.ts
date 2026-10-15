/**
 * DEMONSTRATION CONTENT ONLY.
 *
 * Every record here is fictional and flagged with isDemo: true so the UI can
 * label it. None of these people, projects or publications exist. This source
 * is used only when Supabase is not configured (see src/lib/data/index.ts) and
 * must be replaced by real RIGIS records entered through the portal.
 */
import type {
  Announcement,
  Collaboration,
  PublicProfile,
  Publication,
  ResearchArea,
  ResearchProject,
  SiteContent,
} from "@/types/domain";

const demo = { isDemo: true } as const;

export const demoSiteContent: SiteContent = {
  ...demo,
  introduction:
    "RIGIS is a research group dedicated to the study and application of intelligent systems. The group brings together academics, researchers and students who share an interest in how computational intelligence can address meaningful problems in science, industry and society.",
  background:
    "This paragraph is placeholder text. Replace it with the founding story of RIGIS: when the group was established, the faculty or department it belongs to, and the research questions that brought its members together.",
  vision:
    "Placeholder vision statement: to be a recognised centre of research excellence in intelligent systems that advances knowledge and delivers responsible, real-world impact.",
  mission:
    "Placeholder mission statement: to conduct rigorous research in intelligent systems, nurture researchers at every career stage, and build collaborations that translate research into practice.",
  objectives: [
    "Conduct high-quality research in intelligent systems and related fields.",
    "Develop innovative, evidence-based solutions to real-world problems.",
    "Support postgraduate and early-career researchers through mentoring and supervision.",
    "Build collaborations with academic, industry and community partners.",
    "Disseminate findings through peer-reviewed publications and public engagement.",
  ],
  philosophy:
    "Placeholder research philosophy: RIGIS values methodological rigour, openness, interdisciplinary collaboration and the responsible use of intelligent technologies. Replace this text with the group's own statement.",
  affiliation: "Institutional affiliation to be confirmed",
  contactEmail: null,
  contactPhone: null,
  address: null,
};

export const demoAreas: ResearchArea[] = [
  {
    ...demo,
    id: "area-ml",
    slug: "machine-learning",
    name: "Machine Learning & Data Analytics",
    description:
      "Learning algorithms, predictive modelling and the analysis of complex, real-world datasets.",
  },
  {
    ...demo,
    id: "area-cv",
    slug: "computer-vision",
    name: "Computer Vision & Imaging",
    description:
      "Image understanding, object recognition and visual analysis for scientific and applied settings.",
  },
  {
    ...demo,
    id: "area-nlp",
    slug: "natural-language-processing",
    name: "Natural Language Processing",
    description:
      "Computational methods for understanding, generating and analysing human language.",
  },
  {
    ...demo,
    id: "area-dss",
    slug: "decision-support",
    name: "Intelligent Decision Support",
    description:
      "Optimisation, reasoning and recommender systems that help people make better decisions.",
  },
  {
    ...demo,
    id: "area-iot",
    slug: "iot-embedded-intelligence",
    name: "IoT & Embedded Intelligence",
    description:
      "Sensing, edge computing and intelligent behaviour in connected and embedded devices.",
  },
  {
    ...demo,
    id: "area-rai",
    slug: "responsible-ai",
    name: "Responsible & Explainable AI",
    description:
      "Transparency, fairness, accountability and human-centred evaluation of intelligent systems.",
  },
];

const baseProfile = {
  ...demo,
  photoUrl: null,
  orcid: null,
  googleScholar: null,
  linkedin: null,
  publicEmail: null,
  publicPhone: null,
  office: null,
};

export const demoProfiles: PublicProfile[] = [
  {
    ...baseProfile,
    id: "p-1",
    slug: "demo-group-leader",
    fullName: "Amelia Hartwell",
    professionalTitle: "Assoc. Prof. Dr.",
    position: "Associate Professor",
    role: "GROUP_LEADER",
    biography:
      "Demonstration profile. This text shows how a group leader's biography will appear: a short summary of their research career, leadership roles, supervision record and current research directions.",
    qualifications: [
      { degree: "PhD in Computer Science", institution: "Example University", year: 2012 },
      { degree: "MSc in Artificial Intelligence", institution: "Example University", year: 2007 },
    ],
    researchInterests: ["Machine learning", "Decision support", "Responsible AI"],
    office: "Room to be confirmed",
  },
  {
    ...baseProfile,
    id: "p-2",
    slug: "demo-senior-lecturer",
    fullName: "Daniel Rahman",
    professionalTitle: "Dr.",
    position: "Senior Lecturer",
    role: "LECTURER",
    biography:
      "Demonstration profile. A senior lecturer whose work focuses on computer vision and medical image analysis. Replace with a real biography.",
    qualifications: [{ degree: "PhD in Electrical Engineering", institution: "Example University", year: 2015 }],
    researchInterests: ["Computer vision", "Medical imaging", "Deep learning"],
  },
  {
    ...baseProfile,
    id: "p-3",
    slug: "demo-lecturer-nlp",
    fullName: "Sofia Lim",
    professionalTitle: "Dr.",
    position: "Lecturer",
    role: "LECTURER",
    biography:
      "Demonstration profile. A lecturer researching natural language processing for low-resource languages. Replace with a real biography.",
    qualifications: [{ degree: "PhD in Computational Linguistics", institution: "Example University", year: 2018 }],
    researchInterests: ["Natural language processing", "Low-resource languages", "Information retrieval"],
  },
  {
    ...baseProfile,
    id: "p-4",
    slug: "demo-lecturer-iot",
    fullName: "Haziq Ismail",
    professionalTitle: "Ts. Dr.",
    position: "Senior Lecturer",
    role: "LECTURER",
    biography:
      "Demonstration profile. A senior lecturer working on embedded intelligence and IoT systems. Replace with a real biography.",
    qualifications: [{ degree: "PhD in Computer Engineering", institution: "Example University", year: 2016 }],
    researchInterests: ["Internet of Things", "Edge computing", "Embedded systems"],
  },
  {
    ...baseProfile,
    id: "p-5",
    slug: "demo-researcher",
    fullName: "Priya Nair",
    professionalTitle: "Dr.",
    position: "Postdoctoral Researcher",
    role: "RESEARCHER",
    biography:
      "Demonstration profile. A postdoctoral researcher working on explainable machine learning. Replace with a real biography.",
    qualifications: [{ degree: "PhD in Data Science", institution: "Example University", year: 2022 }],
    researchInterests: ["Explainable AI", "Machine learning", "Fairness"],
  },
  {
    ...baseProfile,
    id: "p-6",
    slug: "demo-research-officer",
    fullName: "Marcus Tan",
    professionalTitle: null,
    position: "Research Officer",
    role: "RESEARCHER",
    biography:
      "Demonstration profile. A research officer supporting data collection and system development across group projects.",
    qualifications: [{ degree: "MSc in Computer Science", institution: "Example University", year: 2021 }],
    researchInterests: ["Data engineering", "Computer vision"],
  },
  {
    ...baseProfile,
    id: "p-7",
    slug: "demo-phd-student",
    fullName: "Nur Aisyah Kamal",
    professionalTitle: null,
    position: "PhD Candidate",
    role: "STUDENT",
    biography:
      "Demonstration profile. A doctoral candidate investigating language models for educational feedback.",
    qualifications: [{ degree: "MSc in Information Technology", institution: "Example University", year: 2023 }],
    researchInterests: ["Natural language processing", "Educational technology"],
  },
  {
    ...baseProfile,
    id: "p-8",
    slug: "demo-masters-student",
    fullName: "Ethan Wong",
    professionalTitle: null,
    position: "MSc Student",
    role: "STUDENT",
    biography:
      "Demonstration profile. A master's student working on sensor-based activity recognition.",
    qualifications: [{ degree: "BSc in Computer Science", institution: "Example University", year: 2024 }],
    researchInterests: ["Internet of Things", "Machine learning"],
  },
];

export const demoPublications: Publication[] = [
  {
    ...demo,
    id: "pub-1",
    title: "Demonstration publication: an interpretable framework for clinical decision support",
    venue: "Placeholder journal name",
    year: 2025,
    publicationType: "journal",
    doi: null,
    url: null,
    authors: [
      { profileId: "p-1", displayName: "A. Hartwell" },
      { profileId: "p-5", displayName: "P. Nair" },
    ],
  },
  {
    ...demo,
    id: "pub-2",
    title: "Demonstration publication: lightweight segmentation models for medical images",
    venue: "Placeholder conference proceedings",
    year: 2024,
    publicationType: "conference",
    doi: null,
    url: null,
    authors: [
      { profileId: "p-2", displayName: "D. Rahman" },
      { profileId: "p-6", displayName: "M. Tan" },
    ],
  },
  {
    ...demo,
    id: "pub-3",
    title: "Demonstration publication: a corpus study of low-resource language feedback",
    venue: "Placeholder workshop",
    year: 2025,
    publicationType: "conference",
    doi: null,
    url: null,
    authors: [
      { profileId: "p-3", displayName: "S. Lim" },
      { profileId: "p-7", displayName: "N. A. Kamal" },
    ],
  },
];

const baseProject = {
  ...demo,
  coverUrl: null,
  documents: [],
  publicationIds: [] as string[],
  approvedAt: "2025-01-01T00:00:00Z",
};

export const demoProjects: ResearchProject[] = [
  {
    ...baseProject,
    id: "r-1",
    slug: "demo-explainable-decision-support",
    title: "Explainable Decision Support for Clinical Triage",
    abstract:
      "Demonstration project. Investigates how interpretable machine learning models can support, rather than replace, clinicians' triage decisions.",
    description:
      "This is placeholder text describing a demonstration project. A real project page will describe the research problem, its context and significance, and the approach taken by the team.",
    objectives: [
      "Identify the information clinicians need to trust model recommendations.",
      "Develop interpretable models with competitive predictive performance.",
      "Evaluate the decision-support tool with practitioners.",
    ],
    methodology:
      "Placeholder methodology: mixed-methods design combining retrospective data modelling with user studies.",
    outcomes: "Placeholder outcomes: to be reported on completion.",
    status: "ongoing",
    featured: true,
    startYear: 2024,
    endYear: null,
    principalInvestigatorId: "p-1",
    members: [
      { profileId: "p-1", projectRole: "Principal investigator" },
      { profileId: "p-5", projectRole: "Postdoctoral researcher" },
      { profileId: "p-2", projectRole: "Co-investigator" },
    ],
    areaIds: ["area-ml", "area-dss", "area-rai"],
    publicationIds: ["pub-1"],
  },
  {
    ...baseProject,
    id: "r-2",
    slug: "demo-medical-image-segmentation",
    title: "Lightweight Segmentation for Medical Imaging",
    abstract:
      "Demonstration project. Develops compact image segmentation models suitable for deployment on modest hardware.",
    description:
      "Placeholder description of a demonstration computer vision project focusing on efficient models for medical images.",
    objectives: [
      "Design compact segmentation architectures.",
      "Benchmark accuracy against computational cost.",
    ],
    methodology: "Placeholder methodology: model design, ablation studies and benchmark evaluation.",
    outcomes: "Placeholder outcomes: prototype models and an evaluation report.",
    status: "completed",
    featured: true,
    startYear: 2022,
    endYear: 2024,
    principalInvestigatorId: "p-2",
    members: [
      { profileId: "p-2", projectRole: "Principal investigator" },
      { profileId: "p-6", projectRole: "Research officer" },
    ],
    areaIds: ["area-cv", "area-ml"],
    publicationIds: ["pub-2"],
  },
  {
    ...baseProject,
    id: "r-3",
    slug: "demo-low-resource-nlp",
    title: "Automated Feedback for Low-Resource Language Learners",
    abstract:
      "Demonstration project. Explores language technologies that give learners useful feedback in languages with limited digital resources.",
    description: "Placeholder description of a demonstration natural language processing project.",
    objectives: [
      "Assemble an annotated learner corpus.",
      "Evaluate feedback generation approaches with teachers.",
    ],
    methodology: "Placeholder methodology: corpus construction, model fine-tuning and classroom evaluation.",
    outcomes: null,
    status: "ongoing",
    featured: true,
    startYear: 2025,
    endYear: null,
    principalInvestigatorId: "p-3",
    members: [
      { profileId: "p-3", projectRole: "Principal investigator" },
      { profileId: "p-7", projectRole: "PhD researcher" },
    ],
    areaIds: ["area-nlp", "area-rai"],
    publicationIds: ["pub-3"],
  },
  {
    ...baseProject,
    id: "r-4",
    slug: "demo-edge-activity-recognition",
    title: "Edge-Based Human Activity Recognition",
    abstract:
      "Demonstration project. Studies on-device activity recognition from wearable and ambient sensors.",
    description: "Placeholder description of a demonstration IoT and embedded intelligence project.",
    objectives: ["Collect a multi-sensor dataset.", "Deploy recognition models on microcontrollers."],
    methodology: "Placeholder methodology: sensor deployment, dataset collection and on-device benchmarking.",
    outcomes: null,
    status: "ongoing",
    featured: false,
    startYear: 2025,
    endYear: null,
    principalInvestigatorId: "p-4",
    members: [
      { profileId: "p-4", projectRole: "Principal investigator" },
      { profileId: "p-8", projectRole: "MSc researcher" },
    ],
    areaIds: ["area-iot", "area-ml"],
  },
  {
    ...baseProject,
    id: "r-5",
    slug: "demo-fairness-audit-toolkit",
    title: "A Practical Fairness Audit Toolkit",
    abstract:
      "Demonstration project. Proposes a lightweight toolkit for auditing predictive models for unfair outcomes.",
    description: "Placeholder description of a proposed responsible AI project.",
    objectives: ["Review existing fairness metrics.", "Prototype an audit workflow for practitioners."],
    methodology: null,
    outcomes: null,
    status: "proposed",
    featured: false,
    startYear: 2026,
    endYear: null,
    principalInvestigatorId: "p-5",
    members: [
      { profileId: "p-5", projectRole: "Principal investigator" },
      { profileId: "p-1", projectRole: "Advisor" },
    ],
    areaIds: ["area-rai", "area-ml"],
  },
];

export const demoAnnouncements: Announcement[] = [
  {
    ...demo,
    id: "a-1",
    title: "Demonstration announcement: website launch",
    summary:
      "Placeholder announcement. Group leaders can publish news, seminars and calls for collaboration from the management portal.",
    body: null,
    publishedAt: "2026-10-01T00:00:00Z",
  },
  {
    ...demo,
    id: "a-2",
    title: "Demonstration announcement: research seminar series",
    summary: "Placeholder announcement showing how an upcoming seminar would be listed.",
    body: null,
    publishedAt: "2026-09-15T00:00:00Z",
  },
  {
    ...demo,
    id: "a-3",
    title: "Demonstration announcement: postgraduate opportunities",
    summary: "Placeholder announcement showing how a call for postgraduate applicants would appear.",
    body: null,
    publishedAt: "2026-08-20T00:00:00Z",
  },
];

export const demoCollaborations: Collaboration[] = [];
