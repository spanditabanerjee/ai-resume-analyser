export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn: number;
}

export interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  atsSuggestions: string[];
}

export interface AnalysisRecord {
  id: string;
  resumeFileName: string;
  jobDescription: string;
  score: number | null;
  analysisJson: AnalysisResult | null;
  createdAt: string;
}

export interface AnalyzeResponse extends AnalysisResult {
  id: string;
  createdAt: string;
}

export interface UploadResponse {
  fileName: string;
  extractedText: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: { field: string; message: string }[];
}
