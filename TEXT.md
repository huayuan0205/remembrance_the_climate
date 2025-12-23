这个布局和模块的调整，样式应该是处理不了的。
如何用 js 脚本处理，就在代码里调整就行，如下

1. 布局调整 `1-1,2，2-1,2`
````js
//script.js-line214
	text_item.append("tspan")
		.text(d => d.title)
		.attr('class','tspan-top')
		.attr('id','text-title')	
		.attr('x', 0)
		.attr('dy', '1em')
		.call(wrap,1,1,text_wrap_width_title)
````

如你的需求，你这里创建两个 text_item 即可，分别把 对应的两个 tspan 的元素 append 进去即可


2. 针对 title 内容，是动态变化，且为 1~n行不固定的处理，且需要当内容不足时，不能占着那个位置，需要高度做自适应的处理
这个问题比较麻烦处理些，看了下，你的脚本内没有处理的相关方法。
一是可以简单处理下，比如你就处理 1 or 2行的情况，把内容 也就是 text_item 的数据做上标识，表示当前的 title 是 1 行还是 2 行

如：
这条元素，你做个标识 `2`，它是一个需要预留两行位置的 数据元素，那么你在 append 的时候，下面的 坐标，或者当前 text_item 的坐标就可以针对 设置相应的 y 了。
````
11 2	5/7/2020	Trees Provide Relief	Vassal Lane Climate Resilience Trail	11	Vassal Lane was turned into a cool corridor when trees planted grew to shade the street.			42.12	-71.02
````

然后是复杂点做，如何让这个显示更灵活和通用，兼容 n 行
 - 需要一个能够判断当前 动态 title 是几行的方法
 - 然后每次渲染时，动态计算得出对应的高度，也设置对应的 y 即可
 - 如何编写这样一个 动态获取 title的方法？这个目前已有 解决方案 如 https://www.w3school.com.cn/tags/canvas_measuretext.asp，核心就是 `measureText` 这个。
 
measureText
这个是计算宽度的，你首先是设定 一行有多宽，然后拿这个计算得出后，除以即可。
