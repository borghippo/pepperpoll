import Link from "next/link";

const Header: React.FC = () => {
  return (
    (
      <div className="navbar">
        <div className="flex-1">
          <Link href="/">
            <a className="btn btn-ghost normal-case text-xl">Pepper Poll</a>
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal p-0">
            <Link href="/api/auth/logout">
              <a className="btn btn-ghost">Logout</a>
            </Link>
          </ul>
        </div>
      </div>
    )
  );
};

export default Header;
