const socket = io.connect("http://localhost:3001");

socket.on("counterUpdated", function (data) {
  // Update the counter here
  document.getElementById("counter").textContent = numberWithCommas(data.value);
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// JavaScript code

function getTimeSince() {
  const startDate = new Date("October 29, 2023 23:25:00");
  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate.getTime() - startDate.getTime());
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  const hoursDiff = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
  const minutesDiff = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
  const secondsDiff = Math.floor((timeDiff % (1000 * 60)) / 1000);
  return {
    days: daysDiff,
    hours: hoursDiff,
    minutes: minutesDiff,
    seconds: secondsDiff,
  };
}

function updateProgressBar(data) {
  const progressBar = document.getElementById("progress-bar");
  const percentageSpan = document.getElementById("progress-percentage");
  const startValue = progressBar.value;
  const endValue = data.value;
  const duration = 1000; // duration of the animation in milliseconds
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const currentValue = startValue + (endValue - startValue) * progress;

    progressBar.value = currentValue;
    const percentage = Math.floor((currentValue / progressBar.max) * 100.0);
    percentageSpan.textContent = percentage + "%";

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // When animation is complete, format the final value with commas
      document.getElementById("counter").textContent =
        numberWithCommas(endValue);
    }
  }

  requestAnimationFrame(animate);
}

async function fetchCurrentCount() {
  try {
    const response = await fetch("/current-count");
    const data = await response.json();
    updateProgressBar(data);

    let displayedCount = 0;
    const counterElem = document.getElementById("counter");

    function updateCounter() {
      // Calculate the remaining difference
      const difference = data.value - displayedCount;
      // Adjust the speed based on the remaining difference. The larger the difference, the bigger the step.
      const step = Math.max(1, Math.ceil(difference * 0.05)); // 5% of the remaining difference

      if (displayedCount + step < data.value) {
        displayedCount += step;
        counterElem.textContent = numberWithCommas(displayedCount);
        // Use setTimeout instead of setInterval for dynamic intervals
        setTimeout(updateCounter, 2);
      } else {
        counterElem.textContent = data.value; // directly set the final value
      }
    }

    updateCounter();
    counterElem.textContent = numberWithCommas(data.value);
  } catch (error) {
    console.error(error);
  }
}

async function incrementCounter(amount = 1, password = null) {
  const counterElem = document.getElementById("counter");
  const currentCount = parseInt(counterElem.textContent, 10);
  try {
    if (password) {
      const input = prompt("Please enter the passcode:");
      if (input !== password) {
        throw new Error("Incorrect password");
      }
    }

    const response = await fetch("/increment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    let displayedCount = currentCount;

    function numberWithCommas(number) {
      // Assuming this function exists to format numbers with commas
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function updateCounter() {
      const difference = data.value - displayedCount;
      const step = Math.max(1, Math.ceil(difference * 0.05));

      if (displayedCount + step < data.value) {
        displayedCount += step;
        counterElem.textContent = numberWithCommas(displayedCount);
        setTimeout(updateCounter, 2);
      } else {
        counterElem.textContent = numberWithCommas(data.value);
      }
    }

    updateCounter();
  } catch (error) {
    console.error("Failed to update count:", error);
  }
}

// This should be inside an async function or then block where `data` is available
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("/api");
    const data = await response.json();

    if (data.value !== undefined) {
      let displayedCount = 0;
      const counterElem = document.getElementById("counter");

      function updateCounter() {
        const step = Math.ceil((data.value - displayedCount) / 10);

        if (displayedCount + step < data.value) {
          displayedCount += step;
          counterElem.textContent = numberWithCommas(displayedCount); // Format the number with commas
          setTimeout(updateCounter, 2);
        } else {
          // When the final value is reached, ensure it's formatted with commas
          counterElem.textContent = numberWithCommas(data.value); // Format the final number with commas
        }
      }

      updateCounter();
    }

    setInterval(function () {
      const timeSince = getTimeSince();
      const daysSinceText = `${timeSince.days} days, ${timeSince.hours} hours, ${timeSince.minutes} minutes, ${timeSince.seconds} seconds`;
      document.getElementById("days-since").textContent = daysSinceText;
    }, 1000);
  } catch (error) {
    console.error("Error:", error);
  }
});