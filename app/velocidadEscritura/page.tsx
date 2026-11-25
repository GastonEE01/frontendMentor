"use client";
import { Box, Button, Stack, Typography, Grid, Divider } from "@mui/material";
import Image from "next/image";
import { useCallback, useRef, useState, useEffect } from "react";
import textData from "./data.json";
import "../globals.css";

import logo from "./assets/images/logo-large.svg";
import complete from "./assets/images/icon-completed.svg";
import star1 from "./assets/images/pattern-star-1.svg";
import star2 from "./assets/images/pattern-star-2.svg";
import restart from "./assets/images/icon-restart.svg";
import confetti from "./assets/images/pattern-confetti.svg";
import newPbIcon from "./assets/images/icon-new-pb.svg";

import personalBestIcon from "./assets/images/icon-personal-best.svg";
import localFont from "next/font/local";
import { title } from "process";

type Difficulty = keyof typeof textData;

const fuentes = localFont({
  src: [
    {
      path: "./assets/fonts/Sora/static/Sora-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/fonts/Sora/static/Sora-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/fonts/Sora/static/Sora-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
});

type ResultType = "first" | "newBest" | "regular";

const getRandomText = (level: Difficulty): string => {
  const options = textData[level];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex].text;
};
const Page = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  /*const [currentText, setCurrentText] = useState<string>(() =>
    getRandomText("easy"),
  );*/
  const [currentText, setCurrentText] = useState(textData.easy[0].text);

  const [typedText, setTypedText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState("Timed (60s)");

  const [correctCount, setCorrectCount] = useState(0);
  const correctCountRef = useRef(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [bestWpm, setBestWpm] = useState<number | null>(null);
  const [resultType, setResultType] = useState<ResultType>("first");

  const accurancy =
    Math.round((correctCount / (correctCount + incorrectCount)) * 100) || 0;
  // const WPM =  Math.round((correctCount / 5) / seconds) ;

  const elapsedSeconds = mode === "Timed (60s)" ? 60 - seconds : seconds;

  const WPM =
    elapsedSeconds > 0
      ? Math.round(correctCount / 5 / (elapsedSeconds / 60))
      : 0;

  const isPassageComplete =
    currentText.length > 0 && typedText.length === currentText.length;

  const isTimeUp = mode === "Timed (60s)" && isTimerRunning && seconds === 0;

  const isFinished = isPassageComplete || isTimeUp;

  const finishTest = useCallback(
    (score: number) => {
      const nextType: ResultType =
        bestWpm === null ? "first" : score > bestWpm ? "newBest" : "regular";

      setResultType(nextType);

      if (bestWpm === null || score > bestWpm) {
        setBestWpm(score);
        localStorage.setItem("typing-best-wpm", String(score));
      }
    },
    [bestWpm],
  );

  const handleDifficultyChange = (level: Difficulty) => {
    setDifficulty(level);
    setCurrentText(getRandomText(level));
    setTypedText("");
    setCorrectCount(0);
    correctCountRef.current = 0;
    setIncorrectCount(0);
    setSeconds(60);
    setIsTimerRunning(false);
    inputRef.current?.focus();
  };

  const handleRestart = () => {
    setCurrentText(getRandomText(difficulty));
    setTypedText("");
    setCorrectCount(0);
    correctCountRef.current = 0;
    setIncorrectCount(0);
    setSeconds(60);
    setIsTimerRunning(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (mode !== "Timed (60s)" || !isTimerRunning || seconds === 0) return;

    const intervalId = window.setInterval(() => {
      if (seconds === 1) {
        setSeconds(0);
        finishTest(Math.round(correctCountRef.current / 5));
        return;
      }

      setSeconds((previousSeconds) => previousSeconds - 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [finishTest, isTimerRunning, mode, seconds]);

  const handleTime = (value: string) => {
    const index = typedText.length;
    let nextCorrectCount = correctCount;

    if (value.length > typedText.length) {
      if (value[index] === currentText[index]) {
        nextCorrectCount += 1;
        setCorrectCount(nextCorrectCount);
      } else {
        setIncorrectCount((prev) => prev + 1);
      }
    }

    correctCountRef.current = nextCorrectCount;
    setTypedText(value);

    if (value.length > 0) setIsTimerRunning(true);

    if (value.length === currentText.length) {
      const finalWpm =
        elapsedSeconds > 0
          ? Math.round(nextCorrectCount / 5 / (elapsedSeconds / 60))
          : 0;

      setIsTimerRunning(false);
      finishTest(finalWpm);
    }
  };

  const resultContent = {
    first: {
      title: "Baseline Established!",
      message: "Your first result is ready.",
      button: "Beat This Score",
    },
    newBest: {
      title: "High Score Smashed!",
      message: "You beat your personal best!",
      button: "Go Again",
    },
    regular: {
      title: "Test Complete!",
      message: "Solid run. Keep pushing to beat your high score.",
      button: "Go Again",
    },
    
  }[resultType];

  return (
    <Box  sx={{
    minHeight: "100vh",
    ...(resultType === "newBest" && {
      backgroundImage: `url(${confetti.src})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom center",
      backgroundSize: "100% auto",
    }),
  }}>
      {/*} {isPassageComplete && <Typography>Pasaje completado</Typography>} */}

      <header>
        <Box
          sx={{
            backgroundColor: "#121212",
            mt: "2rem",
            ml: "5rem",
            mr: "5rem",
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Image src={logo} alt="logo" />
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Image src={personalBestIcon} alt="personalBest" />
              <Typography
                sx={{
                  fontFamily: fuentes.style.fontFamily,
                  fontWeight: 600,
                  color: "#5c5c5e",
                }}
              >
                Personal best: {bestWpm}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </header>

      {!isFinished ? (
        <Box sx={{ background: "", mt: "4rem", ml: "5rem", mr: "5rem" }}>
          <Grid
            container
            spacing={5}
            sx={{
              justifyContent: "space-between",
              alignItems: "baseline",
              color: "gray",
              "& .MuiTypography-root": {
                fontFamily: fuentes.style.fontFamily,
                fontWeight: 600,
                color: "#5c5c5e",
              },
            }}
          >
            <Grid>
              <Typography>WPM: {WPM}</Typography>
            </Grid>
            <Grid>
              <Typography>Accuracy:{accurancy} %</Typography>
            </Grid>
            <Grid>
              <Typography>
                Time: {mode === "Timed (60s)" ? seconds : "--"}
              </Typography>
            </Grid>
            {/* Grupo Difficulty */}
            <Grid>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography sx={{ whiteSpace: "nowrap" }}>
                  Difficulty:
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={() => handleDifficultyChange("easy")}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      padding: "4px 12px",
                      minWidth: "auto",
                      border:
                        difficulty === "easy"
                          ? "1.5px solid #3b82f6"
                          : "1px solid #3a3838",
                      color: difficulty === "easy" ? "#60a5fa" : "#a1a1aa",
                      backgroundColor:
                        difficulty === "easy"
                          ? "rgba(59, 130, 246, 0.18)"
                          : "transparent",
                      "&:hover": {
                        borderColor:
                          difficulty === "easy" ? "#60a5fa" : "#93c5fd",
                        color: "#ffffff",
                        backgroundColor:
                          difficulty === "easy"
                            ? "rgba(59, 130, 246, 0.3)"
                            : "rgba(170, 20, 20, 0.08)",
                      },
                    }}
                  >
                    Easy
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => handleDifficultyChange("medium")}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      padding: "4px 12px",
                      minWidth: "auto",
                      border:
                        difficulty === "medium"
                          ? "1.5px solid #3b82f6"
                          : "1px solid #3a3838",
                      color: difficulty === "medium" ? "#60a5fa" : "#a1a1aa",
                      backgroundColor:
                        difficulty === "medium"
                          ? "rgba(59, 130, 246, 0.18)"
                          : "transparent",
                      "&:hover": {
                        borderColor:
                          difficulty === "medium" ? "#60a5fa" : "#93c5fd",
                        color: "#ffffff",
                        backgroundColor:
                          difficulty === "medium"
                            ? "rgba(59, 130, 246, 0.3)"
                            : "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    Medium
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => handleDifficultyChange("hard")}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      padding: "4px 12px",
                      minWidth: "auto",
                      border:
                        difficulty === "hard"
                          ? "1.5px solid #3b82f6"
                          : "1px solid #3a3838",
                      color: difficulty === "hard" ? "#60a5fa" : "#a1a1aa",
                      backgroundColor:
                        difficulty === "hard"
                          ? "rgba(59, 130, 246, 0.18)"
                          : "transparent",
                      "&:hover": {
                        borderColor:
                          difficulty === "hard" ? "#60a5fa" : "#93c5fd",
                        color: "#ffffff",
                        backgroundColor:
                          difficulty === "hard"
                            ? "rgba(59, 130, 246, 0.3)"
                            : "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    Hard
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Grupo Mode */}
            <Grid>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography sx={{ whiteSpace: "nowrap" }}>Mode:</Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={() => setMode("Timed (60s)")}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      padding: "4px 12px",
                      minWidth: "auto",
                      border:
                        mode === "Timed (60s)"
                          ? "1.5px solid #3b82f6"
                          : "1px solid #3a3838",
                      color: mode === "Timed (60s)" ? "#60a5fa" : "#a1a1aa",
                      backgroundColor:
                        mode === "Timed (60s)"
                          ? "rgba(59, 130, 246, 0.18)"
                          : "transparent",
                      "&:hover": {
                        borderColor:
                          mode === "Timed (60s)" ? "#60a5fa" : "#93c5fd",
                        color: "#ffffff",
                        backgroundColor:
                          mode === "Timed (60s)"
                            ? "rgba(59, 130, 246, 0.3)"
                            : "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    Timed(60s)
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setMode("Passage")}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      padding: "4px 12px",
                      minWidth: "auto",
                      border:
                        mode === "Passage"
                          ? "1.5px solid #3b82f6"
                          : "1px solid #3a3838",
                      color: mode === "Passage" ? "#60a5fa" : "#a1a1aa",
                      backgroundColor:
                        mode === "Passage"
                          ? "rgba(59, 130, 246, 0.18)"
                          : "transparent",
                      "&:hover": {
                        borderColor: mode === "Passage" ? "#60a5fa" : "#93c5fd",
                        color: "#ffffff",
                        backgroundColor:
                          mode === "Passage"
                            ? "rgba(59, 130, 246, 0.3)"
                            : "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    Passage
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2, borderColor: "rgb(58, 56, 56)" }} />
          {/*Aca va un texto aleatorio 
        <Typography variant="inherit">{currentText}</Typography>
        */}
          <Box
            onClick={() => inputRef.current?.focus()}
            sx={{
              position: "relative",
              mt: 2,
              cursor: "text",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "#ffffff",
                fontFamily: fuentes.style.fontFamily,
                fontSize: "1.25rem",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                minHeight: "8rem",
                pointerEvents: "none",
              }}
            >
              {Array.from(currentText).map((char, index) => {
                const typedChar = typedText[index];
                const color =
                  typedChar === undefined
                    ? "#ffffff"
                    : typedChar === char
                      ? "#4ade80"
                      : "#f87171";

                return (
                  <span key={index} style={{ color }}>
                    {char}
                  </span>
                );
              })}
            </Typography>
            <textarea
              ref={inputRef}
              value={typedText}
              onChange={(event) => handleTime(event.target.value)}
              disabled={mode === "Timed (60s)" && seconds === 0}
              aria-label="Escribe el texto mostrado"
              maxLength={currentText.length}
              spellCheck={false}
              className="typing-input"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                padding: 0,
                border: 0,
                resize: "none",
                overflow: "hidden",
                opacity: 0,
                cursor: "text",
              }}
            />
          </Box>
          <Divider sx={{ mt: 2, borderColor: "rgb(58, 56, 56)" }} />

          {isTimeUp && <Typography>Se terminó el tiempo</Typography>}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}></Box>

          <Button
            variant="contained"
            sx={{
              display: "block",
              mx: "auto",
              mt: 3,
              backgroundColor: "#262626",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleRestart}
          >
            Restart Test
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: "2rem", ml: "5rem", mr: "5rem" }}>
          <Box
            sx={{
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Image src={complete} alt="iconComplete" />

            <Box sx={{ display: "flex", alignItems: "start", mt: "2rem" }}>
              <Image className="star2" src={star2} alt="start1" />

              <Typography
                variant="h3"
                sx={{
                  fontFamily: fuentes.style.fontFamily,
                  fontWeight: 700,
                  color: "white",
                }}
              >
                {resultContent.title}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: fuentes.style.fontFamily,
                fontWeight: 600,
                color: "#5c5c5e",
                mt: "0.5rem",
              }}
            >
              {resultContent.message}
            </Typography>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                gap: "30px",
                mt: "2rem",
              }}
            >
              <Box
                sx={{
                  width: "10rem",
                  height: "4rem",
                  backgroundColor: "transparent",
                  borderRadius: "10px",
                  border: "3px solid gray",
                  textAlign: "start",
                }}
              >
                <Typography sx={{ ml: "1.5rem", mt: "0.5rem" }}>
                  WPM: {WPM}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "10rem",
                  height: "4rem",
                  backgroundColor: "transparent",
                  borderRadius: "10px",
                  border: "3px solid gray",
                  textAlign: "start",
                }}
              >
                <Typography sx={{ ml: "1.5rem", mt: "0.5rem" }}>
                  Accuracy: {accurancy}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "10rem",
                  height: "4rem",
                  backgroundColor: "transparent",
                  borderRadius: "10px",
                  border: "3px solid gray",
                  textAlign: "start",
                }}
              >
                <Typography sx={{ ml: "1.5rem", mt: "0.5rem" }}>
                  Characther: {typedText.length}{" "}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={handleRestart}
                variant="contained"
                sx={{
                  mt: "1.5rem",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: fuentes.style.fontFamily,
                  fontWeight: 700,
                }}
                endIcon={
                  <Image
                    src={restart}
                    alt="restart"
                    width={16}
                    height={16}
                    style={{ filter: "brightness(0)" }}
                  />
                }
              >
                {resultContent.button}
              </Button>
              <Image src={star1} alt="" width={60} height={60} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Page;
