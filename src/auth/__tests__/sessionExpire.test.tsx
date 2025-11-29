import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';

jest.useFakeTimers();

describe('セッション切れ時の処理', () => {
  test('認証後30分経過でログイン画面に戻る', () => {
    render(<LoginForm />);
  fireEvent.change(screen.getByLabelText('ユーザーID'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByLabelText('パスワード'), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: 'ログイン' }));
    expect(screen.getByText('ようこそ, user1')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(30 * 60 * 1000);
    });
  expect(screen.getByLabelText('ユーザーID')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
  });
});
