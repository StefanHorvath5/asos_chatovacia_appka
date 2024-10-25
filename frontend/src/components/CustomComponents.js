import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import "../css/CustomComponents.css";

export const CustomLink = ({ className, ...rest }) => {
  const classes = `customLink ${className}`;
  return <Link className={classes} {...rest}></Link>;
};

export const InputContainer = ({ className, ...rest }) => {
  const classes = `inputContainer ${className}`;
  return <div className={classes} {...rest}></div>;
};

export const useClickAwayClose = (ref, close) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, close]);
};

export const ModalContainer = ({ className, matches768, close, ...rest }) => {
  const wrapperRef = useRef(null);
  useClickAwayClose(wrapperRef, close);

  const classes = `modalContainer ${className}`;
  return (
    <div
      ref={wrapperRef}
      className={classes}
      {...rest}
      style={{ width: matches768 ? "40%" : "90%" }}
    ></div>
  );
};

export const ModalNav = ({ className, ...rest }) => {
  const classes = `modalNav ${className}`;
  return <nav className={classes} {...rest}></nav>;
};

export const ModalContent = ({ className, ...rest }) => {
  const classes = `modalContent ${className}`;
  return <div className={classes} {...rest}></div>;
};

export const ModalButtons = ({ className, ...rest }) => {
  const classes = `modalButtons ${className}`;
  return <div className={classes} {...rest}></div>;
};
