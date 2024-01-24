import { Input } from "../ui/input";
import CustomSwitch from "./CustomSwitch";
import { CloudSun, MoonStar } from "lucide-react";
import { useTheme } from "../theme-provider";

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <header className="flex justify-between items-center py-3 px-12">
      <div>
        {theme === "light" ? <CloudSun size={32} /> : <MoonStar size={32} />}
      </div>
      <div className="flex items-center gap-2">
        <Input type="search" placeholder="Search Dreams" />
        <CustomSwitch />
      </div>
    </header>
  );
};

export default Navbar;
