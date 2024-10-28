export type Repo = {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
};

export type Order = "asc" | "desc";
export type Sort = "stars" | "forks" | "updated" 

