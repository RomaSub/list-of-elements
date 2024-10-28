import { observer } from "mobx-react-lite";
import type { Repo } from "../types/github";
import { Button, Input, List } from "antd";
import { useState } from "react";
import { reposStore } from "../stores/RepoStore";

export const RepoItem = observer(({ repo }: { repo: Repo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(repo.name);

  const handleSave = () => {
    reposStore.editRepo(repo.id, editedName);
    setIsEditing(false)
  };

  return (
    <List.Item
      actions={[
        isEditing ? (
          <Button onClick={handleSave}>Save</Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        ),
        <Button onClick={() => reposStore.deleteRepo(repo.id)}>Delete</Button>,
      ]}
    >
      <List.Item.Meta
        title={
          isEditing ? (
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onPressEnter={handleSave}
            />
          ) : (
            <a target="_blank" href={repo.html_url}>
              {repo.name}
            </a>
          )
        }
        description={repo.description || "Описание отсутствует"}
      />
      <div>Stars: {repo.stargazers_count}</div>
    </List.Item>
  );
});
