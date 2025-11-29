import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import "@testing-library/jest-dom";
import LoginForm from "../LoginForm";
 
// 7行目の不要な閉じ括弧を削除
describe("LoginForm", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("IDとパスワード入力欄が表示される", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ success: true })
      } as unknown as Response)
    );
    render(<LoginForm />);
    expect(screen.getByLabelText("ユーザーID")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
  });

  test("空欄でログインボタンを押すとエラーメッセージが表示される", async () => {
    render(<LoginForm />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    });
    await Promise.resolve();
    expect(screen.getByText("ユーザーIDは必須です")).toBeInTheDocument();
    expect(screen.getByText("パスワードは必須です")).toBeInTheDocument();
  });

      test("ID・パスワード入力後にログインボタンを押すとエラーが消える", async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            status: 200,
            headers: { get: () => "application/json" },
            json: () => Promise.resolve({ success: true })
          } as unknown as Response)
        );
        render(<LoginForm />);
        await act(async () => {
          fireEvent.change(screen.getByLabelText("ユーザーID"), { target: { value: "user1" } });
          fireEvent.change(screen.getByLabelText("パスワード"), { target: { value: "pass123" } });
          fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
        });
        await screen.findByRole("button", { name: "ログイン" });
        expect(screen.queryByText("ユーザーIDは必須です")).not.toBeInTheDocument();
        expect(screen.queryByText("パスワードは必須です")).not.toBeInTheDocument();
  });
});
