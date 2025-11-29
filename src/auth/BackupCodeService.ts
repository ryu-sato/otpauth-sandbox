export class BackupCodeService {
  private codeStore: Record<string, string[]> = {};

  generateCodes(userId: string): string[] {
    // 8桁英数字の一意なコードを10個生成
    const codes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).replace(/[^a-zA-Z0-9]/g, '').slice(-8).padEnd(8, '0')
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
}
