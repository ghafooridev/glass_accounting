import clsx from "clsx";
import theme from "../../themes/default";

export const DeleteIcon = () => {
  return (
    <i
      className={clsx("material-icons-round")}
      style={{ color: theme.palette.danger.main }}
    >
      clear
    </i>
  );
};

export const EditIcon = () => {
  return (
    <i
      className={clsx("material-icons-round")}
      style={{ color: theme.palette.primary.main }}
    >
      edit
    </i>
  );
};
