import { NavLink } from "react-router-dom";

interface ComponentTitleProps {
  pageName: string;
  button?:string
  link?: string
}
const ComponentTitle = ({ pageName , button , link}: ComponentTitleProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold !text-black dark:text-white">
        {pageName}
      </h2>
      <NavLink to={link as string}>
      {button}
      </NavLink>
    </div>
  );
};

export default ComponentTitle;
