/**
 * @jest-environment node
 */
import mongoose from "mongoose";
import ProfileEditHistory from "../ProfileEditHistory";

describe("ProfileEditHistoryモデル", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/otpauth-sandbox-test");
    await ProfileEditHistory.deleteMany({});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("createHistoryで履歴が記録される", async () => {
    const history = await ProfileEditHistory.createHistory({
      userId: "user1",
      before: { email: "old@example.com" },
      after: { email: "new@example.com" },
    });
    expect(history.userId).toBe("user1");
    expect(history.before.email).toBe("old@example.com");
    expect(history.after.email).toBe("new@example.com");
  });

  it("getHistoryByUserで履歴が取得できる", async () => {
    await ProfileEditHistory.createHistory({
      userId: "user2",
      before: { email: "a@example.com" },
      after: { email: "b@example.com" },
    });
    const histories = await ProfileEditHistory.getHistoryByUser("user2");
    expect(histories.length).toBeGreaterThan(0);
    expect(histories[0].userId).toBe("user2");
  });
});
