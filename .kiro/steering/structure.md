# 構造指針

本プロジェクトは、機能単位・責務分離を重視したディレクトリ構成と命名規則を採用します。

## 構成パターン
- `src/`配下にフロント・バックエンドの主要機能を配置
- 認証機能は`auth/`ディレクトリに集約
- サービス・モデル・DTOは分離

## 命名規則
- 機能名+役割（例: `authService.ts`, `userModel.ts`）
- 型定義・DTOは`types/`に集約

## 例
```
src/
  auth/
    authService.ts
    authController.ts
    types/
      authError.ts
  user/
    userModel.ts
```
