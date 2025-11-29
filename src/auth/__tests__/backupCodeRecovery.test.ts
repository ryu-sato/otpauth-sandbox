import { BackupCodeService } from "../BackupCodeService";

describe("バックアップコード本人確認・再設定フロー", () => {
  it("本人確認が成功した場合、再設定手順案内が返る", () => {
    const service = new BackupCodeService();
    // 本人確認（仮: コード一致）
    const codes = service.generateCodes("user789");
    service.saveCodes("user789", codes);
    const inputCode = codes[0];
    const isVerified = service.verifyCode("user789", inputCode);
    expect(isVerified).toBe(true);
    // 再設定案内（仮: メッセージ返却）
    const msg = service.getRecoveryGuide("user789");
    expect(msg).toMatch(/再設定手順/);
  });

  it("本人確認が失敗した場合、案内は返らない", () => {
    const service = new BackupCodeService();
    service.generateCodes("user999"); // 保存しない
    const isVerified = service.verifyCode("user999", "NGCODE");
    expect(isVerified).toBe(false);
    const msg = service.getRecoveryGuide("user999");
    expect(msg).toBe("");
  });
});
