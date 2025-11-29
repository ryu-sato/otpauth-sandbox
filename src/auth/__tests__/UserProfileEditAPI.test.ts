/**
 * @jest-environment node
 */
// Node.js v20+ TextEncoder workaround
(global as any).TextEncoder = require("util").TextEncoder;

import request from "supertest";
import app from "../../server";
import jwt from "jsonwebtoken";

describe("UserProfileEditAPI", () => {
  const validToken = jwt.sign({ id: "testuser" }, "test-secret");
  const invalidToken = "invalidtoken";

  it("認証トークンが不正な場合は401エラーを返す", async () => {
    const res = await request(app)
      .post("/api/profile/edit")
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({ username: "testuser", email: "test@example.com" });
    expect(res.status).toBe(401);
  });

  it("認証トークンが有効な場合は編集リクエストを処理する", async () => {
    const res = await request(app)
      .post("/api/profile/edit")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ username: "testuser", email: "new@example.com" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("編集対象ユーザーが本人でない場合は403エラーを返す", async () => {
    const token = jwt.sign({ id: "otheruser" }, "test-secret");
    const res = await request(app)
      .post("/api/profile/edit")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "testuser", email: "test@example.com" });
    expect(res.status).toBe(403);
  });

  it("バリデーションエラー時は400エラーを返す", async () => {
    const res = await request(app)
      .post("/api/profile/edit")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ username: "", email: "" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
