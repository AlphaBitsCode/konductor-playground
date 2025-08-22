'use server';

import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient';

export default async function Page() {
  const cookie = cookies().get('pb_auth');
  
  if (!cookie) {
    return <div>Not authenticated</div>;
  }
  
  let model;
  try {
    model = JSON.parse(cookie.value).model;
  } catch (error) {
    console.error('Failed to parse auth cookie:', error);
    return <div>Authentication error</div>;
  }

  return <DashboardClient model={model} />;
}
