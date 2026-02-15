import { redirect } from 'next/navigation';
import { checkUsersExist } from '@/app/lib/setup-actions';

export default async function Home() {
  const hasUsers = await checkUsersExist();

  if (!hasUsers) {
    redirect('/setup');
  } else {
    redirect('/dashboard');
  }
}
