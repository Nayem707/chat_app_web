import { useSelector, useDispatch } from "react-redux";
import { selectTheme, setTheme } from "@/features/settings/settingsSlice";

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const changeTheme = (newTheme) => dispatch(setTheme(newTheme));
  return { theme, changeTheme };
};
