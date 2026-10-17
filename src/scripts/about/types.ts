export interface GitHubRepo {          // API 응답 중 쓰는 필드만
  name: string;
  description: string | null;          // 설명 없는 저장소는 null
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
}
export type RepoStatus = "loading" | "success" | "empty" | "error";
export interface ApiError { title: string; detail: string }
export interface RepoState { status: RepoStatus; repos: GitHubRepo[]; error: ApiError | null }

export type FieldName = "name" | "email" | "message";   // Contact.astro의 name과 맞춤
export type FieldErrors = Record<FieldName, string>;
export type FormStatus = "idle" | "invalid" | "success";
export interface FormState { errors: FieldErrors; status: FormStatus }

export interface Store<S> { get: () => S; set: (patch: Partial<S>) => void }