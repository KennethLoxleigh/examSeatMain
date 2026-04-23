import { useState } from "react";
import styles from "./LoginModal.module.css";

export default function LoginModal({ role, onClose, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const isAdmin = role === "admin";

  const title =
    role === "admin"
      ? "Admin Login"
      : role === "student"
      ? "Student Login"
      : "Invigilator Login";

  const inputLabel =
  role === "student"
    ? "Roll Number"
    : role === "invigilator"
    ? "Invigilator Name"
    : "Username";

const inputPlaceholder =
  role === "student"
    ? "Enter roll number"
    : role === "invigilator"
    ? "Enter invigilator name"
    : "Enter username";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await onLogin(
      isAdmin
        ? { role, username, password }
        : { role, username }
    );

    if (result.ok) {
      setMsg("");
      onClose();
    } else {
      setMsg(result.message);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.top}>
          <h3>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            X
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            {inputLabel}
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={inputPlaceholder}
              autoFocus
            />
          </label>

          {isAdmin && (
            <label>
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                type="password"
              />
            </label>
          )}

          {msg && <p className={styles.error}>{msg}</p>}

          <button className={styles.loginBtn} type="submit">
            {isAdmin ? "Log In" : "Continue"}
          </button>
        </form>

        {isAdmin && (
          <p className={styles.hint}>
          </p>
        )}
      </div>
    </div>
  );
}