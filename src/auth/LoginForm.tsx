import React, { useState } from 'react';

type Props = {
  onSuccess?: (userId: string) => void;
};

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ id?: string; password?: string }>({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { id?: string; password?: string } = {};
    if (!id) newErrors.id = 'IDは必須です';
    if (!password) newErrors.password = 'パスワードは必須です';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // 認証成功（仮実装: ID/pass固定）
      if (id === 'user1' && password === 'pass123') {
        setLoggedIn(true);
        if (onSuccess) onSuccess(id);
        // セッションタイマー開始（30分後に自動ログアウト）
        const timer = setTimeout(() => {
          setLoggedIn(false);
          setId('');
          setPassword('');
        }, 30 * 60 * 1000);
        setSessionTimer(timer);
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (sessionTimer) clearTimeout(sessionTimer);
    };
  }, [sessionTimer]);

  return (
    <div>
      {!loggedIn ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-id">ID</label>
            <input
              id="login-id"
              aria-label="ID"
              value={id}
              onChange={e => setId(e.target.value)}
            />
            {errors.id && <div>{errors.id}</div>}
          </div>
          <div>
            <label htmlFor="login-password">パスワード</label>
            <input
              id="login-password"
              type="password"
              aria-label="パスワード"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {errors.password && <div>{errors.password}</div>}
          </div>
          <button type="submit">ログイン</button>
        </form>
      ) : (
        <div>ようこそ, {id}</div>
      )}
    </div>
  );
};

export default LoginForm;
