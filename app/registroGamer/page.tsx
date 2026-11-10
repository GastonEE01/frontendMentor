"use client";
import { useEffect, useState } from "react";

import "./style.css";
import { InputAdornment, IconButton } from "@mui/material";

import Image from "next/image";
import logo from "./assets/images/logo.svg";
import alert from "./assets/images/icon-alert.svg";
import eye from "./assets/images/icon-eye.svg";
import eyeOff from "./assets/images/icon-eye-off.svg";
import check from "./assets/images/icon-hex-check.svg";
import tick from "./assets/images/icon-tick-16.svg";
import tick2 from "./assets/images/icon-tick-20.svg";
import backdrop from "./assets/images/pattern-backdrop.svg";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Typography,
  TextField,
  InputLabel,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [callsign, setCallsign] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState<"editing" | "submitting" | "success">(
    "editing",
  );
  const callsignValid = /^[a-zA-Z0-9_-]{3,20}$/.test(callsign);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;
  const confirmPasswordValid =
    confirmPassword.length > 0 && confirmPassword === password;
  const completedCount = [
    callsignValid,
    emailValid,
    passwordValid,
    confirmPasswordValid,
    acceptedTerms,
  ].filter(Boolean).length;
  const passwordStrength = password
    ? Math.max(
        1,
        [
          password.length >= 8,
          /[a-z]/.test(password) && /[A-Z]/.test(password),
          /\d/.test(password),
          /[^a-zA-Z0-9]/.test(password),
        ].filter(Boolean).length,
      )
    : 0;
  const passwordStrengthLabel = ["", "WEAK", "FAIR", "GOOD", "STRONG"][
    passwordStrength
  ];

  const callsignStatus =
    phase === "success"
      ? "LOCKED"
      : !callsign
        ? "PENDING"
        : callsign.length < 3
          ? "TOO SHORT"
          : callsign.length > 20
            ? "TOO LONG"
            : callsignValid
              ? "OK"
              : "BAD CHARACTER";

  const emailStatus =
    phase === "success"
      ? "LOCKED"
      : !email
        ? "PENDING"
        : emailValid
          ? "OK"
          : "MALFORMED";

  const passwordStatus =
    phase === "success"
      ? "LOCKED"
      : !password
        ? "PENDING"
        : !passwordValid
          ? "TOO SHORT"
          : "OK";

  const confirmPasswordStatus =
    phase === "success"
      ? "LOCKED"
      : !confirmPassword
        ? "PENDING"
        : confirmPasswordValid
          ? "OK"
          : "MISMATCH";

  const termsStatus =
    phase === "success" ? "LOCKED" : acceptedTerms ? "OK" : "REQUIRED";

  const getStatusColor = (status: string) => {
    if (status === "PENDING") return "var(--color-neutral-400)";
    if (["OK", "LOCKED", "FAIR", "GOOD", "STRONG"].includes(status)) {
      return "var(--color-neutral-100)";
    }
    if (status === "REQUIRED") {
      return submitted ? "var(--rojo)" : "var(--color-neutral-400)";
    }
    return "var(--rojo)";
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const isValid =
      callsignValid &&
      emailValid &&
      passwordValid &&
      confirmPasswordValid &&
      acceptedTerms;

    if (isValid) {
      setPhase("submitting");
    }
  };

  useEffect(() => {
    if (phase !== "submitting") return;

    const timer = window.setTimeout(() => setPhase("success"), 1000);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <Box
      className="registration-layout"
      sx={{
        bgcolor: "hsl(214 37% 4%)", // Neutral 950 del style-guide
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: { xs: "stretch", lg: "center" },
        flexDirection: { xs: "column", lg: "row" },
        p: { xs: 2, sm: 4 },
        gap: { xs: 4, lg: 6 },
      }}
    >
      {/* Columna Izquierda (Textos) */}
      <Box
        className="intro-column"
        sx={{ flex: 1, maxWidth: "600px", width: "100%" }}
      >
        <Box className="brand-row">
          <Image className="logo" src={logo} alt="Logo" />
        </Box>

        <Typography
          component="h1"
          variant="inherit"
          className="text-preset-1 hero-title"
        >
          Join the nexus
        </Typography>

        <Typography
          component="h2"
          variant="inherit"
          className="text-preset-4"
          sx={{ color: "var(--color-neutral-400)", mt: "2rem" }}
        >
          INITIALIZE YOUR NEONCORE IDENTITY
        </Typography>
        <span className="hero-divider" aria-hidden="true" />

        <Box className="operator-summary">
          <Box className="operator">
            <Typography
              component="h2"
              variant="inherit"
              className="text-preset-4 operator-id"
              sx={{ color: "var(--color-neutral-400)" }}
            >
              OPERATOR ID
            </Typography>
            <Typography
              component="h2"
              variant="inherit"
              className="text-preset-6 operator-ready"
              sx={{
                color:
                  phase === "success" || completedCount === 5
                    ? "var(--linea-amarilla)"
                    : "var(--color-neutral-400)",
              }}
            >
              {phase === "success" ? "PROVISIONED" : `${completedCount}/5 READY`}
            </Typography>
          </Box>

          <Typography
            component="h2"
            variant="inherit"
            className="text-preset-4 operator-callsign"
            sx={{ color: "var(--color-neutral-300)" }}
          >
            {callsign || "UNASSIGNED"}
          </Typography>

          <Box className="operator-status-list">
          <Box className="contentState">
            <Typography
              component="h3"
              variant="inherit"
              className="text-preset-5"
              sx={{ color: "var(--color-neutral-400)" }}
            >
              CALLSIGN
            </Typography>
            <span className="dots-line" />
            <Typography
              component="h3"
              variant="inherit"
              className="text-preset-5"
              sx={{ color: getStatusColor(callsignStatus) }}
            >
              {callsignStatus}
            </Typography>
          </Box>

          <Box className="contentState">
            <Typography
              component="h3"
              variant="inherit"
              className="text-preset-5"
              sx={{ color: "var(--color-neutral-400)" }}
            >
              EMAIL
            </Typography>
            <span className="dots-line" />
            <Typography
              component="h3"
              variant="inherit"
              className="text-preset-5"
              sx={{ color: getStatusColor(emailStatus) }}
            >
              {emailStatus}
            </Typography>
          </Box>

          <Box className="contentState">
            <Typography
              component="h3"
              variant="inherit"
              className="text-preset-5"
              sx={{ color: "var(--color-neutral-400)" }}
            >
              PASSWORD
            </Typography>
            <span className="dots-line" />
            <Typography
              component="h3"
              variant="inherit"
              className="text-preset-5"
              sx={{ color: getStatusColor(passwordStatus) }}
            >
              {passwordStatus}
            </Typography>
          </Box>

          <Box className="contentState">
            <Typography
              component="h3"
              variant="inherit"
              className="text-preset-5"
              sx={{ color: "var(--color-neutral-400)" }}
            >
              CONFIRM
            </Typography>
            <span className="dots-line" />
            <Typography
              component="h3"
              variant="inherit"
              className="text-preset-5"
              sx={{ color: getStatusColor(confirmPasswordStatus) }}
            >
              {confirmPasswordStatus}
            </Typography>
          </Box>

          <Box className="contentState">
            <Typography
              component="h3"
              variant="inherit"
              className="text-preset-5"
              sx={{ color: "var(--color-neutral-400)" }}
            >
              TERM
            </Typography>
            <span className="dots-line" />
            <Typography
              component="h3"
              variant="inherit"
              className="text-preset-5"
              sx={{ color: getStatusColor(termsStatus) }}
            >
              {termsStatus}
            </Typography>
          </Box>
          </Box>
        </Box>
      </Box>

      {/* Columna Derecha (Caja del Formulario) */}
      <Box className="registration-visual">
        <Box
          className={`registration-card${phase !== "editing" ? " registration-card-state" : ""}`}
          sx={{
            bgcolor: "hsl(210 39% 7%)", // Neutral 900
            p: 4,
            flex: 1,
            maxWidth: "500px",
            width: "100%",
            border: "1px solid hsl(211 22% 24%)", // Neutral 700 para el borde
          }}
        >
          {phase === "success" ? (
            <Box
              className="registration-result registration-success"
              role="status"
            >
              <Image src={check} alt="" width={78} height={72} />
              <Typography
                component="h2"
                className="text-preset-3 success-title"
              >
                HANDSHAKE COMPLETE
              </Typography>
              <Typography className="success-message">
                Operator <span>{callsign}</span> provisioned. Your account is
                ready.
              </Typography>
              <Button type="button" className="registration-submit" fullWidth>
                CONTINUE TO LOG IN
              </Button>
            </Box>
          ) : phase === "submitting" ? (
            <Box
              className="registration-result registration-submitting"
              role="status"
              aria-live="polite"
            >
              <Typography
                component="h2"
                className="text-preset-3 success-title"
              >
                TRANSMITTING_
              </Typography>
              <div className="transmission-loader" aria-hidden="true">
                <span />
              </div>
              <Typography className="success-message">
                Provisioning your Neoncore identity...
              </Typography>
            </Box>
          ) : (
            <Box
              component="form"
              className="registration-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <Box className="formTitle">
                <Typography
                  component="p"
                  variant="inherit"
                  className="text-preset-5"
                  sx={{ color: "var(--color-neutral-100)" }}
                >
                  NEW OPERATOR
                </Typography>

                <Typography
                  component="p"
                  variant="inherit"
                  className="text-preset-5"
                  sx={{ color: "var(--color-neutral-500)" }}
                >
                  ALL FIELDS REQUIRED
                </Typography>
              </Box>
              <span className="dots-line" />

              <Box className="field-group">
                <InputLabel
                  shrink
                  htmlFor="callsign-input"
                  sx={{
                    position: "relative",
                    transform: "none",
                    color: "var(--color-neutral-600)",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    mt: "1rem",
                    "&::before": {
                      content: '"> "',
                      color: "var(--linea-naranja)",
                      marginRight: "4px",
                    },
                  }}
                >
                  CALLSIGN
                </InputLabel>
                <TextField
                  id="callsign-input"
                  variant="outlined"
                  className="input"
                  placeholder="e.g. Vortex_07"
                  value={callsign}
                  onChange={(event) => {
                    setCallsign(event.target.value);
                  }}
                  error={submitted && !callsignValid}
                  helperText={
                    submitted && !callsignValid ? (
                      <Box
                        className="input-error-message"
                        sx={{ display: "flex", gap: "5px" }}
                      >
                        <Image src={alert} alt="" width={16} height={16} />
                        <span>Use at least 3 characters.</span>
                      </Box>
                    ) : (
                      "3-20 characters: letters, numbers, _ or -"
                    )
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                        {callsignStatus === "OK" && (
                            <Image className="imgTextField" src={tick2} alt="" width={30} height={30} />
                          )}
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Box>

              <Box className="field-group">
                <InputLabel
                  shrink
                  htmlFor="email-input"
                  sx={{
                    position: "relative",
                    transform: "none",
                    color: "var(--color-neutral-600)",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    "&::before": {
                      content: '"> "',
                      color: "var(--linea-naranja)",
                      marginRight: "4px",
                    },
                  }}
                >
                  EMAIL
                </InputLabel>
                <TextField
                  id="email-input"
                  variant="outlined"
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  error={submitted && !emailValid}
                  helperText={
                    submitted && !emailValid ? (
                      <Box
                        className="input-error-message"
                        sx={{ display: "flex", gap: "5px" }}
                      >
                        <Image src={alert} alt="" width={16} height={16} />
                        <span>Enter a valid email, like you@example.com</span>
                      </Box>
                    ) : (
                      ""
                    )
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                        {emailStatus === "OK" && (
                            <Image className="imgTextField" src={tick2} alt="" width={30} height={30} />
                          )}
                        </InputAdornment>
                      )
                    }
                  }}
                />
              </Box>
              <Box className="field-group">
                <InputLabel
                  shrink
                  htmlFor="password-input"
                  sx={{
                    position: "relative",
                    transform: "none",
                    color: "var(--color-neutral-600)",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    "&::before": {
                      content: '"> "',
                      color: "var(--linea-naranja)",
                      marginRight: "4px",
                    },
                  }}
                >
                  PASSWORD
                </InputLabel>

                <TextField
                  id="password-input"
                  className="input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  error={submitted && !passwordValid}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {confirmPasswordStatus === "OK" && (
                            <Image className="imgTextField" src={tick2} alt="" width={30} height={30} />
                          )}
                          <IconButton
                            type="button"
                            aria-label={
                              showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                            onClick={() =>
                              setShowPassword((visible) => !visible)
                            }
                            edge="end"
                          >
                            <Image
                              src={showPassword ? eyeOff : eye}
                              alt=""
                              width={18}
                              height={18}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <div
                  className={`password-strength strength-${passwordStrength}`}
                  role="img"
                  aria-label={`Password strength: ${passwordStrength} of 4`}
                >
                  {[1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className={
                        level <= passwordStrength
                          ? "strength-bar active"
                          : "strength-bar"
                      }
                    />
                  ))}
                </div>
                <div className="password-meta">
                  <Typography
                    component="div"
                    className={
                      submitted && !passwordValid
                        ? "field-hint field-error"
                        : "field-hint"
                    }
                    aria-live="polite"
                  >
                    {submitted && !passwordValid ? (
                      <span className="input-error-message">
                        <Image src={alert} alt="" width={16} height={16} />
                        <span>Use at least 8 characters.</span>
                      </span>
                    ) : (
                      "At least 8 characters"
                    )}
                  </Typography>
                  {passwordStrength > 0 && (
                    <Typography
                      component="span"
                      className={`password-strength-label strength-label-${passwordStrength}`}
                    >
                      {passwordStrengthLabel}
                    </Typography>
                  )}
                </div>
              </Box>

              <Box className="field-group">
                <InputLabel
                  shrink
                  htmlFor="confirm-password-input"
                  sx={{
                    position: "relative",
                    transform: "none",
                    color: "var(--color-neutral-600)",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    "&::before": {
                      content: '"> "',
                      color: "var(--linea-naranja)",
                      marginRight: "4px",
                    },
                  }}
                >
                  CONFIRM PASSWORD
                </InputLabel>

                <TextField
                  id="confirm-password-input"
                  className="input"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}
                  error={submitted && !confirmPasswordValid}
                  helperText={
                    submitted && !confirmPasswordValid ? (
                      <Box className="input-error-message">
                        <Image src={alert} alt="" width={16} height={16} />
                        <span className="erroRPasswordConfirm">
                          Passwords don&apos;t match
                        </span>
                      </Box>
                    ) : (
                      ""
                    )
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {confirmPasswordStatus === "OK" && (
                            <Image className="imgTextField" src={tick2} alt="" width={30} height={30} />
                          )}
                          <IconButton
                            type="button"
                            aria-label={
                              showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                            onClick={() =>
                              setShowPassword((visible) => !visible)
                            }
                            edge="end"
                          >
                            <Image
                              src={showPassword ? eyeOff : eye}
                              alt=""
                              width={18}
                              height={18}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <FormControlLabel
                className="terms-control"
                control={
                  <Checkbox
                    checked={acceptedTerms}
                    onChange={(event) => {
                      setAcceptedTerms(event.target.checked);
                    }}
                    sx={{
                      color: "var(--color-neutral-700)",
                      "&.Mui-checked": { color: "var(--linea-amarilla)" },
                    }}
                  />
                }
                label={
                  <Typography component="span" className="terms-copy">
                    I accept the <span className="terms-link">Terms</span> and{" "}
                    <span className="terms-link">Privacy Policy</span>.
                  </Typography>
                }
              />

              {submitted && !acceptedTerms && (
                <Box className="input-error-message terms-error" role="alert">
                  <Image src={alert} alt="" width={16} height={16} />
                  <span>Accept the terms to continue.</span>
                </Box>
              )}

              <Button type="submit" className="registration-submit" fullWidth>
                INITIALIZE ACCOUNT
              </Button>

              <Typography className="terms-copy login-prompt">
                Already an operator?
                <span className="log-in">Log in</span>
              </Typography>
            </Box>
          )}
        </Box>
        <Image
          className="registration-backdrop"
          src={backdrop}
          alt=""
          width={960}
          height={960}
          aria-hidden="true"
        />
      </Box>
    </Box>
  );
};

export default Page;
