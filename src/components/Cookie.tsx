import React from "react";

type Props = {
  onClick: () => void;
};

const Cookie: React.FC<Props> = ({ onClick }) => (
  <div
    onClick={onClick}
    className="cookie cursor-pointer text-9xl p-10 select-none"
  >
    🍪
  </div>
);

export default Cookie;
