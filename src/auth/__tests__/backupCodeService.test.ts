import { BackupCodeService } from '../BackupCodeService';

describe('BackupCodeService バックアップコード生成・表示', () => {
  it('ユーザーIDごとに10個の一意なバックアップコードを生成・取得できる', () => {
    const service = new BackupCodeService();
    const codes = service.generateCodes('user123');
    expect(codes).toHaveLength(10);
    // すべて一意
    expect(new Set(codes).size).toBe(10);
    // 形式（英数字8桁）
    codes.forEach(code => {
      expect(code).toMatch(/^[A-Za-z0-9]{8}$/);
    });
  });

  it('同じユーザーIDで再生成すると新しいコードが得られる', () => {
    const service = new BackupCodeService();
    const codes1 = service.generateCodes('user123');
    const codes2 = service.generateCodes('user123');
    expect(codes1).not.toEqual(codes2);
  });

  it('コードを保存・取得できる', () => {
    const service = new BackupCodeService();
    const codes = service.generateCodes('user456');
    service.saveCodes('user456', codes);
    const loaded = service.getCodes('user456');
    expect(loaded).toEqual(codes);
  });
});
