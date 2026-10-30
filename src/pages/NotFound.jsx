import { Link, useRouteError } from "react-router-dom";

const NotFound = () => {
  const error = useRouteError();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-gray-600">
        {error?.statusText || "Page not found"}
      </p>
      <Link
        to="/"
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;