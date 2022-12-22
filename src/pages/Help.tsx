import React, { useState } from "react";
import "../scss/help.scss";

const Help: React.FC = () => {
  const [collapsed, setCollapsed] = useState([true, true]); // Initially, both FAQs are collapsed

  return (
    <div className="help-page">
      <h1>Help</h1>
      <h2>Frequently Asked Questions</h2>
      <ul>
        <li>
          <button onClick={() => setCollapsed([!collapsed[0], collapsed[1]])}>
            {collapsed[0] ? "+" : "-"} How do I reset my password?
          </button>
          {!collapsed[0] && (
            <p>
              To reset your password, click on the "Forgot Password" link on the
              login page and follow the prompts.
            </p>
          )}
        </li>
        <li>
          <button onClick={() => setCollapsed([collapsed[0], !collapsed[1]])}>
            {collapsed[1] ? "+" : "-"} How do I contact customer support?
          </button>
          {!collapsed[1] && (
            <p>
              You can contact customer support by sending an email to
              support@example.com or by calling 1-800-123-4567.
            </p>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Help;
