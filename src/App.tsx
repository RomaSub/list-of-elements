import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { reposStore } from "./stores/RepoStore";
import { Input, List, Select, Spin } from "antd";
import type { Sort, Order, Repo } from "./types/github";
import { RepoItem } from "./components/RepoItem";
import styles from "./components/App.module.css";

const { Search } = Input;
const { Option } = Select;

export const App = observer(() => {
  const [query, setQuery] = useState("rust");
  const [order, setOrder] = useState<Order>("desc");
  const [sort, setSort] = useState<Sort>("stars");
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reposStore.loadInitialRepos(query, sort, order);
  }, [query, sort, order]);

  const handleScroll = () => {
    if (divRef.current) {
      console.log("11111111111");
      const { scrollTop, scrollHeight, clientHeight } = divRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 5 &&
        !reposStore.isLoading &&
        !reposStore.isLastPage
      ) {
        console.log("ja");

        reposStore.loadMoreRepos(query, sort, order);
      }
    }
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    reposStore.resetRepos();
  };

  const handleSortChange = (value: Sort) => {
    setSort(value);
    reposStore.resetRepos();
  };

  const handleOrderChange = (value: Order) => {
    setOrder(value);
    reposStore.resetRepos();
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <Search
          defaultValue="rust"
          placeholder="Искать репозитроии"
          onSearch={handleSearch}
                  style={{ width: 300 }}
        />
        <Select onChange={handleSortChange} defaultValue="stars">
          <Option value="stars">Stars</Option>
          <Option value="forks">Forks</Option>
          <Option value="updated">Updated</Option>
        </Select>

        <Select onChange={handleOrderChange} defaultValue="desc">
          <Option value="desc">По убыванию</Option>
          <Option value="asc">По возрастанию</Option>
        </Select>
      </div>
      <div ref={divRef} onScroll={handleScroll} className={styles.listContainer}>
        <List
          dataSource={reposStore.repos}
          renderItem={(repo: Repo) => <RepoItem key={repo.id} repo={repo} />}
        />
      </div>
      {reposStore.isLoading && (
        <div className={styles.spinnerContainer}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
});
