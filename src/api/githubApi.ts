import axios from "axios";
import type { Repo, Sort, Order } from "../types/github";

const API_URL = "https://api.github.com/search/repositories";
const PER_PAGE = 30;

export async function searchRepositories(
  query: string,
  sort: Sort,
  order: Order,
  page: number,
): Promise<Repo[]> {
  try {
    const response = await axios.get(API_URL, {
      params: {
        q: query,
        sort,
        order,
        page,
        per_page: PER_PAGE,
      },
    });
    return response.data.items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
    throw new Error("Failed to fetch repositories");
  }
}
