function clone(date, index) {
	const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	return new Date(copy.getFullYear(), copy.getMonth(), copy.getDate() + index);
}
function getNameByIndex(index, list) {
	return list.at(index).getMonth();
}

function getDays(year) {
	var date = new Date(year, 0, 1);
	const firstDay = date.getDay();
	while (date.getDay() != 0) {
		date.setDate(date.getDate() + 1);
	}
	const days = [];
	while (date.getFullYear() == year) {
		days.push(new Date(year, date.getMonth(), date.getDate()));
		date.setDate(date.getDate() + 7);
	}
	return { days, weeks: days, firstDay, patch: 7 - firstDay };
}
export function generateCalendar(yearOrDate) {
	var year;
	if (yearOrDate instanceof Date) {
		year = yearOrDate.getFullYear();
	} else {
		year = yearOrDate;
	}
	if (isNaN(year)) {
		throw new TypeError(`Expected Date or Number,\nbut got "${yearOrDate}"`);
	}
	const { weeks, patch } = getDays(year);
	const result = Array.from({ length: 12 }, () => []);
	if (patch != 7) {
		const days = Array.from(
			{ length: patch },
			(_, index) => new Date(year, 0, 1 + index)
		);
		result[0].unshift({ days: days, week: 52 });
	}
	for (let index = 0; index < weeks.length; index++) {
		const date = weeks[index];
		const days = Array.from({ length: 7 }, (_, index) => clone(date, index));
		const leftIndex = getNameByIndex(0, days);
		const rightIndex = getNameByIndex(-1, days);
		const left = [];
		const right = [];
		const week = index + 1;
		for (const date of days) {
			const name = date.getMonth();
			if (name == leftIndex) left.push(date);
			else right.push(date);
		}
		if (right.length) {
			if (rightIndex != 0 && leftIndex != 11) {
				result[rightIndex].push({
					days: right,
					week,
				});
			}
		}
		result[leftIndex].push({ days: left, week });
	}
	return result;
}
