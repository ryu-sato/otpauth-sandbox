import React, { useState } from "react";

type UserProfileEditFormProps = {
  user: {
    username: string;
    email: string;
    password?: string;
  };
  onSave: (profile: { username: string; email: string; password?: string }) => void;
  loading?: boolean;
  success?: boolean;
};

const UserProfileEditForm: React.FC<UserProfileEditFormProps> = ({ user, onSave, loading, success }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!email) {
      setError("メールアドレスは必須です");
      return;
    }
    setError(null);

    const response = await fetch(`/api/users/${username}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "プロフィールの更新に失敗しました");
      return;
    }
    const result = await response.json();
    if (!result.success) {
      setError(result.error || "プロフィールの更新に失敗しました");
      return;
    }

    onSave({ username, email, password });
  };

  return (
    <form style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <label htmlFor="username">ユーザー名</label>
      <input id="username" value={username} onChange={e => setUsername(e.target.value)} aria-label="ユーザー名" />
      <label htmlFor="email">メールアドレス</label>
      <input id="email" value={email} onChange={e => setEmail(e.target.value)} aria-label="メールアドレス" />
      <label htmlFor="password">パスワード</label>
      <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} aria-label="パスワード" />
      {error && <div>{error}</div>}
      <button type="button" onClick={handleSave}>保存</button>
      {loading && <div data-testid="loading-indicator">Loading...</div>}
      {success && <div>プロフィール情報を更新しました</div>}
    </form>
  );
};

export default UserProfileEditForm;
