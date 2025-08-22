'use server';

import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient';

export default async function Page() {
  const cookieStore = await cookies();
  const pbAuth = cookieStore.get('pb_auth');
  
  if (!pbAuth) {
    return <div>Not authenticated</div>;
  }
  
  let model;
  try {
    model = JSON.parse(pbAuth.value).model;
  } catch (error) {
    console.error('Failed to parse auth cookie:', error);
    return <div>Authentication error</div>;
  }

  return <DashboardClient model={model} />;
}
