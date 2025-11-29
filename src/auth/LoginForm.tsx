import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ id?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { id?: string; password?: string } = {};
    if (!id) newErrors.id = 'IDは必須です';
    if (!password) newErrors.password = 'パスワードは必須です';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // 認証処理は未実装
    }
  };

  return (
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
  );
};

export default LoginForm;
