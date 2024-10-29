import { List, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import styles from './components/App.module.css';
import { Controls } from './components/Controls';
import { RepoItem } from './components/RepoItem';
import { reposStore } from './stores/RepoStore';
import type { Repo } from './types/github';

export const App = observer(() => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    reposStore.loadInitialRepos();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        reposStore.loadMoreRepos();
      }
    });
    const currentTrigger = loadMoreTriggerRef.current;
    if (currentTrigger) observerRef.current.observe(currentTrigger);

    return () => {
      if (currentTrigger) observerRef.current?.unobserve(currentTrigger);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Controls />
      <List dataSource={reposStore.repos} renderItem={(repo: Repo) => <RepoItem key={repo.id} repo={repo} />} />
      {reposStore.isLoading && (
        <div className={styles.spinnerContainer}>
          <Spin size='large' />
        </div>
      )}
      <div ref={loadMoreTriggerRef} className={styles.loadMoreTrigger} />
    </div>
  );
});
