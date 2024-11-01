import { makeAutoObservable, runInAction } from 'mobx';
import type { Repo, Sort, Order } from '../types/github';
import { searchRepositories } from '../api/githubApi';

class RepoStore {
  repos: Repo[] = [];
  isLoading = false;
  currentPage = 1;
  isLastPage = false;
  query = 'rust';
  sort: Sort = 'stars';
  order: Order = 'desc';

  constructor() {
    makeAutoObservable(this);
  }

  setQuery = (query: string) => {
    this.query = query;
  };

  setSort = (sort: Sort) => {
    this.sort = sort;
  };

  setOrder = (order: Order) => {
    this.order = order;
  };

  loadInitialRepos = async () => {
    this.isLoading = true;
    this.currentPage = 1;
    this.isLastPage = false;

    try {
      const data = await searchRepositories(this.query, this.sort, this.order, this.currentPage);
      runInAction(() => {
        this.repos = data;
        this.isLastPage = data.length === 0;
      });
    } catch (err) {
      console.error('Failed to load repos', err);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  loadMoreRepos = async () => {
    if (this.isLoading || this.isLastPage) return;

    this.isLoading = true;
    this.currentPage += 1;

    try {
      const data = await searchRepositories(this.query, this.sort, this.order, this.currentPage);
      runInAction(() => {
        this.repos = [...this.repos, ...data];
        this.isLastPage = data.length === 0;
      });
    } catch (err) {
      console.error('Failed to load more repos', err);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  editRepo = (id: number, newName: string) => {
    runInAction(() => {
      this.repos = this.repos.map(repo => (repo.id === id ? { ...repo, name: newName } : repo));
    });
  };

  deleteRepo = (id: number) => {
    this.repos = this.repos.filter(repo => repo.id !== id);
  };

  resetRepos = () => {
    this.repos = [];
    this.currentPage = 1;
    this.isLastPage = false;
  };
}

export const reposStore = new RepoStore();
