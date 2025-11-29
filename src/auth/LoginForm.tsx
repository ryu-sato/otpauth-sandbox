import React, { useState } from "react";
type Props = {
  onSuccess?: (userId: string) => void;
};

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ id?: string; password?: string }>({});
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    // まずフロント側で空欄バリデーション
    const newErrors: { id?: string; password?: string } = {};
    if (!id) newErrors.id = "ユーザーIDは必須です";
    if (!password) newErrors.password = "パスワードは必須です";
    if (newErrors.id || newErrors.password) {
      setErrors(newErrors);
      setMessage("ログインに失敗しました");
      return;
    }
    // 認証APIを呼び出す
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password })
    });
    const result = await response.json();
    if (result.success) {
      setLoggedIn(true);
      sessionStorage.setItem("loggedInUserId", id);
      setMessage("ログインに成功しました");
      if (onSuccess) onSuccess(id);
      // セッションタイマー開始（30分後に自動ログアウト）
      const timer = setTimeout(() => {
        setLoggedIn(false);
        setId("");
        setPassword("");
        setMessage("");
        sessionStorage.removeItem("loggedInUserId");
      }, 30 * 60 * 1000);
      setSessionTimer(timer);
    } else {
      // エラー内容に応じて表示
      if (result.error) {
        const newErrors: { id?: string; password?: string } = {};
        if (result.error.type === "ValidationError") {
          if (!id) newErrors.id = "ユーザーIDは必須です";
          if (!password) newErrors.password = "パスワードは必須です";
        } else if (result.error.type === "AuthFailed") {
          newErrors.id = "ユーザーIDまたはパスワードが不正です";
          newErrors.password = "ユーザーIDまたはパスワードが不正です";
        } else if (result.error.type === "Locked") {
          newErrors.id = "アカウントがロックされています";
        } else if (result.error.type === "SystemError") {
          newErrors.id = "システム障害が発生しました";
        }
        setErrors(newErrors);
        setMessage("ログインに失敗しました");
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (sessionTimer) clearTimeout(sessionTimer);
    };
  }, [sessionTimer]);

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>ログイン</h2>
      <div style={{ marginBottom: 16 }}>
        <label>ユーザーID<br />
          <input type="text" value={id} onChange={e => setId(e.target.value)} required style={{ width: "100%" }} />
        </label>
        {errors.id && <div style={{ color: "red", marginTop: 4 }}>{errors.id}</div>}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>パスワード<br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%" }} />
        </label>
        {errors.password && <div style={{ color: "red", marginTop: 4 }}>{errors.password}</div>}
      </div>
      <button type="submit">ログイン</button>
      {message && <div style={{ marginTop: 16, color: message.includes("成功") ? "green" : "red" }}>{message}</div>}
    </form>
  );
};

export default LoginForm;
