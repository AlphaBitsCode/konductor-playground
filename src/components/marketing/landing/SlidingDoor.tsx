"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SlidingDoorProps = {
  scrollY: number;
};

export const SlidingDoor = ({ scrollY }: SlidingDoorProps) => {
  const [doorPosition, setDoorPosition] = useState(100); // Start completely hidden (100% = fully below screen)
  const [totalPageHeight, setTotalPageHeight] = useState(0);
  const doorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // State for login popup
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Function to open the login popup
  const openPopup = () => {
    setShowLoginPopup(true);
    setDoorPosition(100); // Hide door when popup opens
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current); // Stop door animation
    }
  };

  // Function to close the login popup
  const closePopup = () => {
    setShowLoginPopup(false);
    // Re-enable door animation if needed, or just keep it hidden
    if (
      animationFrameRef.current === null &&
      scrollY / totalPageHeight > 0.85
    ) {
      animationFrameRef.current = requestAnimationFrame(animateDoor);
    }
  };

  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    // Simulate API call or validation
    setTimeout(() => {
      const isValidUsername =
        loginUsername.length >= 5 &&
        loginUsername.length <= 25 &&
        /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$/.test(loginUsername);
      const isValidPassword = loginPassword.length > 0; // Basic password check

      if (isValidUsername && isValidPassword) {
        // Successful login
        alert("Access Granted! Welcome, Agent.");
        closePopup();
      } else {
        // Failed login
        alert("Access Denied. Check your credentials.");
      }
      setIsLoggingIn(false);
    }, 1500);
  };

  // Validate username format
  const validateUsername = (username: string) => {
    setLoginUsername(username);
    // Regex: alpha-numeric, 5-25 chars, no space, no dash, 1 dot allowed
    const isValid = /^[a-zA-Z0-9]{5,25}$|^[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(
      username,
    );
    if (username.length > 0 && username.length < 5) {
      return "Min 5 characters";
    }
    if (username.length > 25) {
      return "Max 25 characters";
    }
    if (username.includes(" ") || username.includes("-")) {
      return "No spaces or dashes";
    }
    if (username.split(".").length > 2) {
      return "Only one dot allowed";
    }
    return ""; // No error
  };

  // Calculate when the character is approaching the bottom
  const animateDoor = useCallback(() => {
    if (doorRef.current) {
      const scrollProgress =
        totalPageHeight > 0 ? Math.min(scrollY / totalPageHeight, 1) : 0;

      // Start showing the door when we're 85% through the page (character approaching bottom)
      const doorTriggerPoint = 0.85;

      if (scrollProgress >= doorTriggerPoint) {
        // Calculate how much the door should slide up
        const doorProgress =
          (scrollProgress - doorTriggerPoint) / (1 - doorTriggerPoint);

        // Smooth easing function for door animation
        const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;
        const easedProgress = easeOutCubic(Math.min(doorProgress, 1));

        // Door position: 100% = hidden, 0% = fully visible
        const newPosition = 100 - easedProgress * 60; // Show 60% of the door
        setDoorPosition(newPosition);
      } else {
        // Keep door hidden when not near the bottom
        setDoorPosition(100);
      }
    }

    animationFrameRef.current = requestAnimationFrame(animateDoor);
  }, [scrollY, totalPageHeight]);

  // Animation loop
  useEffect(() => {
    // Only start animation if popup is not shown
    if (!showLoginPopup) {
      animationFrameRef.current = requestAnimationFrame(animateDoor);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateDoor, showLoginPopup]);

  // Calculate total page height
  useEffect(() => {
    const calculateTotalHeight = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      setTotalPageHeight(documentHeight - windowHeight);
    };

    calculateTotalHeight();
    window.addEventListener("resize", calculateTotalHeight);

    const initialTimer = setTimeout(calculateTotalHeight, 1000);

    return () => {
      window.removeEventListener("resize", calculateTotalHeight);
      clearTimeout(initialTimer);
    };
  }, []);

  // Make the door clickable to open the popup
  const handleDoorClick = () => {
    if (!showLoginPopup) {
      openPopup();
    }
  };

  return (
    <>
      <div
        className="fixed z-[100] pointer-events-auto cursor-pointer" // Changed to pointer-events-auto and added cursor-pointer
        ref={doorRef}
        onClick={handleDoorClick} // Added click handler
        style={{
          left: "14%", // Position to the left of the walking character (which is at 15%)
          bottom: "2%",
          transform: `translateY(${doorPosition}%)`,
          transition: "none", // We're handling animation manually
          willChange: "transform",
        }}
      >
        <div className="door-container relative">
          {/* Door Frame */}
          <div className="door-frame">
            {/* Left Door Panel */}
            <div className="door-panel door-left">
              <div className="door-window"></div>
              <div className="door-handle door-handle-left"></div>
            </div>

            {/* Right Door Panel */}
            <div className="door-panel door-right">
              <div className="door-window"></div>
              <div className="door-handle door-handle-right"></div>
            </div>

            {/* Door Sign */}
            <div className="door-sign">
              <span
                className="jersey-font text-gray-300"
                style={{ fontSize: "14px", lineHeight: "1" }}
              >
                PLAYGR0UND
              </span>
            </div>
          </div>

          {/* Door Shadow */}
          <div className="door-shadow"></div>
        </div>
      </div>

      {/* Login Popup Modal */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-cyan-400 rounded-lg p-8 max-w-md w-full mx-4 glassmorphism">
            <div className="text-center mb-6">
              <h3 className="pixel-font text-xl text-cyan-400 mb-2">
                RESTRICTED ACCESS
              </h3>
              <p className="text-gray-300 text-sm">
                The playground requires authorization...
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="login-username"
                  className="block pixel-font text-sm text-cyan-400 mb-2"
                >
                  Konductor ID
                </label>
                <input
                  id="login-username"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    const validationError = validateUsername(target.value);
                    setLoginUsername(target.value);
                    // Optionally display validation error feedback here
                  }}
                  placeholder="enter_designation"
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                  required
                  disabled={isLoggingIn}
                  minLength={5}
                  maxLength={25}
                  pattern="^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block pixel-font text-sm text-cyan-400 mb-2"
                >
                  Access Code
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                  required
                  disabled={isLoggingIn}
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closePopup}
                  disabled={isLoggingIn}
                  className="flex-1 pixel-font text-sm px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  ABORT
                </button>
                <button
                  type="submit"
                  disabled={!loginUsername || !loginPassword || isLoggingIn}
                  className="flex-1 pixel-font text-sm px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>ACCESSING...</span>
                    </div>
                  ) : (
                    "ENTER"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 font-mono">
                {"[SYSTEM_MSG]: Proto_access_v0.7_beta"}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>
        {`
          .door-container {
            width: 100px; /* Twice bigger: 50px * 2 = 100px */
            height: 150px; /* Twice bigger: 75px * 2 = 150px */
            position: relative;
          }

          .door-frame {
            width: 100%;
            height: 100%;
            background: #8b4513;
            border: 2px solid #654321; /* Bigger border */
            border-radius: 4px 4px 0 0; /* Bigger radius */
            position: relative;
            display: flex;
            image-rendering: pixelated;
            box-shadow:
              inset 0 0 0 2px #a0522d,
              0 -2px 4px rgba(0, 0, 0, 0.3);
          }

          .door-panel {
            flex: 1;
            height: 100%;
            position: relative;
            background: linear-gradient(
              to right,
              #8b4513 0%,
              #a0522d 50%,
              #8b4513 100%
            );
            border: 2px solid #654321; /* Bigger border */
          }

          .door-left {
            border-right: 1px solid #654321;
            border-radius: 2px 0 0 0;
          }

          .door-right {
            border-left: 1px solid #654321;
            border-radius: 0 2px 0 0;
          }

          .door-window {
            width: 60%;
            height: 40%;
            background: rgba(0, 50, 100, 0.8);
            border: 1px solid #4a5568; /* Bigger border */
            border-radius: 2px; /* Bigger radius */
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            box-shadow:
              inset 0 0 4px rgba(0, 0, 0, 0.5),
              0 0 2px rgba(100, 200, 255, 0.3);
          }

          .door-window::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #4a5568;
            transform: translateY(-50%);
          }

          .door-window::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 1px;
            background: #4a5568;
            transform: translateX(-50%);
          }

          .door-handle {
            width: 4px; /* Twice bigger handles */
            height: 4px;
            background: #ffd700;
            border: 1px solid #b8860b;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          }

          .door-handle-left {
            right: 6px; /* Adjusted for bigger door */
          }

          .door-handle-right {
            left: 6px; /* Adjusted for bigger door */
          }

          .door-sign {
            position: absolute;
            top: -24px; /* Bigger offset */
            left: 50%;
            transform: translateX(-50%);
            background: rgba(139, 69, 19, 0.9);
            border: 1px solid #654321;
            border-radius: 2px;
            padding: 2px 6px; /* Bigger padding */
            text-align: center;
            min-width: 60px; /* Bigger sign */
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            font-size: 8px !important; /* Bigger text */
          }

          .door-shadow {
            position: absolute;
            bottom: -6px; /* Bigger offset */
            left: 50%;
            transform: translateX(-50%);
            width: 120px; /* Twice bigger shadow */
            height: 16px; /* Twice bigger shadow */
            background: radial-gradient(
              ellipse at center,
              rgba(0, 0, 0, 0.4) 0%,
              rgba(0, 0, 0, 0.2) 50%,
              transparent 100%
            );
            border-radius: 50%;
            filter: blur(2px);
          }

          /* Mobile responsive styles - bigger on mobile too */
          @media (max-width: 768px) {
            .door-container {
              width: 60px; /* Twice bigger on mobile */
              height: 90px;
            }

            .door-frame {
              border: 1px solid #654321;
              border-radius: 2px 2px 0 0;
            }

            .door-panel {
              border: 1px solid #654321;
            }

            .door-window {
              border: 1px solid #4a5568;
              border-radius: 2px;
            }

            .door-handle {
              width: 2px;
              height: 2px;
            }

            .door-handle-left {
              right: 4px;
            }

            .door-handle-right {
              left: 4px;
            }

            .door-sign {
              top: -16px;
              padding: 2px 4px;
              min-width: 40px;
              font-size: 6px !important;
              border: 1px solid #654321;
            }

            .door-shadow {
              bottom: -4px;
              width: 70px;
              height: 8px;
            }
          }

          /* Subtle glow effect for interactivity hint */
          .door-frame:hover {
            box-shadow:
              inset 0 0 0 2px #a0522d,
              0 -4px 8px rgba(0, 0, 0, 0.3),
              0 0 16px rgba(255, 215, 0, 0.2);
          }

          /* Add subtle wood grain texture */
          .door-panel::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(101, 67, 33, 0.1) 1px,
              rgba(101, 67, 33, 0.1) 2px,
              transparent 3px
            );
            pointer-events: none;
          }

          /* Glassmorphism style for the popup */
          .glassmorphism {
            background: rgba(
              40,
              44,
              52,
              0.8
            ); /* Dark background with transparency */
            border-radius: 10px;
            box-shadow:
              0 8px 32px 0 rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }

          /* Pixel font style */
          .pixel-font {
            font-family:
              "Press Start 2P", cursive; /* Assuming you have this font imported or available */
          }
        `}
      </style>
    </>
  );
};
