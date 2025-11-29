# Research & Design Decisions Template

---
**Purpose**: パスワード認証機能の設計に必要な技術調査・アーキテクチャ検討・リスク評価を記録します。
---

## Summary
- **Feature**: password-auth
- **Discovery Scope**: 新規機能（Full Discovery）
- **Key Findings**:
  - Web標準の認証パターン（MVC+サービス分離）が推奨される
  - パスワードはハッシュ化保存が必須（OWASP推奨）
  - セッション管理はHTTP CookieまたはJWTが主流

## Research Log
### 認証アーキテクチャ
- **Context**: 安全な認証方式の選定
- **Sources Consulted**: OWASP, RFC6749, WebAuthn, GitHub実装例
- **Findings**: サーバー側でパスワードハッシュ化、セッションはCookie/JWTで管理
- **Implications**: 実装時は外部ライブラリ利用推奨

### UI/UXパターン
- **Context**: ログイン画面の標準UI
- **Sources Consulted**: Google Material Design, GitHubログイン画面
- **Findings**: 入力欄・エラー表示・パスワード非表示切替
- **Implications**: ユーザー体験向上のためUI標準化

### セキュリティリスク
- **Context**: パスワード流出・ブルートフォース攻撃
- **Sources Consulted**: OWASP Top 10, IPA
- **Findings**: ロック機能・エラーメッセージ汎用化・パスワード平文保存禁止
- **Implications**: 実装時に必須対策

## Architecture Pattern Evaluation
| Option      | Description                | Strengths         | Risks / Limitations         | Notes |
|-------------|----------------------------|-------------------|-----------------------------|-------|
| MVC+Service | UI/ロジック/認証サービス分離 | 保守性・拡張性高い | 境界設計が必要              | Web標準推奨 |
| Hexagonal   | ポート・アダプタ分離        | テスト容易         | 小規模では過剰              | 拡張時に有効 |

## Design Decisions
### Decision: パスワード保存方式
- **Context**: ユーザー情報の安全管理
- **Alternatives Considered**:
  1. 平文保存
  2. ハッシュ化保存
- **Selected Approach**: ハッシュ化保存
- **Rationale**: OWASP推奨、法令遵守
- **Trade-offs**: 実装複雑化
- **Follow-up**: ライブラリ選定

### Decision: セッション管理
- **Context**: 認証後の状態保持
- **Alternatives Considered**:
  1. Cookie
  2. JWT
- **Selected Approach**: Cookie（小規模向け）
- **Rationale**: 実装容易、セキュリティ担保
- **Trade-offs**: 拡張時はJWT検討
- **Follow-up**: 有効期限・セキュリティ属性設定

## Risks & Mitigations
- パスワード流出 → ハッシュ化・SSL必須
- セッション乗っ取り → Cookie属性強化
- ロック誤作動 → 管理画面で解除機能

## References
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [RFC6749 OAuth2](https://datatracker.ietf.org/doc/html/rfc6749)
- [WebAuthn Guide](https://webauthn.guide/)
- [Google Material Design](https://material.io/design/components/text-fields.html)
