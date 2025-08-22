'use server';

import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient';

export default async function Page() {
  const cookieStore = cookies();
  const cookie = cookieStore.get('pb_auth');
  
  if (!cookie) {
    return <div>Not authenticated</div>;
  }
  
  const { model } = JSON.parse(cookie.value);

  return <DashboardClient model={model} />;
}
