import React from 'react';
import { useState } from 'react';
import UserCreateForm from './auth/UserCreateForm';
import LoginForm from './auth/LoginForm';

const TopPage: React.FC = () => {
  const [page, setPage] = useState<'top' | 'create' | 'login'>('top');

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 20 }}>
      {page === 'top' && (
        <>
          <h1>OTP Auth Sandbox</h1>
          <button style={{ margin: '1rem', width: '80%' }} onClick={() => setPage('create')}>ユーザー作成</button>
          <button style={{ margin: '1rem', width: '80%' }} onClick={() => setPage('login')}>ログイン</button>
        </>
      )}
      {page === 'create' && (
        <>
          <UserCreateForm onUserCreated={() => setPage('top')} />
          <button style={{ marginTop: 16 }} onClick={() => setPage('top')}>戻る</button>
        </>
      )}
      {page === 'login' && (
        <>
          <LoginForm onSuccess={() => setPage('top')} />
          <button style={{ marginTop: 16 }} onClick={() => setPage('top')}>戻る</button>
        </>
      )}
    </div>
  );
};

export default TopPage;
