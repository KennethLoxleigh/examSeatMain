import { useState } from "react";
import styles from "./LoginModal.module.css";

export default function LoginModal({ role, onClose, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onLogin({ role, username, password });

    if (result.ok) {
      setMsg("");
      onClose();
    } else {
      setMsg(result.message);
    }
  };

  const title =
    role === "admin"
      ? "Admin Login"
      : role === "student"
      ? "Student Login"
      : "Invigilator Login";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.top}>
          <h3>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoFocus
            />
          </label>

          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              type="password"
            />
          </label>

          {msg && <p className={styles.error}>{msg}</p>}

          <button className={styles.loginBtn} type="submit">
            Log In
          </button>
        </form>

        <p className={styles.hint}>
          Demo creds: <br />
          admin / admin123 <br />
          student / student123 <br />
          invigilator / inv123
        </p>
      </div>
    </div>
  );
}