import { TOTPService } from "../totpService";

describe("TOTPService セットアップエラー処理", () => {
  it("QRコード生成失敗時にエラーメッセージを返す", async () => {
    const service = new TOTPService();
    // qrcode.toDataURL を強制的に失敗させる
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.spyOn(require("qrcode"), "toDataURL").mockImplementation(() => {
      return Promise.reject(new Error("QR生成失敗"));
    });
    await expect(service.generateSecret("erroruser")).rejects.toThrow("QR生成失敗");
  });
});
