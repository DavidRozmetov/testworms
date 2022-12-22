import React, { useState } from "react";
import "../scss/account.scss";
export const Account: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [collapsed, setCollapsed] = useState([false, true, true]); // Initially, both FAQs are collapsed

  return (
    <div className="account-page">
      <h1>Account</h1>
      <form>
        <button
          onClick={(e) => {
            e.preventDefault();
            setCollapsed([!collapsed[0], true, true]);
          }}
          className="header-button"
        >
          <h2>{collapsed[0] ? "+" : "-"} Personal Details</h2>
        </button>
        {!collapsed[0] && (
          <div className="div-personal-details">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setCollapsed([true, !collapsed[1], true]);
          }}
          className="header-button"
        >
          <h2>{collapsed[1] ? "+" : "-"} Preferences</h2>
        </button>
        {!collapsed[1] && (
          <div className="div-preferences">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
            </select>
            <div className="checkbox-inputs">
              <label htmlFor="notifications" className="row-checkbox">
                <input
                  type="checkbox"
                  id="notifications"
                  name="notifications"
                  className="checkbox"
                  checked={notifications}
                  onChange={(event) => setNotifications(event.target.checked)}
                />
                Enable notifications
              </label>
              <label htmlFor="privacy" className="row-checkbox">
                <input
                  type="checkbox"
                  className="checkbox"
                  id="privacy"
                  name="privacy"
                  checked={privacy}
                  onChange={(event) => setPrivacy(event.target.checked)}
                />
                Enable privacy mode
              </label>
            </div>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setCollapsed([true, true, !collapsed[2]]);
          }}
          className="header-button"
        >
          <h2>{collapsed[2] ? "+" : "-"} Security</h2>
        </button>

        {!collapsed[2] && (
          <div className="security">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
        )}
        <button type="submit" className="btn-submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};
