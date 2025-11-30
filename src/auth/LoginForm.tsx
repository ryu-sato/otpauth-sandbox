import { totp } from "otplib";
import React, { useState } from "react";
type Props = {
  onSuccess?: (userId: string) => void;
};

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string, totpCode?: string }>({});
  const [totpCode, setTotpCode] = useState("");
  const [message, setMessage] = useState("");
  const [, setLoggedIn] = useState(false);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");
    // まずフロント側で空欄バリデーション
    const newErrors: { username?: string; password?: string, totpCode?: string } = {};
    if (!username) newErrors.username = "ユーザー名は必須です";
    if (!password) newErrors.password = "パスワードは必須です";
    if (!totpCode) newErrors.totpCode = "TOTPコードは必須です";
    if (newErrors.username || newErrors.password || newErrors.totpCode) {
      setErrors(newErrors);
      setMessage("ログインに失敗しました");
      return;
    }
    // 認証APIを呼び出す
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, totpCode })
    });
    const result = await response.json();
    if (result.success) {
      setLoggedIn(true);
      sessionStorage.setItem("loggedInUserId", username);
      setMessage("ログインに成功しました");
      if (onSuccess) onSuccess(username);
      // セッションタイマー開始（30分後に自動ログアウト）
      const timer = setTimeout(() => {
        setLoggedIn(false);
        setUsername("");
        setPassword("");
        setMessage("");
        sessionStorage.removeItem("loggedInUserId");
      }, 30 * 60 * 1000);
      setSessionTimer(timer);
    } else {
      // エラー内容に応じて表示
      if (result.error) {
        const newErrors: { username?: string; password?: string } = {};
        if (result.error.type === "ValidationError") {
          if (!username) newErrors.username = "ユーザー名は必須です";
          if (!password) newErrors.password = "パスワードは必須です";
        } else if (result.error.type === "AuthFailed") {
          newErrors.username = "ユーザー名またはパスワードが不正です";
          newErrors.password = "ユーザー名またはパスワードが不正です";
        } else if (result.error.type === "Locked") {
          newErrors.username = "アカウントがロックされています";
        } else if (result.error.type === "SystemError") {
          newErrors.username = "システム障害が発生しました";
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
        <label>ユーザー名<br />
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: "100%" }} />
        </label>
        {errors.username && <div style={{ color: "red", marginTop: 4 }}>{errors.username}</div>}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>パスワード<br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%" }} />
        </label>
        {errors.password && <div style={{ color: "red", marginTop: 4 }}>{errors.password}</div>}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>TOTPコード<br />
          <input type="text" value={totpCode} onChange={e => setTotpCode(e.target.value)} required style={{ width: "100%" }} />
        </label>
        {errors.totpCode && <div style={{ color: "red", marginTop: 4 }}>{errors.totpCode}</div>}
      </div>
      <button type="submit">ログイン</button>
      {message && <div style={{ marginTop: 16, color: message.includes("成功") ? "green" : "red" }}>{message}</div>}
    </form>
  );
};

export default LoginForm;
