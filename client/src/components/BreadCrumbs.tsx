import { Link, useLocation } from "react-router";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-white text-md font-secondary font-semibold">
      <ul className="flex space-x-2">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        {pathnames.length > 0 && <span>/</span>}
        {pathnames[0] === "adopt" && pathnames[1] === "pets" ? (
          <>
            <li>
              <Link to="/adopt" className="hover:underline">
                Adopt
              </Link>
            </li>
            <span>/</span>
            <li className="underline">Pet Details</li>
          </>
        ) : (
          pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;

            return (
              <li key={routeTo} className="flex items-center">
                {!isLast ? (
                  <>
                    <Link to={routeTo} className="underline capitalize">
                      {decodeURIComponent(name)}
                    </Link>
                    <span className="mx-2">/</span>
                  </>
                ) : (
                  <span className="underline capitalize">
                    {decodeURIComponent(name)}
                  </span>
                )}
              </li>
            );
          })
        )}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
