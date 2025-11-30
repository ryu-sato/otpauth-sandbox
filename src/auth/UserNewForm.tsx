import React, { useState } from "react";

interface UserFormProps {
  onUserCreated?: () => void;
}

const UserNewForm: React.FC<UserFormProps> = ({ onUserCreated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [qrCode, setQRCode] = useState<string | null>(null);

  const handleUserRegistrationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/user_registration_requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("ユーザー作成要求を発行しました。TOTP設定を続けてください。");
        setPassword("");
        if (data.qrCode) {
          setQRCode(data.qrCode);
        }
      } else {
        setMessage("ユーザー作成に失敗しました: " + data.error);
      }
    } catch {
      setMessage("エラーが発生しました");
    }
  };

  const handleUserCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, code }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("ユーザー作成に成功しました");
        setUsername("");
        setPassword("");
        setCode("");
        setQRCode(null);
        if (onUserCreated) {
          onUserCreated();
        }
      } else {
        setMessage("ユーザー作成に失敗しました: " + data.error);
      }
    } catch {
      setMessage("エラーが発生しました");
    }
  };

  return (
    (!qrCode) ? (
      <form onSubmit={handleUserRegistrationRequest} style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>ユーザー作成</h2>
        <div style={{ marginBottom: 16 }}>
          <label>ユーザー名<br />
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: "100%" }} />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>パスワード<br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%" }} />
          </label>
        </div>
        <button type="submit">作成</button>
        {message && <div style={{ marginTop: 16, color: message.includes("成功") ? "green" : "red" }}>{message}</div>}
      </form>
    ) : (
      <form onSubmit={handleUserCreate} style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
        <label htmlFor="totp-code">TOTPコード</label>
        <img src={qrCode} alt="TOTP QRコード" style={{ display: "block", margin: "1rem 0" }} />
        <input
          id="totp-code"
          aria-label="TOTPコード"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <button type="submit">認証</button>
      </form>
    )
  );
};

export default UserNewForm;
