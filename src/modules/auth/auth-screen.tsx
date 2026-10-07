"use client";
import Link from "next/link";
import Image from "next/image";
import forestBackground from "../../../public/images/login-forest.jpg";
import { Eye, EyeOff, Sprout } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  inMemoryPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { browserAuth, firebaseEnabled } from "@/lib/firebase/client";
import { authenticatedFetch } from "@/lib/firebase/cloud-client";
type Mode = "login" | "register" | "forgot";
function authMessage(cause: unknown) {
  const code =
    typeof cause === "object" && cause !== null && "code" in cause
      ? String(cause.code)
      : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email hoặc mật khẩu chưa đúng.";
    case "auth/email-already-in-use":
      return "Email này đã có tài khoản. Hãy đăng nhập hoặc đặt lại mật khẩu.";
    case "auth/weak-password":
      return "Mật khẩu chưa đáp ứng chính sách bảo mật của dự án Firebase.";
    case "auth/too-many-requests":
      return "Có quá nhiều lần thử. Vui lòng chờ rồi thử lại.";
    case "auth/network-request-failed":
      return "Không kết nối được dịch vụ đăng nhập. Kiểm tra mạng rồi thử lại.";
    case "auth/operation-not-allowed":
      return "Cần bật Email/Password trong Firebase Authentication.";
    case "auth/user-disabled":
      return "Tài khoản đã bị vô hiệu hóa.";
    case "auth/unauthorized-domain":
      return "Tên miền này chưa được cho phép trong Firebase Authentication.";
    default:
      return !code && cause instanceof Error
        ? cause.message
        : "Chưa đăng nhập được. Kiểm tra cấu hình Firebase rồi thử lại.";
  }
}
export function AuthScreen({ mode }: { mode: Mode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [remember, setRemember] = useState(true);
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const title =
    mode === "register"
      ? "Tạo tài khoản"
      : mode === "forgot"
        ? "Quên mật khẩu"
        : "Đăng nhập";
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending || !firebaseEnabled) return;
    setError("");
    setMessage("");
    if (mode === "register" && !name.trim()) {
      setError("Nhập tên hiển thị.");
      return;
    }
    if (mode === "register" && password !== confirmation) {
      setError("Hai mật khẩu chưa khớp.");
      return;
    }
    setPending(true);
    try {
      const auth = browserAuth();
      await setPersistence(auth, inMemoryPersistence);
      auth.languageCode = "vi";
      if (mode === "forgot") {
        try {
          await sendPasswordResetEmail(auth, email.trim());
        } catch (cause) {
          if (!(
            typeof cause === "object" &&
            cause &&
            "code" in cause &&
            cause.code === "auth/user-not-found"
          ))
            throw cause;
        }
        setMessage(
          "Nếu email có tài khoản, bạn sẽ nhận được liên kết đặt lại mật khẩu. Hãy kiểm tra cả thư rác.",
        );
        return;
      }
      // Retry login if registration succeeded but the server was unavailable.
      const credential =
        mode === "register" && !created
          ? await createUserWithEmailAndPassword(auth, email.trim(), password)
          : await signInWithEmailAndPassword(auth, email.trim(), password);
      if (mode === "register") {
        setCreated(true);
        await updateProfile(credential.user, { displayName: name.trim() });
      }
      await authenticatedFetch("/api/auth", {
        idToken: await credential.user.getIdToken(true),
        remember,
      });
      await signOut(auth);
      window.location.assign("/dashboard");
    } catch (cause) {
      setError(authMessage(cause));
    } finally {
      setPending(false);
    }
  }
  return (
    <main className="auth-page">
      <Image
        className="auth-background"
        src={forestBackground}
        alt=""
        fill
        priority
        sizes="(max-width: 650px) 160vh, 100vw"
        quality={85}
        placeholder="blur"
      />
      <div className="auth-brand">
        <Sprout size={27} aria-hidden="true" />
        <span>
          myos<span>.</span>
        </span>
      </div>
      <section className="auth-card" aria-labelledby="auth-title">
        <h1 id="auth-title">{title}</h1>
        {!firebaseEnabled && <p>Chưa bật xác thực — chế độ local</p>}
        <form onSubmit={(event) => void submit(event)}>
          <fieldset disabled={pending || !firebaseEnabled}>
            {mode === "register" && (
              <label>
                Tên hiển thị
                <input
                  autoComplete="name"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                autoComplete="username"
                required
                maxLength={254}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setCreated(false);
                }}
                placeholder="ban@example.com"
              />
            </label>
            {mode !== "forgot" && (
              <label>
                Mật khẩu
                <div className="auth-password">
                  <input
                    type={visible ? "text" : "password"}
                    autoComplete={
                      mode === "register" ? "new-password" : "current-password"
                    }
                    minLength={mode === "register" ? 8 : undefined}
                    maxLength={128}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </label>
            )}
            {mode === "register" && (
              <label>
                Nhập lại mật khẩu
                <input
                  type={visible ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                />
              </label>
            )}
            {mode === "login" && (
              <div className="auth-options">
                <label>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Ghi nhớ đăng nhập
                </label>
                <Link href="/forgot-password">Quên mật khẩu?</Link>
              </div>
            )}
            {error && (
              <p className="auth-error" role="alert">
                {created ? "Tài khoản đã được tạo. " : ""}
                {error}
              </p>
            )}
            {message && (
              <p className="auth-success" role="status">
                {message}
              </p>
            )}
            <button className="button primary auth-submit" type="submit">
              {pending
                ? "Đang xử lý…"
                : mode === "forgot"
                  ? "Gửi liên kết đặt lại"
                  : created
                    ? "Thử đăng nhập lại"
                    : title}
            </button>
          </fieldset>
        </form>
        <p className="auth-footer">
          {mode === "login" ? (
            <>
              Chưa có tài khoản? <Link href="/register">Đăng ký</Link>
            </>
          ) : (
            <Link href="/login">Về trang đăng nhập</Link>
          )}
        </p>
        {!firebaseEnabled && <Link href="/dashboard">Về Tổng quan</Link>}
      </section>
    </main>
  );
}
