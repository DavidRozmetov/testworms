import React, { useState } from "react";
import styled, { css } from "styled-components";

interface AlertProps {
  children?: React.ReactNode;
  type: string;
  message?: string;
}

const Alert: React.FC<AlertProps> = ({ children, type, message }) => {
  const [isShow, setIsShow] = useState(true);

  const renderElAlert = function () {
    return React.cloneElement(children as React.ReactElement, {
      role: "alert",
    });
  };

  const handleClose = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ): void => {
    e.preventDefault();
    setIsShow(false);
  };

  const AlertContainer = styled.div`
    padding: 20px;
    color: #fff;
    font-weight: bold;
    border-radius: 4px;
    margin-bottom: 20px;
    ${type === "success" &&
    css`
      background-color: #4caf50;
    `}
    ${type === "warning" &&
    css`
      background-color: #ff9800;
    `}
    ${type === "error" &&
    css`
      background-color: #f44336;
    `}
  `;

  return (
    <AlertContainer>
      <span className="closebtn" onClick={handleClose}>
        &times;
      </span>
      {children ? renderElAlert() : message}
    </AlertContainer>
  );
};

export default Alert;
