<template>
	<KxBaseDialog title='编辑器帮助' :click-to-close='true'>
		<p>评论使用 Markdown，点击预览按钮可以查看排版。</p>
		<p>除标准的 Markdown 外还支持以下语法：</p>
		<ul>
			<li><p>视频：@video[描述](URL)</p></li>
			<li><p>视频作为动图：@gif[描述](URL)</p></li>
			<li><p>音频：@audio[](URL)</p></li>
		</ul>
		<KxDialogButtons :on-accept='$dialog.close'/>
	</KxBaseDialog>
</template>

<script setup lang="ts">
import { KxBaseDialog, KxDialogButtons } from "@kaciras-blog/uikit";</script>
