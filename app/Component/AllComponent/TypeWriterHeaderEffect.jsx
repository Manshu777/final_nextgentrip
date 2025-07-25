import React, { useState, useEffect } from "react";
import { Typewriter, Cursor } from "react-simple-typewriter";

const TypeWriterHeaderEffect = () => {
  const [isAffordableComplete, setAffordableComplete] = useState(false);

  useEffect(() => {
    // Simulate the completion of the first typewriter after it finishes typing
    const typingDuration = 50 * "Book Affordable".length; // typeSpeed * number of characters
    const delayAfterTyping = 500; // Add a slight delay after typing

    const timer = setTimeout(() => {
      setAffordableComplete(true);
    }, typingDuration + delayAfterTyping);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
   <div className="text-white flex items-center gap-2 font-bold py-3 md:text-2xl ml-[10px] md:ml-0">

      {/* First Typewriter for "Book affordable" */}
      <h2>
        <Typewriter
          words={["Dream Big Explore More Book -"]}
          loop={1}
          typeSpeed={50}
          deleteSpeed={0}
        />
      </h2>

      {/* Second Typewriter for other words */}
      <h2>
        {isAffordableComplete && (
          <Typewriter
            words={["Flights", "Hotels","Holiday Packages","eSIM", "Buses","Visa","Cab","Insurence","Join Marriages","Cruise","Charter", "Trains"]}
            loop={Infinity}
            typeSpeed={50}
            deleteSpeed={60}
            delaySpeed={900}
          />
        )}

        <Cursor cursorColor="white" />
      </h2>
    </div>
  );
};

export default TypeWriterHeaderEffect;
