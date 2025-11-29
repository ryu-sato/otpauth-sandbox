# Requirements Document

## Project Description (Input)
TOTPによる2要素認証

## Requirements
<!-- Will be generated in /kiro:spec-requirements phase -->
## Requirements

### 1. TOTP登録・セットアップ
**Objective:** ユーザーが自身のアカウントにTOTP認証を追加できるようにする

#### Acceptance Criteria
1. When ユーザーがTOTPセットアップ画面を開いたとき, the 認証サービス shall TOTPシークレットを生成しQRコードを表示する
2. If ユーザーがTOTPセットアップを完了した場合, the 認証サービス shall TOTPシークレットを安全に保存する
3. If TOTPセットアップ中にエラーが発生した場合, the 認証サービス shall 適切なエラーメッセージを表示する

### 2. TOTP認証フロー
**Objective:** ログイン時にTOTP認証を必須とし、セキュリティを強化する

#### Acceptance Criteria
1. When ユーザーがログイン認証（ID/パスワード）に成功したとき, the 認証サービス shall TOTPコード入力画面を表示する
2. If ユーザーが有効なTOTPコードを入力した場合, the 認証サービス shall ログインを完了しセッションを開始する
3. If ユーザーが無効なTOTPコードを入力した場合, the 認証サービス shall エラーメッセージを表示し再入力を促す
4. If TOTP認証に複数回失敗した場合, the 認証サービス shall アカウントロックまたは追加対策を実施する

### 3. バックアップ・リカバリ
**Objective:** TOTP紛失時のリカバリ手段を提供し、ユーザー体験を損なわない

#### Acceptance Criteria
1. When ユーザーがTOTPセットアップを完了した際、the 認証サービス shall バックアップコードをユーザーへ表示する
2. If ユーザーがバックアップコードを記録したと申告した場合, the 認証サービス shall バックアップコードのハッシュ値を保存する
3. If ユーザーが有効なバックアップコードを入力した場合, the 認証サービス shall TOTPを無効化して再登録画面を促す
4. If ユーザーが有効なバックアップコードを入力した場合, the 認証サービス shall 使用されたバックアップコードを無効化する
5. If ユーザーが有効なバックアップコードを入力した場合, the 認証サービス shall リカバリを拒否しエラーメッセージを表示する

### 4. 管理・監査
**Objective:** 管理者がTOTP利用状況を監査できるようにする

#### Acceptance Criteria
1. The 管理サービス shall TOTP有効ユーザー数・認証失敗回数などの統計情報を取得できる
2. When 管理者が監査ログを要求したとき, the 管理サービス shall TOTP関連イベントのログを表示する
