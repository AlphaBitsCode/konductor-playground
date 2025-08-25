'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatedEmailIcon } from '@/components/ui/AnimatedEmailIcon';

export const LockedDoorSection = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [doorAnimating, setDoorAnimating] = useState(false);
  const [showEmailAnimation, setShowEmailAnimation] = useState(false);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const validateUsername = (username: string): string | null => {
    if (username.length < 5 || username.length > 25) {
      return 'Username must be between 5 and 25 characters';
    }
    
    const validPattern = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?$/;
    if (!validPattern.test(username)) {
      return 'Username can only contain letters, numbers, and one dot (no spaces or dashes)';
    }

    const dotCount = (username.match(/\./g) || []).length;
    if (dotCount > 1) {
      return 'Username can contain at most one dot';
    }

    return null;
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    const error = validateUsername(value);
    setUsernameError(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const usernameValidationError = validateUsername(username);
    if (!email || !username || usernameValidationError || isSubmitting) {
      if (usernameValidationError) {
        setUsernameError(usernameValidationError);
      }
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setUsernameError(null);

    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username }),
      });

      const data = await response.json();

      if (response.ok) {
        setQueuePosition(data.queuePosition);
        setShowEmailAnimation(true);

        // Wait for email animation to start before showing success message
        setTimeout(() => {
          setIsSubmitted(true);
          setEmail('');
          setUsername('');
        }, 1000);
      } else {
        console.error('Signup failed:', data.error);
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      if (error instanceof Error && error.message.includes('Username is already taken')) {
        setUsernameError('Username is already taken');
      } else {
        setErrorMsg('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDoorClick = () => {
    setDoorAnimating(true);
    setTimeout(() => {
      setShowForm(true);
      setDoorAnimating(false);
    }, 800);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          // Add some dramatic effect when this section comes into view
          setTimeout(() => {
            const door = document.querySelector('.locked-door');
            door?.classList.add('door-shake');
          }, 500);
        }
      },
      { threshold: 0.5 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="signup"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(45deg, rgba(220, 38, 127, 0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(220, 38, 127, 0.1) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(220, 38, 127, 0.1) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(220, 38, 127, 0.1) 75%)
          `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="transform origin-center">
          {!showForm
            ? (
            /* Locked Door Scene */
            <div className="space-y-8">
              <div className="space-y-4 mb-24">
                <h2 className="pixel-font text-3xl md:text-5xl text-white mb-4">
                  <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    THE PLAYGR0UND
                  </span>
                </h2>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                  You&apos;ve reached the secured area. Only early access members can proceed.
                </p>
              </div>

              {/* Door Visualization */}
              <div className="relative mx-auto w-80 h-96 perspective-1000">
                <div
                  className={`locked-door relative w-full h-full glassmorphism rounded-2xl border-4 border-red-500 cursor-pointer transition-transform duration-300 hover:scale-105 ${
                    doorAnimating ? 'door-opening' : ''
                  }`}
                  onClick={handleDoorClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleDoorClick();
                    }
                  }}
                >
                  {/* Door Surface */}
                  <div className="absolute inset-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl">
                    {/* Door Panels */}
                    <div className="absolute top-6 left-6 right-6 h-32 border-2 border-gray-600 rounded" />
                    <div className="absolute bottom-6 left-6 right-6 h-32 border-2 border-gray-600 rounded" />

                    {/* Door Handle */}
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-12 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-lg" />
                    </div>

                    {/* Lock Icon */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="text-6xl">🎟️</div>
                    </div>

                    {/* Subtle Date Imprint (Easter Egg) */}
                    <div className="absolute bottom-10 right-10 pointer-events-none select-none transform -rotate-12">
                      <span className="text-xs tracking-widest text-white opacity-10">Nov 2025</span>
                    </div>
                  </div>

                  {/* Warning Signs */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <div className="glassmorphism px-4 py-2 rounded border-2 border-red-400 animate-pulse">
                      <span className="pixel-font text-sm text-red-400">RESTRICTED ACCESS</span>
                    </div>
                  </div>

                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="glassmorphism px-4 py-2 rounded border-2 border-orange-400">
                      <span className="pixel-font text-sm text-orange-400">Request Ticket</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
            : (
            /* Early Access Form */
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h2 className="pixel-font text-3xl md:text-5xl text-white mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                    EARLY ACCESS REQUEST
                  </span>
                </h2>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                  Join the exclusive beta program and be among the first to experience the future of work.
                </p>
              </div>

              {!isSubmitted
                ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                  <div className="space-y-4">
                    <div className="glassmorphism rounded-lg p-6 space-y-4">
                      <div>
                        <label htmlFor="early-access-username" className="block pixel-font text-sm text-cyan-400 mb-2">
                          Username <span className="text-orange-400">*IMPORTANT*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 pixel-font text-sm">@</span>
                          <input
                            id="early-access-username"
                            type="text"
                            value={username}
                            onChange={e => handleUsernameChange(e.target.value)}
                            placeholder="player.name"
                            className={`w-full pl-8 pr-4 py-3 bg-slate-800 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-200 ${
                              usernameError ? 'border-red-400 focus:border-red-400' : 'border-gray-600 focus:border-cyan-400'
                            }`}
                            required
                            disabled={isSubmitting}
                            minLength={5}
                            maxLength={25}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Alphanumeric only, one dot allowed (5-25 chars)</p>
                        {usernameError && (
                          <p className="text-red-400 text-xs mt-1">{usernameError}</p>
                        )}
                      </div>

                      <div>
                        {/** Associate label with input for a11y */}
                        <label htmlFor="early-access-email" className="block pixel-font text-sm text-cyan-400 mb-2">
                          Email Address
                        </label>
                        <input
                          id="early-access-email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 bg-slate-800 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="text-xs text-gray-400 text-left">
                        • Classified access credentials
                        <br />
                        • Experimental features unlock
                        <br />
                        • Direct neural interface
                        <br />
                        • Priority queue assignment
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!email || !username || !!usernameError || isSubmitting}
                      className="w-full pixel-button glassmorphism px-6 py-4 rounded-lg border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isSubmitting
                        ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              <span className="pixel-font text-sm">PROCESSING...</span>
                            </div>
                          )
                        : (
                            <span className="pixel-font text-sm">REQUEST EARLY ACCESS</span>
                          )}
                    </button>

                    {errorMsg && (
                      <p className="text-red-400 text-xs text-left" role="alert">
                        {errorMsg}
                      </p>
                    )}
                  </div>
                </form>
                )
              : (
                <div className="max-w-md mx-auto glassmorphism rounded-lg p-8 border-2 border-cyan-400">
                  <div className="text-6xl mb-4">📬</div>
                  <h3 className="pixel-font text-xl text-cyan-400 mb-4">INVITATION SENT!</h3>
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm">
                      Your access code has been dispatched. Check your secure channel.
                    </p>
                    {queuePosition && (
                      <div className="glassmorphism bg-slate-800/50 rounded-lg p-4 border border-cyan-400/30">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-2xl">🎯</span>
                          <div className="text-center">
                            <div className="pixel-font text-sm text-cyan-400">YOUR POSITION</div>
                            <div className="pixel-font text-2xl text-white font-bold">
                              #
                              {queuePosition}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 text-center mt-2">
                          Check your email to confirm your slot in line!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animated Email Icon */}
      <AnimatedEmailIcon
        isVisible={showEmailAnimation}
        onAnimationComplete={() => setShowEmailAnimation(false)}
      />

      {/* Corner Warning Lights */}
      <div className="absolute top-8 left-8">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </div>
      <div className="absolute top-8 right-8">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="absolute bottom-8 left-8">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-8 right-8">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <style jsx>
        {`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .door-shake {
          animation: door-shake 0.5s ease-in-out;
        }
        
        .door-opening {
          animation: door-open 0.8s ease-in-out forwards;
        }
        
        @keyframes door-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px) rotate(-0.5deg); }
          75% { transform: translateX(2px) rotate(0.5deg); }
        }
        
        @keyframes door-open {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-90deg); }
        }
        
        @keyframes animate-fade-in {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        .animate-fade-in {
          animation: animate-fade-in 0.8s ease-out forwards;
        }
      `}
      </style>
    </section>
  );
};
