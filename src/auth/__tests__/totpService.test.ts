import { TOTPService } from "../totpService";
// Node.js環境でTextEncoder未定義対策
// eslint-disable-next-line @typescript-eslint/no-require-imports
global.TextEncoder = require("util").TextEncoder;

describe("TOTPService", () => {
  it("ユーザーIDを指定してTOTPシークレットを生成し、QRコードを返す", async () => {
    const service = new TOTPService();
    const userId = "testuser";
    const result = await service.generateSecret(userId);
    expect(result).toHaveProperty("secret");
    expect(result).toHaveProperty("qrCode");
    expect(typeof result.secret).toBe("string");
    expect(typeof result.qrCode).toBe("string");
    expect(result.secret.length).toBeGreaterThan(0);
    expect(result.qrCode.length).toBeGreaterThan(0);
  });
});
