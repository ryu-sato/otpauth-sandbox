import React from 'react';
import { useState } from 'react';
import UserCreateForm from './auth/UserCreateForm';
import LoginForm from './auth/LoginForm';
import UserProfile from './UserProfile';
import { IUser } from './auth/User';

const TopPage: React.FC = () => {
  const [page, setPage] = useState<'top' | 'create' | 'login' | 'profile'>('top');
  const [user, setUser] = useState<IUser | null>(null);

  React.useEffect(() => {
    const userId = sessionStorage.getItem('loggedInUserId');
    if (userId) {
      setUser({ username: userId, email: userId + '@example.com', password: '', createdAt: new Date() } as IUser);
      setPage('profile');
    }
  }, []);

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
          <LoginForm />
          <button style={{ marginTop: 16 }} onClick={() => setPage('top')}>戻る</button>
        </>
      )}
      {page === 'profile' && user && (
        <>
          <UserProfile user={user} />
          <button style={{ marginTop: 16 }} onClick={() => { setUser(null); setPage('top'); sessionStorage.removeItem('loggedInUserId'); }}>ログアウト</button>
        </>
      )}
    </div>
  );
};

export default TopPage;
