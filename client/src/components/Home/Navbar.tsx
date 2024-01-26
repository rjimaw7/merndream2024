import { Input } from "../ui/input";
import CustomSwitch from "./CustomSwitch";
import { CloudSun, MoonStar } from "lucide-react";
import { useTheme } from "../theme-provider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { setSearchQuery } from "@/redux/features/dreams/dreamSlice";

const Navbar = () => {
  const { theme } = useTheme();

  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state: RootState) => state.dreams);

  return (
    // <header className="flex justify-between items-center py-3 px-12 sticky top-0 z-50 backdrop-blur">
    <header className="flex justify-between items-center py-4 md:py-3 md:px-12 sticky top-0 z-50 backdrop-blur">
      <div>
        {theme === "light" ? <CloudSun size={32} /> : <MoonStar size={32} />}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="Search Dreams"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
        <CustomSwitch />
      </div>
    </header>
  );
};

export default Navbar;
