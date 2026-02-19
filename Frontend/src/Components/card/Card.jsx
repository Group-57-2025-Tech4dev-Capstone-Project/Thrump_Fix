import clsx from "clsx";
import "./Card.css";

export const Card = ({
  children,
  variant = "default",
  className,
  hover = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "card",
        `card-${variant}`,
        hover && "card-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
