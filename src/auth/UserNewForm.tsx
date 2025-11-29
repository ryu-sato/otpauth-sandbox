import React, { useState } from 'react';

interface UserFormProps {
  onUserCreated?: (user: { id: string; password: string }) => void;
}

const UserNewForm: React.FC<UserFormProps> = ({ onUserCreated }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
    const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('ユーザー作成に成功しました');
        setId('');
        setPassword('');
        onUserCreated && onUserCreated({ id, password });
      } else {
        setMessage('ユーザー作成に失敗しました: ' + data.error);
      }
    } catch (err) {
      setMessage('エラーが発生しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>ユーザー作成</h2>
      <div style={{ marginBottom: 16 }}>
        <label>ユーザーID<br />
          <input type="text" value={id} onChange={e => setId(e.target.value)} required style={{ width: '100%' }} />
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>パスワード<br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
        </label>
      </div>
      <button type="submit">作成</button>
      {message && <div style={{ marginTop: 16, color: message.includes('成功') ? 'green' : 'red' }}>{message}</div>}
    </form>
  );
};

export default UserNewForm;
