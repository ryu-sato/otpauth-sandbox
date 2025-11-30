import crypto from "crypto";

class AES {
    secretKey: Buffer;
    iv: Buffer;

    constructor() {
        this.secretKey = Buffer.from(process.env.AES_KEY || "invalid", "hex");
        this.iv = Buffer.alloc(16, 0); // 初期化ベクトル（IV）をゼロで初期化
    }

    // AES-256-GCM暗号化メソッド
    encrypt_256_gcm(data: string): string {
        const cipher = crypto.createCipheriv("aes-256-gcm", this.secretKey, this.iv);
        let encrypted = cipher.update(data, "utf8", "hex");
        encrypted += cipher.final("hex");
        const authTag = cipher.getAuthTag().toString("hex");
        return `${encrypted}:${authTag}`;
    }

    // AES-256-GCM復号化メソッド
    decrypt_256_gcm(encryptedData: string): string {
        const [encrypted, authTag] = encryptedData.split(":");
        const decipher = crypto.createDecipheriv("aes-256-gcm", this.secretKey, this.iv);
        decipher.setAuthTag(Buffer.from(authTag, "hex"));
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
}

export default AES;
