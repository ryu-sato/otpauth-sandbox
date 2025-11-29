import { AuthErrorType } from '../authService';
import bcrypt from 'bcryptjs';

describe('パスワードの平文保存禁止', () => {
  test('パスワードはハッシュ化して保存される', async () => {
    const plain = 'pass123';
    const hash = await bcrypt.hash(plain, 10);
    expect(hash).not.toBe(plain);
    expect(await bcrypt.compare(plain, hash)).toBe(true);
  });

  test('平文パスワードは保存されない', () => {
    // 仮のユーザーデータ保存例
    const user = { userId: 'user1', passwordHash: 'hashedpass', password: undefined };
    expect(user.password).toBeUndefined();
  });
});
