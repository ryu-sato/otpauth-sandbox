import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserProfileEditForm from "../UserProfileEditForm";

const mockUser = {
  username: "testuser",
  email: "test@example.com",
  password: "password123",
};

describe("UserProfileEditForm", () => {
  it("初期表示でユーザー情報が表示される", () => {
    render(<UserProfileEditForm user={mockUser} onSave={jest.fn()} />);
    expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
  });

  it("氏名・メール・パスワードを編集し保存時にonSaveが呼ばれる", () => {
    const onSave = jest.fn();
    render(<UserProfileEditForm user={mockUser} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText("ユーザー名"), { target: { value: "newname" } });
    fireEvent.change(screen.getByLabelText("メールアドレス"), { target: { value: "new@example.com" } });
    fireEvent.change(screen.getByLabelText("パスワード"), { target: { value: "newpass" } });
    fireEvent.click(screen.getByText("保存"));
    expect(onSave).toHaveBeenCalledWith({ username: "newname", email: "new@example.com", password: "newpass" });
  });

  it("バリデーションエラー時にエラーメッセージが表示される", () => {
    render(<UserProfileEditForm user={mockUser} onSave={jest.fn()} />);
    fireEvent.change(screen.getByLabelText("メールアドレス"), { target: { value: "" } });
    fireEvent.click(screen.getByText("保存"));
    expect(screen.getByText("メールアドレスは必須です")).toBeInTheDocument();
  });

  it("保存処理中はローディングインジケータが表示される", () => {
    render(<UserProfileEditForm user={mockUser} onSave={jest.fn()} loading={true} />);
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("保存成功時に成功メッセージが表示される", () => {
    render(<UserProfileEditForm user={mockUser} onSave={jest.fn()} success={true} />);
    expect(screen.getByText("プロフィール情報を更新しました")).toBeInTheDocument();
  });
});
