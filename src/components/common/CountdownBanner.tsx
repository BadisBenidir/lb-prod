import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Date de lancement : 4 décembre 2025 à 18:00:00
    const launchDate = new Date('2025-12-04T18:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Mise à jour immédiate
    updateCountdown();

    // Mise à jour toutes les secondes
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-3 px-4 sticky top-16 lg:top-20 z-[60] shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {/* Icône et texte */}
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-white animate-pulse" />
            <span className="text-sm sm:text-base font-medium">
              Lancement officiel le 4 décembre à 18h00
            </span>
          </div>

          {/* Compte à rebours */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2 min-w-[45px] sm:min-w-[60px] text-center">
                <div className="text-lg sm:text-2xl font-bold">{timeLeft.days}</div>
                <div className="text-[10px] sm:text-xs text-gray-300 uppercase">Jours</div>
              </div>
              <span className="text-lg sm:text-2xl font-light">:</span>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2 min-w-[45px] sm:min-w-[60px] text-center">
                <div className="text-lg sm:text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[10px] sm:text-xs text-gray-300 uppercase">Heures</div>
              </div>
              <span className="text-lg sm:text-2xl font-light">:</span>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2 min-w-[45px] sm:min-w-[60px] text-center">
                <div className="text-lg sm:text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] sm:text-xs text-gray-300 uppercase">Min</div>
              </div>
              <span className="text-lg sm:text-2xl font-light hidden sm:inline">:</span>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-2 min-w-[45px] sm:min-w-[60px] text-center hidden sm:block">
                <div className="text-lg sm:text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] sm:text-xs text-gray-300 uppercase">Sec</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownBanner;
