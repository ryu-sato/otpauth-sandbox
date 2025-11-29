// Node.js環境でTextEncoder未定義対策
import { TextEncoder } from "util";
if (typeof global.TextEncoder === "undefined") {
  // @ts-ignore
  global.TextEncoder = TextEncoder;
}
import { TOTPService } from "../totpService";

describe("TOTPService 統計情報取得", () => {
  it("有効ユーザー数・認証失敗回数を取得できる", async () => {
    const service = new TOTPService();
    // 3ユーザー分のシークレット生成
    await service.generateSecret("userA");
    await service.generateSecret("userB");
    await service.generateSecret("userC");
    // 認証失敗を記録
    service.verifyCode("dummy", "NG", "userA");
    service.verifyCode("dummy", "NG", "userA");
    service.verifyCode("dummy", "NG", "userB");
    // 統計取得
    const stats = service.getStats();
    expect(stats.userCount).toBe(3);
    expect(stats.failedAttempts["userA"]).toBe(2);
    expect(stats.failedAttempts["userB"]).toBe(1);
    expect(stats.failedAttempts["userC"]).toBe(0);
  });
});
