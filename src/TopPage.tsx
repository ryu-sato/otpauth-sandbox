import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import UserCreateForm from './auth/UserCreateForm';
import LoginForm from './auth/LoginForm';
import UserProfile from './UserProfile';
import { IUser } from './auth/User';

const TopPageContent: React.FC = () => {
  const [user, setUser] = React.useState<IUser | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const userId = sessionStorage.getItem('loggedInUserId');
    if (userId) {
      setUser({ username: userId, email: userId + '@example.com', password: '', createdAt: new Date() } as IUser);
      navigate('/profile');
    }
  }, [navigate]);

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 20 }}>
      <Routes>
        <Route path="/" element={
          <>
            <h1>OTP Auth Sandbox</h1>
            <button style={{ margin: '1rem', width: '80%' }} onClick={() => navigate('/create')}>ユーザー作成</button>
            <button style={{ margin: '1rem', width: '80%' }} onClick={() => navigate('/login')}>ログイン</button>
          </>
        } />
        <Route path="/create" element={
          <>
            <UserCreateForm onUserCreated={() => navigate('/')} />
            <button style={{ marginTop: 16 }} onClick={() => navigate('/')}>戻る</button>
          </>
        } />
        <Route path="/login" element={
          <>
            <LoginForm onSuccess={(userId) => {
              setUser({ username: userId, email: userId + '@example.com', password: '', createdAt: new Date() } as IUser);
              navigate('/profile');
            }} />
            <button style={{ marginTop: 16 }} onClick={() => navigate('/')}>戻る</button>
          </>
        } />
        <Route path="/profile" element={
          user ? (
            <>
              <UserProfile user={user} />
              <button style={{ marginTop: 16 }} onClick={() => { setUser(null); sessionStorage.removeItem('loggedInUserId'); navigate('/'); }}>ログアウト</button>
            </>
          ) : <div>未ログインです</div>
        } />
      </Routes>
    </div>
  );
};

const TopPage: React.FC = () => (
  <BrowserRouter>
    <TopPageContent />
  </BrowserRouter>
);

export default TopPage;
