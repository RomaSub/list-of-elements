import { makeAutoObservable, runInAction } from "mobx";
import type { Repo, Sort, Order } from "../types/github";
import { searchRepositories } from "../api/githubApi";

class RepoStore {
  repos: Repo[] = [];
  isLoading = false;
  currentPage = 1;
  isLastPage = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadInitialRepos = async (query: string, sort: Sort, order: Order) => {
    this.isLoading = true;
    this.currentPage = 1;
    this.isLastPage = false;

    try {
      const data = await searchRepositories(
        query,
        sort,
        order,
        this.currentPage,
      );
      runInAction(() => {
        this.repos = data;
        this.isLastPage = data.length === 0;
      });
    } catch (err) {
      console.error("Failed to load repos", err);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  loadMoreRepos = async (query: string, sort: Sort, order: Order) => {
    if (this.isLoading || this.isLastPage) return;

    this.isLoading = true;
    this.currentPage += 1;

    try {
      const data = await searchRepositories(
        query,
        sort,
        order,
        this.currentPage,
      );
      runInAction(() => {
        this.repos = [...this.repos, ...data];
        this.isLastPage = data.length === 0;
      });
    } catch (err) {
      console.error("Failed to load more repos", err);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  editRepo = (id: number, newName: string) => {
    const ind = this.repos.findIndex((repo) => repo.id === id);
    if (ind !== -1) {
      this.repos[ind] = { ...this.repos[ind], name: newName };
    }
  };

  deleteRepo = (id: number) => {
    this.repos = this.repos.filter((repo) => repo.id !== id);
  };

  resetRepos = () => {
    this.repos = [];
    this.currentPage = 1;
    this.isLastPage = false;
  };
}

export const reposStore = new RepoStore();
