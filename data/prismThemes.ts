export const PRISM_THEMES = {
    tomorrow: {
        name: 'Tomorrow Night',
        css: `
code[class*="language-"],
pre[class*="language-"] {
	color: #ccc;
	background: none;
	font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
	font-size: 1em;
	text-align: left;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
	line-height: 1.5;
	-moz-tab-size: 4;
	-o-tab-size: 4;
	tab-size: 4;
	-webkit-hyphens: none;
	-moz-hyphens: none;
	-ms-hyphens: none;
	hyphens: none;
}
pre[class*="language-"] {
	padding: 1em;
	margin: .5em 0;
	overflow: auto;
}
:not(pre) > code[class*="language-"],
pre[class*="language-"] {
	background: #2d2d2d;
}
:not(pre) > code[class*="language-"] {
	padding: .1em;
	border-radius: .3em;
	white-space: normal;
}
.token.comment,
.token.block-comment,
.token.prolog,
.token.doctype,
.token.cdata {
	color: #999;
}
.token.punctuation {
	color: #ccc;
}
.token.tag,
.token.attr-name,
.token.namespace,
.token.deleted {
	color: #e2777a;
}
.token.function-name {
	color: #6196cc;
}
.token.boolean,
.token.number,
.token.function {
	color: #f08d49;
}
.token.property,
.token.class-name,
.token.constant,
.token.symbol {
	color: #f8c555;
}
.token.selector,
.token.important,
.token.atrule,
.token.keyword,
.token.builtin {
	color: #cc99cd;
}
.token.string,
.token.char,
.token.attr-value,
.token.regex,
.token.variable {
	color: #7ec699;
}
.token.operator,
.token.entity,
.token.url {
	color: #67cdcc;
}
.token.important,
.token.bold {
	font-weight: bold;
}
.token.italic {
	font-style: italic;
}
.token.entity {
	cursor: help;
}
.token.inserted {
	color: green;
}
`
    },
    okaidia: {
        name: 'Okaidia',
        css: `
code[class*="language-"],
pre[class*="language-"] {
	color: #f8f8f2;
	background: none;
	text-shadow: 0 1px rgba(0, 0, 0, 0.3);
	font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
	font-size: 1em;
	text-align: left;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
	line-height: 1.5;
	-moz-tab-size: 4;
	-o-tab-size: 4;
	tab-size: 4;
	-webkit-hyphens: none;
	-moz-hyphens: none;
	-ms-hyphens: none;
	hyphens: none;
}
pre[class*="language-"] {
	padding: 1em;
	margin: .5em 0;
	overflow: auto;
	border-radius: 0.3em;
}
:not(pre) > code[class*="language-"],
pre[class*="language-"] {
	background: #272822;
}
:not(pre) > code[class*="language-"] {
	padding: .1em;
	border-radius: .3em;
	white-space: normal;
}
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
	color: #8292a2;
}
.token.punctuation {
	color: #f8f8f2;
}
.token.namespace {
	opacity: .7;
}
.token.property,
.token.tag,
.token.constant,
.token.symbol,
.token.deleted {
	color: #f92672;
}
.token.boolean,
.token.number {
	color: #ae81ff;
}
.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
	color: #a6e22e;
}
.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string,
.token.variable {
	color: #f8f8f2;
}
.token.atrule,
.token.attr-value,
.token.function,
.token.class-name {
	color: #e6db74;
}
.token.keyword {
	color: #66d9ef;
}
.token.regex,
.token.important {
	color: #fd971f;
}
.token.important,
.token.bold {
	font-weight: bold;
}
.token.italic {
	font-style: italic;
}
.token.entity {
	cursor: help;
}
`
    },
    solarizedLight: {
        name: 'Solarized Light',
        css: `
code[class*="language-"],
pre[class*="language-"] {
	color: #657b83;
	font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
	font-size: 1em;
	text-align: left;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
	line-height: 1.5;
	-moz-tab-size: 4;
	-o-tab-size: 4;
	tab-size: 4;
	-webkit-hyphens: none;
	-moz-hyphens: none;
	-ms-hyphens: none;
	hyphens: none;
}
pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
	background: #073642;
}
pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
code[class*="language-"]::selection, code[class*="language-"] ::selection {
	background: #073642;
}
pre[class*="language-"] {
	padding: 1em;
	margin: .5em 0;
	overflow: auto;
	border-radius: 0.3em;
}
:not(pre) > code[class*="language-"],
pre[class*="language-"] {
	background-color: #fdf6e3;
}
:not(pre) > code[class*="language-"] {
	padding: .1em;
	border-radius: .3em;
}
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
	color: #93a1a1;
}
.token.punctuation {
	color: #586e75;
}
.token.namespace {
	opacity: .7;
}
.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
	color: #268bd2;
}
.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.url,
.token.inserted {
	color: #2aa198;
}
.token.entity {
	color: #657b83;
	background: #eee8d5;
}
.token.atrule,
.token.attr-value,
.token.keyword {
	color: #859900;
}
.token.function,
.token.class-name {
	color: #b58900;
}
.token.regex,
.token.important,
.token.variable {
	color: #cb4b16;
}
.token.important,
.token.bold {
	font-weight: bold;
}
.token.italic {
	font-style: italic;
}
.token.entity {
	cursor: help;
}
`
    },
    coy: {
        name: 'Coy (Light)',
        css: `
code[class*="language-"],
pre[class*="language-"] {
	color: black;
	background: none;
	font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
	font-size: 1em;
	text-align: left;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
	line-height: 1.5;
	-moz-tab-size: 4;
	-o-tab-size: 4;
	tab-size: 4;
	-webkit-hyphens: none;
	-moz-hyphens: none;
	-ms-hyphens: none;
	hyphens: none;
}
pre[class*="language-"] {
	position: relative;
	margin: .5em 0;
	overflow: visible;
	padding: 1px;
}
pre[class*="language-"] > code {
	position: relative;
	z-index: 1;
	border-left: 10px solid #358ccb;
	box-shadow: -1px 0px 0px 0px #358ccb, 0px 0px 0px 1px #dfdfdf;
	background-color: #fdfdfd;
	background-image: linear-gradient(transparent 50%, rgba(69, 142, 209, 0.04) 50%);
	background-size: 3em 3em;
	background-origin: content-box;
	background-attachment: local;
}
code[class*="language-"] {
	max-height: inherit;
	height: inherit;
	padding: 0 1em;
	display: block;
	overflow: auto;
}
:not(pre) > code[class*="language-"],
pre[class*="language-"] {
	background-color: #fdfdfd;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
	margin-bottom: 1em;
}
:not(pre) > code[class*="language-"] {
	position: relative;
	padding: .2em;
	border-radius: 0.3em;
	color: #c92c2c;
	border: 1px solid rgba(0, 0, 0, 0.1);
	display: inline;
	white-space: normal;
}
.token.comment,
.token.block-comment,
.token.prolog,
.token.doctype,
.token.cdata {
	color: #7D8B99;
}
.token.punctuation {
	color: #5F6364;
}
.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.function-name,
.token.constant,
.token.symbol,
.token.deleted {
	color: #c92c2c;
}
.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.function,
.token.builtin,
.token.inserted {
	color: #2f9c0a;
}
.token.operator,
.token.entity,
.token.url,
.token.variable {
	color: #a67f59;
	background: rgba(255, 255, 255, 0.5);
}
.token.atrule,
.token.attr-value,
.token.keyword,
.token.class-name {
	color: #1990b8;
}
.token.regex,
.token.important {
	color: #e90;
}
.language-css .token.string,
.style .token.string {
	color: #a67f59;
	background: rgba(255, 255, 255, 0.5);
}
.token.important {
	font-weight: normal;
}
.token.bold {
	font-weight: bold;
}
.token.italic {
	font-style: italic;
}
.token.entity {
	cursor: help;
}
.token.namespace {
	opacity: .7;
}
pre[class*="language-"].line-numbers.line-numbers {
	padding-left: 0;
}
pre[class*="language-"].line-numbers.line-numbers code {
	padding-left: 3.8em;
}
pre[class*="language-"].line-numbers.line-numbers .line-numbers-rows {
	left: 0;
}
pre[class*="language-"][data-line] {
	padding-top: 0;
	padding-bottom: 0;
	padding-left: 0;
}
pre[data-line] code {
	position: relative;
	padding-left: 4em;
}
pre .line-highlight {
	margin-top: 0;
}
`
    }
};

export type PrismThemeKey = keyof typeof PRISM_THEMES;
