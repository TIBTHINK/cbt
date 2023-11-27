const socket = io.connect("http://localhost:3001");

socket.on("counterUpdated", function (data) {
  document.getElementById("counter").textContent = numberWithCommas(data.value);
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var title, password1, password2, password3, password4;

fetch('config.json')
    .then(response => response.json())
    .then(data => {
        title = data.config.title;
        console.log(title);
        document.getElementById("title").textContent = title;
        document.getElementById("browser_title").textContent = title;
        // passwords
        password1 = data.password.OneHundred;
        password2 = data.password.TwohundredFifty;
        password3 = data.password.FiveHundred;
        password4 = data.password.OneThousand;
        start_date = data.config.start_date;
    })
    .catch(error => console.error(error));

function getTimeSince(start_date) {
  const startDate = new Date(start_date);
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
  const duration = 1000; 
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
      const difference = data.value - displayedCount;
      const step = Math.max(1, Math.ceil(difference * 0.05));
      if (displayedCount + step < data.value) {
        displayedCount += step;
        counterElem.textContent = numberWithCommas(displayedCount);
        setTimeout(updateCounter, 2);
      } else {
        counterElem.textContent = data.value; 
      }
    }

    updateCounter();
    counterElem.textContent = numberWithCommas(data.value);
  } catch (error) {
    console.error(error);
  }
}

async function incrementCounter(amount = 1, password = null, reason=true) {
  const counterElem = document.getElementById("counter");
  const currentCount = parseInt(counterElem.textContent, 10);
  try {
    if (password) {
      const input = prompt("Please enter the passcode:");
      if (input !== password) {
        throw new Error("Incorrect password");
      }
    }
    if (reason) {
      const input = prompt("Oh golly gee what did i say:");
      if (input === null) {
        throw new Error("No reason provided");
      }
      reasonRespones = input;
    }

    const response = await fetch("/increment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount, reason: reasonRespones }),
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

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");

  // Save the user's preference in localStorage
  if (body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
  } else {
      localStorage.setItem("darkMode", "disabled");
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
  }
});

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
          counterElem.textContent = numberWithCommas(displayedCount);
          setTimeout(updateCounter, 2);
        } else {
          counterElem.textContent = numberWithCommas(data.value); 
        }
      }

      updateCounter();
    }

    setInterval(function () {
      const timeSince = getTimeSince(start_date);
      const daysSinceText = `${timeSince.days} days, ${timeSince.hours} hours, ${timeSince.minutes} minutes, ${timeSince.seconds} seconds`;
      document.getElementById("days-since").textContent = daysSinceText;
    }, 1000);
  } catch (error) {
    console.error("Error:", error);
  }
});
