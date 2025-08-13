'use client';
import { useEffect } from 'react';

export default function TestPokedataFetch() {
  useEffect(() => {
    const API_KEY = process.env.NEXT_PUBLIC_POKEDATA_API_KEY; // temp only

    fetch(
      'https://www.pokedata.io/v0/search?query=electrode&asset_type=CARD',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: 'application/json',
        },
      }
    )
      .then((r) => r.json())
      .then((data) => console.log('Result:', data))
      .catch((e) => console.log('error', e));
  }, []);

  return null;
}
