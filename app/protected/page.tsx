import { auth } from "app/auth";
import { handleSignOut } from "./serverActions";

export default async function ProtectedPage() {
  let session = await auth();

  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-white">
        You are logged in as {session?.user?.email}
        <form action={handleSignOut}>
          <button type="submit">Sign Out</button>
        </form>
      </div>
    </div>
  );
}
