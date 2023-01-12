<template>
	<time :title='title' :datetime='date.toISOString()'>{{ text }}</time>
</template>

<script lang='ts'>
const locale = "zh-CN"; // TODO: support i18n in next major release.

const absolute = new Intl.DateTimeFormat(locale, {
	day: "numeric",
	month: "numeric",
	year: "numeric",
	hour: "numeric",
	minute: "2-digit",
});

const dateOnly = new Intl.DateTimeFormat(locale, {
	day: "numeric",
	month: "numeric",
	year: "numeric",
});

const relative = new Intl.RelativeTimeFormat(locale, {
	numeric: "auto",
});

const divisions: any = [
	60, "second",
	60, "minute",
	24, "hour",
	7, "day",
	4.34524, "week",
	12, "month",
	Infinity, "year",
];
</script>

<script setup lang='ts'>
import { computed } from "vue";

interface RelativeTimeProps {
	value: Date | number;
}

const props = defineProps<RelativeTimeProps>();

const date = computed(() => {
	const { value } = props;
	return typeof value === "number" ? new Date(value) : value;
});

const title = computed(() => absolute.format(date.value));

const text = computed(() => {
	let value = date.value.getTime() - new Date().getTime();

	const sign = value >= 0 ? 1 : -1;
	value = Math.abs(value / 1000);

	// Display absolute time if it greater than 1 year.
	if (value > 31536e+3) {
		return dateOnly.format(date.value);
	}

	let i = 0;
	for (; i < divisions.length; i += 2) {
		const d = divisions[i];
		if (value < d) {
			break;
		} else {
			value /= d;
		}
	}
	value = sign * Math.round(value);
	return relative.format(value, divisions[i + 1]);
});
</script>
