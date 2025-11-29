import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TOTPInputScreen } from "../TOTPInputScreen";

describe("TOTPInputScreen", () => {
  it("ログイン認証成功後にTOTPコード入力画面が表示される", () => {
    render(<TOTPInputScreen userId="testuser" />);
    expect(screen.getByLabelText("TOTPコード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "認証" })).toBeInTheDocument();
  });
});
