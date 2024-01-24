import ReactSVG from "@/assets/react.svg";
import { Input } from "../ui/input";
import CustomSwitch from "./CustomSwitch";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center py-3 px-12">
      <div>
        <img src={ReactSVG} alt="headerlogo" />
      </div>
      <div className="flex items-center gap-2">
        <Input type="search" placeholder="Search Dreams" />
        <CustomSwitch />
      </div>
    </header>
  );
};

export default Navbar;
