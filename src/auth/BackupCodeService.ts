export class BackupCodeService {
  private codeStore: Record<string, string[]> = {};

  private verifiedUsers: Set<string> = new Set();

  generateCodes(_userId: string): string[] {
    // 8桁英数字の一意なコードを10個生成
    const codes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).replace(/[^a-zA-Z0-9]/g, "").slice(-8).padEnd(8, "0")
    );
    // 一意性担保
    return Array.from(new Set(codes));
  }

  saveCodes(userId: string, codes: string[]): void {
    this.codeStore[userId] = codes;
  }

  getCodes(userId: string): string[] {
    return this.codeStore[userId] || [];
  }

  verifyCode(userId: string, code: string): boolean {
    const codes = this.getCodes(userId);
    const ok = codes.includes(code);
    if (ok) {
      this.verifiedUsers.add(userId);
    }
    return ok;
  }

  getRecoveryGuide(userId: string): string {
    if (this.verifiedUsers.has(userId)) {
      return "再設定手順: 新しいTOTPを登録してください";
    }
    return "";
  }
  getRecoveryError(userId: string): string {
    if (this.verifiedUsers.has(userId)) {
      return "";
    }
    return "リカバリ拒否: 本人確認に失敗しました";
  }
}
