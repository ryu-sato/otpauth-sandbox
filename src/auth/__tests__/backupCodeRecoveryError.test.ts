import { BackupCodeService } from '../BackupCodeService';

describe('バックアップコードリカバリ失敗時の拒否・エラー表示', () => {
  it('本人確認に失敗した場合、リカバリ拒否とエラーメッセージを返す', () => {
    const service = new BackupCodeService();
    service.generateCodes('userNG'); // 保存しない
    const isVerified = service.verifyCode('userNG', 'INVALID');
    expect(isVerified).toBe(false);
    const error = service.getRecoveryError('userNG');
    expect(error).toMatch(/リカバリ拒否/);
  });

  it('本人確認に成功した場合、エラーメッセージは返さない', () => {
    const service = new BackupCodeService();
    const codes = service.generateCodes('userOK');
    service.saveCodes('userOK', codes);
    service.verifyCode('userOK', codes[0]);
    const error = service.getRecoveryError('userOK');
    expect(error).toBe('');
  });
});
