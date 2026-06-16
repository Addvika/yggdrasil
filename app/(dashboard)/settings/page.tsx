'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SettingsPage() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    if (signingOut) return;

    try {
      setSigningOut(true);
      await signOut();
      router.replace('/login');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <button
        type="button"
        onClick={handleLogout}
        disabled={signingOut}
        className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {signingOut ? 'Signing out...' : 'Log Out'}
      </button>
    </div>
  );
}
