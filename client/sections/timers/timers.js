import {Template} from "meteor/templating";
const getDailyElement = function () {
	const element = document.getElementById("daily");
	return element;
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
	now = now || new Date();
	let targetDate = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
	);
	targetDate.setUTCHours(0, 0, 0, 0);
	let timeDifference = targetDate.getTime() - now;

	// Calculate hours, minutes, and seconds
	let hours = Math.floor(
		(timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
	element.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
};

const updateClock = function () {
	const now = new Date(); // Get the current time
	// const currentTimeString = formatTime(now);
	// const UTCTimeString = convertToUTC(now);
	// const currentTimeElement = geCurrentTimeElement();
	// if (!currentTimeElement) return;
	// currentTimeElement.innerHTML = currentTimeString + " - " + UTCTimeString;
	const dailyResetElement = getDailyElement();
	if (!dailyResetElement) return;
	countdownToTomorrow(now, dailyResetElement);
	weeklyReset(now);
	/**
	 *   let targetOffset = -5;
    Eastern Standard Time (EST)	UTC-5
    Central Standard Time (CST)	UTC-6
    Mountain Standard Time (MST)	UTC-7
    Pacific Standard Time (PST)	UTC-8
    Alaska Standard Time (AKST)	UTC-9
    Hawaii-Aleutian Standard Time (HAST) UTC-10
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
	 **/
};

Template.timers.rendered = function() {
	setInterval(updateClock, 180);
}