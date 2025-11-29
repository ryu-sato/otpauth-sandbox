// Node.js環境でTextEncoder未定義対策
import { TextEncoder } from "util";
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
import { TOTPService } from "../totpService";

describe("TOTPService 監査ログ表示", () => {
  it("認証・失敗・ロック等のイベントを監査ログとして取得できる", async () => {
    const service = new TOTPService();
    await service.generateSecret("userA");
    await service.generateSecret("userB");
    service.verifyCode("dummy", "NG", "userA");
    service.verifyCode("dummy", "NG", "userA");
    service.verifyCode("dummy", "NG", "userB");
    service.verifyCode("dummy", "OK", "userA");
    // ロック判定
    service.verifyCode("dummy", "NG", "userA");
    service.verifyCode("dummy", "NG", "userA");
    service.verifyCode("dummy", "NG", "userA");
    // 監査ログ取得
    const logs = service.getAuditLog();
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBeGreaterThanOrEqual(1);
    // ログ内容例
    expect(logs.some(log => log.event === "generateSecret" && log.userId === "userA")).toBe(true);
    expect(logs.some(log => log.event === "verifyCode" && log.userId === "userA")).toBe(true);
    expect(logs.some(log => log.event === "lock" && log.userId === "userA")).toBe(true);
  });
});
