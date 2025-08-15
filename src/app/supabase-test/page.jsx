'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SupabaseTest() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(() => setOk(true)).catch(() => setOk(false));
  }, []);
  return (
    <div style={{ padding: 24 }}>
      <h1>Supabase connection: {ok ? 'OK ✅' : 'Not ready'}</h1>
    </div>
  );
}
