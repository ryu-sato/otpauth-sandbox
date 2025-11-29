# Research & Design Decisions Template

---
**Purpose**: TOTP二要素認証の設計に必要な技術・アーキテクチャ・既存パターンの調査結果を記録する。

## Summary
- **Feature**: totp-auth
- **Discovery Scope**: New Feature
- **Key Findings**:
  - 既存認証機能は `authService.ts` を中心に TypeScript/Node.js で実装されている
  - TOTPシークレット生成・QR表示は外部ライブラリ（例: speakeasy, otplib）が推奨される
  - バックアップコード・リカバリはDB設計と本人確認フローの追加が必要

## Research Log

### TOTPライブラリ選定
- **Context**: TOTP生成・検証の信頼性・互換性
- **Sources Consulted**: speakeasy, otplib, RFC6238, Google Authenticator docs
- **Findings**:
  - speakeasy/otplibはNode.js/TypeScriptで広く利用されている
  - QRコード生成は qrcode ライブラリが定番
- **Implications**: サーバー側でTOTPシークレット生成・QRコード出力を担う

### バックアップコード設計
- **Context**: TOTP紛失時のリカバリ手段
- **Sources Consulted**: GitHub, Google, Slackの2FA設計
- **Findings**:
  - ランダムな一時コードを複数発行し、使い捨てで管理
  - DBにハッシュ化して保存
- **Implications**: バックアップコード生成・管理APIが必要

### 管理・監査ログ
- **Context**: TOTP利用状況の可視化
- **Sources Consulted**: 監査ログ設計ベストプラクティス
- **Findings**:
  - 認証失敗・リカバリ・TOTP有効化イベントを記録
- **Implications**: ログ集約・管理画面への統合が必要

## Architecture Pattern Evaluation
| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| サービス分割 | 認証・TOTP・管理をサービス単位で分離 | 責任明確・拡張容易 | 境界設計・API連携が必要 | 既存MVCパターンと整合 |
| Hexagonal | ポート/アダプタで外部依存を抽象化 | テスト容易・拡張性 | 実装コスト増 | TOTP/QR/DB連携に有効 |

## Design Decisions
### Decision: TOTP認証機能の追加方式
- **Context**: 既存認証サービスへのTOTP拡張
- **Alternatives Considered**:
  1. authService.tsにTOTP機能を直接追加
  2. TOTP専用サービス/モジュールを分離
- **Selected Approach**: TOTP専用サービス/モジュール分離
- **Rationale**: 責任分離・テスト容易・将来の認証方式追加に備える
- **Trade-offs**: 既存認証との連携API設計が必要
- **Follow-up**: API設計・型定義・DBスキーマの詳細化
