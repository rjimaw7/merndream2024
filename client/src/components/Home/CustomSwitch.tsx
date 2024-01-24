import Switch from "react-switch";
import { SunDim, Moon } from "lucide-react";
import { useTheme } from "../theme-provider";
import { useState } from "react";

const CustomSwitch = () => {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);

  const handleChange = (checked: boolean) => {
    console.log(checked);
    setTheme(theme === "dark" ? "light" : "dark");
    setChecked(checked);
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      uncheckedIcon={false}
      onColor="#ebebef"
      offColor="#888888"
      checkedIcon={false}
      uncheckedHandleIcon={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "black",
            backgroundColor: "white",
            fontSize: 18,
            borderRadius: "18px",
          }}
        >
          <SunDim />
        </div>
      }
      checkedHandleIcon={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "white",
            backgroundColor: "black",
            fontSize: 18,
            borderRadius: "18px",
          }}
        >
          <Moon />
        </div>
      }
    />
  );
};

export default CustomSwitch;
