import { Link } from "react-router";
import { FC } from "react";

interface ILogo {
  style?: string;
}
const Logo: FC<ILogo> = ({ style }) => {
  return (
    <Link to="/" data-testid="logo-nav">
      <div className={`flex pl-2 ${style}`}>
        <img
          src="/assets/img/Logo1.png"
          alt="logo"
          className="w-12 m-2 mr-3 max-sm:w-10 block"
        />
        <h1 className="text-3xl max-sm:text-2xl font-semibold text-orange-600 content-center font-primary">
          Pawtopia
        </h1>
      </div>
    </Link>
  );
};

export default Logo;
