import React from "react";

const LoadingButton = (props) => {
  const { isLoading, disabled, ...buttonProps } = props;
  console.log(buttonProps);
  console.log(disabled);
  return (
    <button disabled={isLoading || disabled} {...buttonProps}>
      {isLoading && (
        <span className="spinner-border spinner-border-sm" role="status"></span>
      )}{" "}
      {props.children}
    </button>
  );
};

export default LoadingButton;
