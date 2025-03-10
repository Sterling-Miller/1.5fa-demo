import { auth, signOut } from 'app/auth';
import QRScanner from 'app/qrReader';
import Navbar from '../navbar';
import VerifyToken from './verifyToken';
import { SessionProvider } from 'next-auth/react';

export default async function ProtectedPage() {
  let session = await auth();
  let currentUser = session?.user?.email ?? 'Guest';

  return (
    <div className="flex h-screen w-screen bg-slate-900 ">
      <div className="flex flex-col space-y-5 justify-center items-center text-white w-full h-full">
        <Navbar currentUser={currentUser ?? ''} onSignOut={signOut} />
        <QRScanner/>
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-white">
        You are logged in as {session?.user?.email}
        <SignOut />
        <SessionProvider session={session}>
          <VerifyToken />
        </SessionProvider>
      </div>
    </div>
  );
}