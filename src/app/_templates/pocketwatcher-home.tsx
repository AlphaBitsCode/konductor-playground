"use client";

import Link from "next/link";
import type { ComponentProps, JSX } from "react";

// Icon Components
function NextjsIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.049-.106.005-4.703.007-4.705.073-.091a.637.637 0 0 1 .174-.143c.096-.047.134-.052.54-.052.479 0 .558.019.683.155a466.83 466.83 0 0 1 2.895 4.361c1.558 2.362 3.687 5.587 4.734 7.171l1.9 2.878.096-.063a12.317 12.317 0 0 0 2.465-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
    </svg>
  );
}

function DatabaseIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
      />
    </svg>
  );
}

function PaintBrushIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
      />
    </svg>
  );
}

function LockClosedIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function CodeBracketIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
      />
    </svg>
  );
}

function BoltIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  );
}

function GithubIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2z"
      />
    </svg>
  );
}

// Types
interface TechStackItem {
  name: string;
  description: string;
  icon: (props: ComponentProps<"svg">) => JSX.Element;
  features: string[];
}

interface FeatureItem {
  name: string;
  description: string;
  icon: (props: ComponentProps<"svg">) => JSX.Element;
}

// Data
const techStack: TechStackItem[] = [
  {
    name: "Next.js 14",
    description:
      "The React framework for production, featuring server components, app router, and streaming with suspense.",
    icon: NextjsIcon,
    features: ["React Server Components", "App Router", "Server Actions"],
  },
  {
    name: "PocketBase",
    description:
      "Open source backend in a single binary, with built-in database, authentication, and real-time subscriptions.",
    icon: DatabaseIcon,
    features: ["SQLite", "Real-time", "Auth", "File Storage"],
  },
  {
    name: "Modern UI",
    description:
      "Beautiful, responsive UI with Tailwind CSS and shadcn/ui components. Dark mode support and accessibility built-in.",
    icon: PaintBrushIcon,
    features: ["Tailwind CSS", "shadcn/ui", "TypeScript"],
  },
];

const features: FeatureItem[] = [
  {
    name: "Authentication Ready",
    description:
      "Complete authentication system with email/password, OAuth providers, and role-based access control.",
    icon: LockClosedIcon,
  },
  {
    name: "Type Safety",
    description:
      "End-to-end type safety with TypeScript, including API routes, database schema, and UI components.",
    icon: CodeBracketIcon,
  },
  {
    name: "Real-time Features",
    description:
      "Built-in support for real-time updates using PocketBase's subscription system.",
    icon: BoltIcon,
  },
];

// Main Component
export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-xl fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-blue-600 flex items-center gap-2"
              >
                <DatabaseIcon className="h-6 w-6" />
                PocketWatcher
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="https://github.com/yourusername/pocketwatcher"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium flex items-center"
              >
                <GithubIcon className="w-5 h-5 mr-2" />
                GitHub
              </Link>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative isolate">
          {/* Background gradient */}
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-indigo-300 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-6 pt-32 sm:pt-40 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 text-blue-600 font-semibold mb-6 bg-blue-50 w-fit px-4 py-2 rounded-full">
                  <CodeBracketIcon className="h-5 w-5" />
                  <span>Next.js + PocketBase Template</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Modern Stack for{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Full-Stack Apps
                  </span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  A production-ready template combining Next.js 14, PocketBase,
                  and TailwindCSS. Build and deploy full-stack applications with
                  real-time features, authentication, and beautiful UI
                  components.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    href="/register"
                    className="bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Start Building
                    <BoltIcon className="h-5 w-5" />
                  </Link>
                  <Link
                    href="#stack"
                    className="text-lg font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors group flex items-center gap-1"
                  >
                    View Stack{" "}
                    <span
                      className="group-hover:translate-x-0.5 transition-transform duration-150"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                </div>
                <div className="mt-10 flex items-center gap-4 pt-8 border-t">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                        style={{
                          background: `hsl(${210 + i * 20}, 100%, ${
                            70 - i * 5
                          }%)`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Join <span className="font-semibold">2,000+</span>{" "}
                    developers building with PocketWatcher
                  </div>
                </div>
              </div>
              <div className="hidden lg:block lg:col-span-5 lg:relative">
                <div className="mt-8 rounded-2xl bg-gray-900/5 p-4 ring-1 ring-inset ring-gray-900/10 lg:rounded-3xl lg:p-8">
                  <pre className="text-sm leading-6 text-gray-700">
                    <code>{`// Example API route with PocketBase
export async function GET() {
  const pb = new PocketBase();
  
  const records = await pb.collection('posts')
    .getList(1, 20, {
      sort: '-created',
      expand: 'author'
    });

  return NextResponse.json(records);
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div id="stack" className="py-24 sm:py-32 bg-gray-50/70">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="inline-flex items-center gap-2 text-base font-semibold leading-7 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                <DatabaseIcon className="h-5 w-5" />
                Modern Tech Stack
              </h2>
              <p className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Built with the Latest Technologies
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                A carefully selected stack that provides the perfect balance of
                developer experience, performance, and scalability.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex flex-col bg-white p-8 rounded-3xl shadow-sm ring-1 ring-gray-200 hover:ring-blue-500 transition-all duration-200 group"
                  >
                    <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                      <tech.icon
                        className="h-7 w-7 flex-none text-blue-600 group-hover:scale-110 transition-transform duration-200"
                        aria-hidden="true"
                      />
                      {tech.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{tech.description}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {tech.features.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="inline-flex items-center gap-2 text-base font-semibold leading-7 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                <BoltIcon className="h-5 w-5" />
                Developer Experience
              </h2>
              <p className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything You Need to Build Fast
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Start with a solid foundation and focus on building your unique
                features. We&apos;ve handled the boilerplate.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-4 text-base leading-7 text-gray-600">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link
              href="https://github.com/yourusername/pocketwatcher"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500 flex items-center gap-2"
            >
              <GithubIcon className="h-5 w-5" />
              GitHub
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-gray-500 flex items-center gap-2"
            >
              <CodeBracketIcon className="h-5 w-5" />
              Documentation
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} PocketWatcher. MIT License.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
