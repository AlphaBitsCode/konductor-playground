import { cookies } from "next/headers";
import { logout } from "../actions";
import Link from "next/link";

export default async function Page() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("pb_auth");

  if (!cookie) throw new Error("Not logged in");

  const { model } = JSON.parse(cookie.value);

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-2">
            <Link
              href="/playground"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Open Playground
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            User Information
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(model, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
