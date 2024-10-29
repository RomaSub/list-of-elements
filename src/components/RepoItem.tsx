import { observer } from 'mobx-react-lite';
import type { Repo } from '../types/github';
import { Avatar, Button, Input, List } from 'antd';
import {  useState } from 'react';
import { reposStore } from '../stores/RepoStore';
import { useTranslation } from 'react-i18next';

export const RepoItem = observer(({ repo }: { repo: Repo }) => {
  const {t} = useTranslation()
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(repo.name);

  const handleSave = () => {
    reposStore.editRepo(repo.id, editedName);
    setIsEditing(false);
  };

  return (
    <List.Item
      actions={[
        isEditing ? <Button onClick={handleSave}>Save</Button> : <Button onClick={() => setIsEditing(true)}>{t('editBtn')}</Button>,
        <Button onClick={() => reposStore.deleteRepo(repo.id)}>{t('deleteBtn')}</Button>,
      ]}>
      <List.Item.Meta
        avatar={<Avatar size='large' src={repo.owner.avatar_url} />}
        title={
          isEditing ? (
            <Input value={editedName} onChange={e => setEditedName(e.target.value)} onPressEnter={handleSave} />
          ) : (
            <a target='_blank' href={repo.html_url}>
              {repo.name}
            </a>
          )
        }
        description={repo.description || 'Описание отсутствует'}
      />
      <div>{repo.stargazers_count} ★</div>
    </List.Item>
  );
});
