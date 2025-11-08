import React from "react";

const Title = ({ title, subTitle, align, font }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center ${
        align === "left" && "md:items-start md:text-left"
      } `}
    >
      <h1 className={`bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent text-4xl font-bold md:text-[4xl] ${font || "font-playfair"}`}>
        {title}
      </h1>
      <p className="text-lg md:text-base text-slate-600 mt-2 max-w-174">
        {subTitle}
      </p>
    </div>
  );
};

export default Title;
