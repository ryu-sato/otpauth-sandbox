import React from "react";
import { IUser } from "./auth/User";

interface UserProfileProps {
  user: IUser;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div>
      <h2>ユーザープロフィール</h2>
      <p>ユーザー名: {user.username}</p>
      <p>メールアドレス: {user.email}</p>
      {/* 必要に応じて他の情報も表示可能 */}
    </div>
  );
};

export default UserProfile;
