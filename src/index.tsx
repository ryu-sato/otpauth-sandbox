import React from 'react';
import { createRoot } from 'react-dom/client';
import UserCreateForm from './auth/UserCreateForm';

const root = createRoot(document.getElementById('root')!);
root.render(<UserCreateForm />);
