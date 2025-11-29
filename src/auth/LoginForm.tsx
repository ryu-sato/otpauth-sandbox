import React, { useState } from 'react';
// import { AuthService, AuthErrorType } from './authService';

type Props = {
  onSuccess?: (userId: string) => void;
};

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ id?: string; password?: string }>({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('handleSubmit called');
    e.preventDefault();
    setErrors({});
    // 認証APIを呼び出す
    const response = await fetch('/api/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password })
    });
    const result = await response.json();
    if (result.success) {
      setLoggedIn(true);
      if (onSuccess) onSuccess(id);
      // セッションタイマー開始（30分後に自動ログアウト）
      const timer = setTimeout(() => {
        setLoggedIn(false);
        setId('');
        setPassword('');
      }, 30 * 60 * 1000);
      setSessionTimer(timer);
    } else {
      // エラー内容に応じて表示
      if (result.error) {
        const newErrors: { id?: string; password?: string } = {};
  if (result.error.type === 'ValidationError') {
          if (!id) newErrors.id = 'IDは必須です';
          if (!password) newErrors.password = 'パスワードは必須です';
  } else if (result.error.type === 'AuthFailed') {
          newErrors.id = 'IDまたはパスワードが不正です';
          newErrors.password = 'IDまたはパスワードが不正です';
  } else if (result.error.type === 'Locked') {
          newErrors.id = 'アカウントがロックされています';
  } else if (result.error.type === 'SystemError') {
          newErrors.id = 'システム障害が発生しました';
        }
        setErrors(newErrors);
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
