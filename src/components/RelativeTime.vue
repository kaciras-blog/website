<!--
对 <time> 的简单封装，提供了格式化时间的功能，使用原生的 Internationalization API。

这里把绝对时间（Absolute time）称为时刻，相对时间（Relative time）称为时差（Duration）。
-->

<template>
	<time :title='title' :datetime='date.toISOString()'>{{ text }}</time>
</template>

<script lang='ts'>
// 时刻的格式是 yyyy-MM-dd HH:mm，瑞典正好符合。
const dateTimeMinute = new Intl.DateTimeFormat("sv", {
	day: "numeric",
	month: "numeric",
	year: "numeric",
	hour: "numeric",
	hour12: false,
	minute: "2-digit",
});

const dateOnly = new Intl.DateTimeFormat("sv", {
	day: "numeric",
	month: "numeric",
	year: "numeric",
});

// TODO: support i18n in the next major release.
const relative = new Intl.RelativeTimeFormat("zh-CN", {
	numeric: "auto",
});

const divisions: any = [
	60,			"second",
	60,			"minute",
	24,			"hour",
	7,			"day",
	4.34524,	"week",
	12,			"month",
	Infinity,	"year",
];
</script>

<script setup lang='ts'>
import { computed } from "vue";

interface RelativeTimeProps {
	/**
	 * 如果时差（秒）大于该值，直接显示时刻，否则显示格式化后的时差。
	 *
	 * 默认是一年，设为 0 只显示时刻，设为 Infinity 只显示时差。
	 */
	threshold?: number;

	/**
	 * 时刻值，数字类型以毫秒作单位，不能为负数，可以大于当前时刻。
	 */
	value: Date | number;
}

const props = withDefaults(defineProps<RelativeTimeProps>(), {
	threshold: 31536e+3, // 1 年
});

const date = computed(() => {
	const { value } = props;
	return typeof value === "number" ? new Date(value) : value;
});

const title = computed(() => dateTimeMinute.format(date.value));

const text = computed(() => {
	let duration = date.value.getTime() - new Date().getTime();

	const sign = duration >= 0 ? 1 : -1;
	duration = Math.abs(duration / 1000);

	if (duration > props.threshold) {
		return dateOnly.format(date.value);
	}

	/*
	 * xxxTimeFormat.format() 使用的是小数而不是模数，区别如下：
	 * 小数：90s -> 1.5m
	 * 模数：90s -> 1m 30s
	 *
	 * 显然模数更适合表示时差，这玩意的 API 不太好用，得自己先处理下。
	 */
	let i = 0;
	for (; i < divisions.length; i += 2) {
		const d = divisions[i];
		if (duration < d) {
			break;
		} else {
			duration /= d;
		}
	}
	duration = sign * Math.round(duration);
	return relative.format(duration, divisions[i + 1]);
});
</script>
