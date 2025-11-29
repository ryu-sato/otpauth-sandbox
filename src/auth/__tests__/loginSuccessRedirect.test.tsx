import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';

const mockOnSuccess = jest.fn();

describe('認証成功時の画面遷移', () => {
  beforeEach(() => {
    mockOnSuccess.mockClear();
  });

  test('認証成功でonSuccessが呼ばれる', () => {
    render(<LoginForm onSuccess={mockOnSuccess} />);
    fireEvent.change(screen.getByLabelText('ID'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  test('ユーザー名が画面に表示される', () => {
    render(<LoginForm onSuccess={mockOnSuccess} />);
    fireEvent.change(screen.getByLabelText('ID'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    // onSuccessでユーザー名表示を想定
    // ここではLoginFormのpropsでユーザー名表示をテスト
    expect(screen.getByText('ようこそ, user1')).toBeInTheDocument();
  });
});
