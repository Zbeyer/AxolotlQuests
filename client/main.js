import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  const geCurrentTimeyElement = function () {
    const element = document.getElementById("current");
    return element;
  };

  const getDailyElement = function () {
    const element = document.getElementById("daily");
    return element;
  };

  const formatTime = function (time) {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds =
        date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12
    const timeString = `${formattedHours}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString()} ${ampm}`;
    return timeString;
  };

  const hoursUntilTarget = function (delta) {
    const seconds = Math.floor((delta % 3600000) / (1000 * 60));
    return seconds;
  };

  const minutessUntilTarget = function (delta) {
    const seconds = Math.floor((delta % 3600000) / (1000 * 60));
    return seconds;
  };

  const secondsUntilTarget = function (delta) {
    const seconds = Math.floor((delta % 60000) / 1000);
    return seconds;
  };

  const convertToUTCOffset = function (time, offset) {
    offset = offset || 0;
    const date = new Date(time);
    const k_ms = 3600000;
    const targetTime = new Date(date.getTime() + offset * k_ms);
    // console.log("offset is %o", offset);
    // console.log("delta is %o", date.getTime() - targetTime.getTime());

    // console.log(new Date(date.getTime()));
    const targetDate = new Date(targetTime.getTime());
    // console.log(targetDate);
    return targetDate;
  };

  const convertToUTC = function (localTime) {
    // Create a new Date object from the local time
    const date = new Date(localTime);

    // Extract the UTC components
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // Months are zero-based
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    // Format the UTC time as a string
    const utcTime =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day) +
        " " +
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);

    return utcTime;
  };

  const weeklyReset = function (now) {
    now = now || new Date();
    const nextMonday = new Date(now);
    nextMonday.setUTCDate(now.getUTCDate() + ((8 - now.getUTCDay()) % 7));
    nextMonday.setUTCHours(0, 0, 0, 0);

    const remainingTime = nextMonday - now;
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    document.getElementById(
        "weeklyreset"
    ).innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const countdownToTomorrow = function (now, element) {
    // Set the target date to tomorrow at midnight
    var targetDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
    );
    // Set the target date to tomorrow at midnight UTC
    var targetDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    );
    targetDate.setUTCHours(0, 0, 0, 0);

    // Calculate the difference between the target time and the current time
    var timeDifference = targetDate.getTime() - now;

    // Calculate hours, minutes, and seconds
    var hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    element.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
  };
  const currentTimeElement = geCurrentTimeyElement();
  const dailyResetElement = getDailyElement();
  const estElement = document.getElementById("time-east");
  const cstElement = document.getElementById("time-central");
  const mstElement = document.getElementById("time-mountain");
  const pstElement = document.getElementById("time-pacific");
  const akstElement = document.getElementById("time-alaska");
  const hastElement = document.getElementById("time-hawaii");

  const updateClock = function () {
    const now = new Date(); // Get the current time
    const currentTimeString = formatTime(now);
    const UTCTimeString = convertToUTC(now);
    currentTimeElement.innerHTML = currentTimeString + " - " + UTCTimeString;
    countdownToTomorrow(now, dailyResetElement);

    const utcTime = new Date(UTCTimeString);

    weeklyReset(now);

    let targetOffset = -5;
    // Eastern Standard Time (EST)	UTC-5
    // Central Standard Time (CST)	UTC-6
    // Mountain Standard Time (MST)	UTC-7
    // Pacific Standard Time (PST)	UTC-8
    // Alaska Standard Time (AKST)	UTC-9
    // Hawaii-Aleutian Standard Time (HAST) UTC-10
    estElement.innerHTML = formatTime(convertToUTCOffset(utcTime, targetOffset));
    targetOffset--;
    cstElement.innerHTML = formatTime(convertToUTCOffset(utcTime, targetOffset));
    targetOffset--;
    mstElement.innerHTML = formatTime(convertToUTCOffset(utcTime, targetOffset));
    targetOffset--;
    pstElement.innerHTML = formatTime(convertToUTCOffset(utcTime, targetOffset));
    targetOffset--;
    akstElement.innerHTML = formatTime(convertToUTCOffset(utcTime, targetOffset));
    targetOffset--;
    hastElement.innerHTML = formatTime(convertToUTCOffset(utcTime, targetOffset));
  };

  setInterval(updateClock, 180);

});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
