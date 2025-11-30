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
  const [showTotpModal, setShowTotpModal] = useState(false);
  const [totpCode, setTotpCode] = useState("");

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
      if (response.status === 403) {
        console.log("高レベル認証が必要です");
        // 高レベル認証が必要になった場合はモーダルメニュを表示してTOTPコードを入力させ、TOTPコードを検証させてから、再度APIリクエストを送信する
        const dialog = document.getElementById("totpInputModal") as HTMLDialogElement | null;
        if (dialog) {
          dialog.showModal();
        }
        return;
      }

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

  const handleTotpSubmit = async () => {
    setShowTotpModal(false);
    // TOTPコードをサーバーに送信して検証
    const response = await fetch(`/api/auth/verify-totp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totpCode })
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "TOTPコードの検証に失敗しました");
      return;
    }
    // TOTPコードが有効なら再度プロフィール更新リクエストを送信
    handleSave();
  };

  return (
    <>
      <form style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username">ユーザー名</label>
          <input id="username" value={username} readOnly aria-label="ユーザー名" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">メールアドレス</label>
          <input id="email" value={email} onChange={e => setEmail(e.target.value)} aria-label="メールアドレス" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">パスワード</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} aria-label="パスワード" />
        </div>
        {error && <div>{error}</div>}
        <button type="button" onClick={handleSave}>保存</button>
        {loading && <div data-testid="loading-indicator">Loading...</div>}
        {success && <div>プロフィール情報を更新しました</div>}
      </form>
      <dialog id="totpInputModal">
        <form method="dialog">
          <input
            type="text"
            value={totpCode}
            onChange={e => setTotpCode(e.target.value)}
            placeholder="TOTPコードを入力"
          />
          <button onClick={handleTotpSubmit}>送信</button>
        </form>
      </dialog>
    </>
  );
};

export default UserProfileEditForm;
