const cities = [
  {
    id: "1",
    country: "مصر",
    city: "القاهرة",
  },
  {
    id: "2",
    country: "المغرب",
    city: "المنامة",
  },
  {
    id: "3",
    country: "السعودية",
    city: "الرياض",
  },
  {
    id: "4",
    country: "مصر",
    city: "الإسكندرية",
  },
];

// function displayMatches() {
//   const matchArray = cities;
//   // console.log(searchBox.value);
//   if (searchBox.value === '') {
//     suggestions.innerHTML = `<div class="d-none"></div>`
//     return
//   }
//   const html = matchArray
//     .map((place) => {

//       const cityName =
//         `<span class="hl">${place.country}</span>`

//       const stateName =
//         `<span class="hl">${place.city}</span>`
//       return `
//       <li class="d-flex suggested">
//         <span><i class="fas fa-map-marker-alt"></i></span>
//         <span class="name">${cityName}، ${stateName}</span>
//       </li>
//     `;
//     })
//     .join("");
//   suggestions.innerHTML = html;
// }

const searchBox = document.querySelector("#searchBox");
const searchBoxIcon = document.querySelector(".left-pan");
// const suggestions = document.querySelector(".suggestions");


searchBoxIcon.addEventListener("click", function (evt) {
    fetchWeekPrayers(searchBox.value)
}, false);


let prayerTimes = {};
let today = new Date();
let todayDate = today.getFullYear() + "-" + ("00" + (today.getMonth() + 1)).slice(-2) + "-" + ("00" + today.getDate()).slice(-2);

// const getTimeStampOfDate = (time) => {
//   new Date(time).getTime();
// }


const fetchPrayerTimes = () => {
  fetch('https://api.pray.zone/v2/times/today.json?city=cairo&timeformat=1&school=3')
    .then(response => {
      return response.json()
    })
    .then(data => {
      // console.log(data);
      prayerTimes = { ...data.results.datetime[0].times }
      delete prayerTimes.Imsak
      delete prayerTimes.Sunrise
      delete prayerTimes.Sunset
      delete prayerTimes.Midnight

      for (time in prayerTimes) {
        prayerTimes[time] = `${todayDate} ${prayerTimes[time]}`
      }
      // console.log(prayerTimes)
      getCountDown();
    })
    .catch(function (error) {
      // console.log(error.message);
    });
}




function getCountDown() {
  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

  let upComingPrayer;
  let now = new Date().getTime();
  // console.log(prayerTimes);
  for (let key in prayerTimes) {

    let prayerTimeStamp = new Date(prayerTimes[key]).getTime();
    if (prayerTimeStamp > now) {
      upComingPrayer = prayerTimes[key];
      break;
    }
  }
  // console.log(upComingPrayer);
  countDown = new Date(upComingPrayer).getTime();

  const keys = Object.keys(prayerTimes)
  const values = Object.values(prayerTimes)
  const prayersNames = {};


  for (let i = 0; i < Object.keys(prayerTimes).length; i++) {
    prayersNames[values[i]] = keys[i]
  }

  myDate()

  setInterval(function () {
    let currentTime = new Date().getTime()
    distance = countDown - currentTime;
    // console.log(distance)
    let remainingHrs = parseInt(Math.floor((distance % (day)) / (hour)));
    if (remainingHrs < 10) remainingHrs = ("0" + remainingHrs).slice(-2)
    let remainingMinutes = parseInt(Math.floor((distance % (hour)) / (minute)));
    if (remainingMinutes < 10) remainingMinutes = ("0" + remainingMinutes).slice(-2)

    let remainingSeconds = parseInt(Math.floor((distance % (minute)) / second));
    if (remainingSeconds < 10) remainingSeconds = ("0" + remainingSeconds).slice(-2)


    document.getElementById("hoursFirst").innerText = parseInt(('' + remainingHrs)[0]);
    document.getElementById("hoursSecond").innerText = parseInt(('' + remainingHrs)[1]);
    document.getElementById("minutesFirst").innerText = parseInt(('' + remainingMinutes)[0]);
    document.getElementById("minutesSecond").innerText = parseInt(('' + remainingMinutes)[1]);
    document.getElementById("secondsFirst").innerText = parseInt(('' + remainingSeconds)[0]);
    document.getElementById("secondsSecond").innerText = parseInt(('' + remainingSeconds)[1]);

    //do something later when date is reached
    if (distance === 0) {
      getCountDown();
    }
    //seconds
  }, 0)
  document.getElementById("current-prayer").textContent = `${prayersNames[upComingPrayer]}`;
};

let weekTimes = {};

const fetchWeekPrayers = (city) => {
  fetch(`https://api.pray.zone/v2/times/this_week.json?city=${city ? city : 'cairo'}&timeformat=2&school=3`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      weekTimes = data.results.datetime

      document.querySelector("#city").innerHTML = city ? city : 'cairo'

      let container = document.getElementById('tb-body');

      container.innerHTML = ''

      weekTimes.map((time) => {
        let nd = new Date(time.date.gregorian);
        let row = `<tr>
        <th scope="row" class="${nd.getDay() == toDay ? 'active' : ''}">${weekdays[nd.getDay()]}</th>
        <td> ${time.times.Fajr} </td>
        <td> ${time.times.Sunrise} </td>
        <td> ${time.times.Dhuhr} </td>
        <td> ${time.times.Asr} </td>
        <td> ${time.times.Maghrib} </td>
        <td> ${time.times.Isha} </td>
      </tr>`

        container.innerHTML += row
      })

    })
    .catch(function (error) {
      // console.log(error.message);
    });
}


let weekdays = new Array(7);
weekdays[0] = "الاحد";
weekdays[1] = "الاثنين";
weekdays[2] = "الثلاثاء";
weekdays[3] = "الاربعاء";
weekdays[4] = "الخميس";
weekdays[5] = "الجمعة";
weekdays[6] = "السبت";

const toDay = new Date().getDay();

function myDate() {
  const a = new Date();
  const r = weekdays[a.getDay()];
  document.getElementById("today").innerHTML = r;
}


const getLocation = () => {
  fetch('http://ipinfo.io').then(
    res => {
      return res.json();
    }
  ).then(
    data => {
      return console.log(data)
    }
  )
}



window.onload = [fetchPrayerTimes(), fetchWeekPrayers()];
