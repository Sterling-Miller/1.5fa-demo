import { auth, signOut } from 'app/auth';
import QRScanner from 'app/qrReader';
import Navbar from '../navbar';

export default async function ProtectedPage() {
  let session = await auth();

  return (
    <div className="flex h-screen w-screen bg-slate-900 ">
      <div className="flex flex-col space-y-5 justify-center items-center text-white w-full h-full">
        <Navbar currentUser={session?.user?.email} onSignOut={signOut} />
        <QRScanner/>
      </div>
    </div>
  );
}