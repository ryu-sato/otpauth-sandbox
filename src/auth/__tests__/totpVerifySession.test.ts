import { TOTPService } from "../totpService";

describe("TOTPService TOTPコード検証・セッション開始", () => {
  it("有効なTOTPコード入力時にtrueを返す", async () => {
    const service = new TOTPService();
    const secret = "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD"; // otplibデフォルト
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const validCode = require("otplib").authenticator.generate(secret);
    const result = service.verifyCode(secret, validCode);
    expect(result).toBe(true);
  });
});
