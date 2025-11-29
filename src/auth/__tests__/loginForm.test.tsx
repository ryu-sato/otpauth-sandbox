import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';

describe('LoginForm', () => {
  test('IDとパスワード入力欄が表示される', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText('ID')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
  });

  test('空欄でログインボタンを押すとエラーメッセージが表示される', () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    expect(screen.getByText('IDは必須です')).toBeInTheDocument();
    expect(screen.getByText('パスワードは必須です')).toBeInTheDocument();
  });

  test('ID・パスワード入力後にログインボタンを押すとエラーが消える', () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('ID'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    expect(screen.queryByText('IDは必須です')).not.toBeInTheDocument();
    expect(screen.queryByText('パスワードは必須です')).not.toBeInTheDocument();
  });
});
