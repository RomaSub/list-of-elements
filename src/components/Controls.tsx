import { Input, Select } from 'antd';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './App.module.css';
import { reposStore } from '../stores/RepoStore';
import type { Order, Sort } from '../types/github';

const { Search } = Input;
const { Option } = Select;

export const Controls = observer(() => {
  const { t } = useTranslation();

  const handleSearch = (value: string) => {
    reposStore.setQuery(value);
    reposStore.resetRepos();
  };

  const handleSortChange = (value: Sort) => {
    reposStore.setSort(value);
    reposStore.resetRepos();
  };

  const handleOrderChange = (value: Order) => {
    reposStore.setOrder(value);
    reposStore.resetRepos();
  };

  return (
    <div className={styles.searchInput}>
      <Search
        defaultValue={reposStore.query}
        placeholder={t('searchRepositories')}
        onSearch={handleSearch}
        style={{ width: 300 }}
      />
      <div className={styles.controls}>
        <LanguageSwitcher />
        <Select onChange={handleSortChange} defaultValue={reposStore.sort} style={{ marginRight: '5px' }}>
          <Option value='stars'>{t('stars')}</Option>
          <Option value='forks'>{t('forks')}</Option>
          <Option value='updated'>{t('updated')}</Option>
        </Select>
        <Select onChange={handleOrderChange} defaultValue={reposStore.order}>
          <Option value='desc'>{t('descending')}</Option>
          <Option value='asc'>{t('ascending')}</Option>
        </Select>
      </div>
    </div>
  );
});
