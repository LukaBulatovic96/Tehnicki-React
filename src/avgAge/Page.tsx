import { useState, useEffect } from "react";
import "./Page.css";
import { loadApi } from "./service";

const TIMER_VALUE = 10000;

function Page() {

  const [avgAge, setAvgAge] = useState(0);

  // Timestamps used for resuming the interval on intended time
  const [lastLoaded, setLastLoaded] = useState(Date.now());
  const [timeStopped, setTimeStopped] = useState(Date.now());

  // Interval and timeout variables, used for clearing timeout and interval.
  // The reason for timeout clearance is if we pause/resume the interval multiple 
  // times before it actually loads, we would be calling this line:
  // setTimeoutbind(setTimeout(initializeFunction, TIMER_VALUE - (timeStopped - lastLoaded)));
  // multiple times, without ever clearing it, so in this manner it is possible 
  // to clear the interval on pause.
  const [timeoutBind, setTimeoutbind] = useState(0);
  const [loaderInterval, setLoaderInterval] = useState(0); 

  // Variable used for cosmetic
  const [isPaused, setIsPaused] = useState(false);  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeFunction();
  }, []);

  function initializeFunction() {
    loadData();
    setLoaderInterval(setInterval(loadData, TIMER_VALUE));
  }

  async function loadData() {
    setIsLoading(true);
    try {
      const averageAge = await loadApi();
      setAvgAge(averageAge);
    } catch (error) {
      console.error("Failed to load average age:", error);
      setAvgAge(0);
    }
    setLastLoaded(Date.now());
    setIsLoading(false);
  }

  async function stopTimer() {
    if (timeoutBind) clearTimeout(timeoutBind);
    setIsPaused(true);
    clearInterval(loaderInterval);
    setTimeStopped(Date.now());
  }

  function resumeTimer() {
    setIsPaused(false);
    setTimeoutbind(setTimeout(initializeFunction, TIMER_VALUE - (timeStopped - lastLoaded)));
  }

  return (
    <>
      <div className="holder">
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          <div
            className="pie-chart"
            onClick={() => {
              isPaused ? resumeTimer() : stopTimer();
            }}
          >
            <div
              className={
                isPaused
                  ? "pie-slice pause-animation"
                  : "pie-slice run-animation"
              }
            >
              <span className="age-text"> {avgAge}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
