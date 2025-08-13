'use client';

import { useParams, useSearchParams } from 'next/navigation';
import PersonalizeStart from '../../../componets/personalize/PersonalizeStart';
export default function PersonalizePage() {
  const { slug } = useParams();
  const search = useSearchParams();
  const initialLang = search.get('lang') || 'en';

  // If you want, pass props (and read them in the component)
  return <PersonalizeStart slug={slug} initialLanguage={initialLang} />;
}
