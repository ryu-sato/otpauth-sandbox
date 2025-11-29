import { TOTPService } from '../totpService';
describe('TOTPService シークレット保存', () => {
  it('TOTPシークレットをDBに安全に保存できる', async () => {
    const service = new TOTPService();
    const userId = 'saveuser';
    const secret = 'SECRET123';
    // DBモック
    const db = {
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockid' }),
        findOne: jest.fn().mockResolvedValue({ userId, secret }),
      }),
    };
    await service.saveSecret(userId, secret, db);
    const found = await db.collection('totpSecrets').findOne({ userId });
    expect(found).not.toBeNull();
    expect(found.secret).toBe(secret);
  });
});
