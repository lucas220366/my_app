export interface User {
  id: string;
  email: string;
  fullName: string;
  role?: string;
}

export enum LauncherIcon {
  CHAT = "CHAT",
  MESSAGE = "MESSAGE",
  HELP = "HELP",
  SUPPORT = "SUPPORT",
  ROBOT = "ROBOT",
  ASSISTANT = "ASSISTANT",
  BUBBLE = "BUBBLE",
  CUSTOM = "CUSTOM", // If they want to use their own icon
}

export interface IAppearance {
  mainColor: string;
  launcherIcon: LauncherIcon;
  customIconUrl?: string; // Only used when launcherIcon is CUSTOM
}

export interface IConfiguration {
  welcomeMessage: string;
  sampleQuestions: string[];
  appearance: IAppearance;
}

export interface IScrapedPage {
  url: string;
  selected: boolean;
  content?: string;
}

export interface ICustomFaq {
  question: string;
  answer: string;
}

export interface IKnowledgefiles {
  name: string;
  description: string;
  files: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  websiteUrl?: string;
  owner: string;
  scrapedPages?: Array<IScrapedPage>;
  avatar: {
    type: "predefined" | "custom";
    avatarId?: string;
    imageUrl: string;
  };
  assistantId?: string;
  customFaqs: ICustomFaq[];
  knowledgefiles: IKnowledgefiles[];
  appearance: IAppearance;
  embedCode?: string;
  training: {
    status: "pending" | "processing" | "completed" | "failed";
    lastTrainedAt?: Date;
    error?: string;
  };
  configuration: IConfiguration;
  lastEdited?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Configuration {
  welcomeMessage: string;
  sampleQuestions: string[];
  appearance: {
    mainColor: string;
    launcherIcon: LauncherIcon;
    customIconUrl?: string;
  };
}
