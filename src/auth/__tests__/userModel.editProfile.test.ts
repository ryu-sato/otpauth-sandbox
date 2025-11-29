/**
 * @jest-environment node
 */
import mongoose from 'mongoose';
import User from '../User';

describe('Userモデルのプロフィール編集', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/otpauth-sandbox-test');
    await User.deleteMany({});
    await User.create({ username: 'testuser', email: 'test@example.com', password: 'pass' });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('updateProfileでプロフィール情報が更新される', async () => {
    const user = await User.findOne({ username: 'testuser' });
    expect(user).not.toBeNull();
    if (!user) throw new Error('user not found');
    await user.updateProfile({ email: 'new@example.com', password: 'newpass' });
    const updated = await User.findOne({ username: 'testuser' });
    expect(updated).not.toBeNull();
    if (!updated) throw new Error('updated user not found');
    expect(updated.email).toBe('new@example.com');
    expect(updated.password).toBe('newpass');
  });

  it('validateProfileでバリデーションエラーを検出できる', async () => {
    const user = await User.findOne({ username: 'testuser' });
    expect(user).not.toBeNull();
    if (!user) throw new Error('user not found');
    const result = user.validateProfile({ email: '' });
    expect(result.success).toBe(false);
    expect(result.error).toBe('メールアドレスは必須です');
  });
});
