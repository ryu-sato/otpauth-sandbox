import React from "react";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import UserNewForm from "./auth/UserNewForm";
import LoginForm from "./auth/LoginForm";
import UserProfile from "./UserProfile";
import UserProfileEditForm from "./UserProfileEditForm";
import { IUser } from "./auth/User";

const TopPageContent: React.FC = () => {
  const [user, setUser] = React.useState<IUser | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/health");
        if (!res.ok) throw new Error("health check failed");
        const result = await res.json();
        setUser(result.user); // ユーザーはログイン状態を維持
      } catch (e) {
        setUser(null);
        navigate("/");
      }
    }, 5000); // 5秒ごと
    return () => clearInterval(intervalId);
  }, [user, navigate]);

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 20 }}>
      <Routes>
        <Route path="/" element={
          <>
            <h1>OTP Auth Sandbox</h1>
            <button style={{ margin: "1rem", width: "80%" }} onClick={() => navigate("/user/new")}>ユーザー作成</button>
            <button style={{ margin: "1rem", width: "80%" }} onClick={() => navigate("/login")}>ログイン</button>
          </>
        } />
        <Route path="/user/new" element={
          <>
            <UserNewForm onUserCreated={() => navigate("/profile")} />
            <button style={{ marginTop: 16 }} onClick={() => navigate("/")}>戻る</button>
          </>
        } />
        <Route path="/login" element={
          <>
            <LoginForm onSuccess={(userId) => {
              setUser({ username: userId, email: userId + "@example.com", password: "", createdAt: new Date() } as IUser);
              navigate("/profile");
            }} />
            <button style={{ marginTop: 16 }} onClick={() => navigate("/")}>戻る</button>
          </>
        } />
        <Route path="/profile" element={
          user ? (
            <>
              <UserProfile user={user} />
              <button style={{ marginTop: 16 }} onClick={() => navigate("/profile/edit")}>プロフィール編集</button>
              <button style={{ marginTop: 16 }} onClick={() => { setUser(null); navigate("/"); }}>ログアウト</button>
            </>
          ) : (
            <>
              <div>未ログインです</div>
              <button style={{ marginTop: 16 }} onClick={() => navigate("/")}>戻る</button>
            </>
          )
        } />
        <Route path="/profile/edit" element={
          user ? (
            <>
              <UserProfileEditForm user={user} onSave={() => navigate("/profile")} />
              <button style={{ marginTop: 16 }} onClick={() => navigate("/profile")}>戻る</button>
            </>
          ) : (
            <>
              <div>未ログインです</div>
              <button style={{ marginTop: 16 }} onClick={() => navigate("/")}>戻る</button>
            </>
          )
        } />
      </Routes>
    </div>
  );
};

const TopPage: React.FC = () => (
  <HashRouter>
    <TopPageContent />
  </HashRouter>
);

export default TopPage;
