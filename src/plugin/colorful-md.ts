import type MarkdownIt from "markdown-it/lib"
import StateCore from 'markdown-it/lib/rules_core/state_core';
import * as vscode from 'vscode';
import { ColorConfig, ConfigItem, colorSyntaxRegExp } from "../util";
function exampleRule(state: StateCore): boolean {
	for (const token of state.tokens) {
	  if (token.type === "paragraph_open") {
		console.log('token');
		token.attrJoin("style", "color:blue;")
	  }
	}
	return true
}

export const mdPlugin = (md: MarkdownIt) => {
	md.renderer.rules.text = function(tokens, idx, options, env, self) {
		const fontColorMap = vscode.workspace.getConfiguration().get('colorful-markdown.fontColorMap') as ColorConfig;
		const token = tokens[idx];
		if (token.type === 'text') {
			if (colorSyntaxRegExp.test(token.content)) {
				token.content = token.content.replaceAll(colorSyntaxRegExp , (match, p1, p2, p3) => {
					const getStyle = (str: string) => {
						switch(str) {
							case '|': 
								return 'class="colorful-md-italic"';
							case '|-':
								return 'class="colorful-md-bold"';
							case '|=':
								return 'class="colorful-md-bold colorful-md-italic"';
							default: 
								return '';
						}
					}
					const color = fontColorMap[p1]?.color;
					if (!color) {
						return match;
					}
					return `<!--beforebegin--><span style="color: ${color}" ${getStyle(p2)}>` +
					`<!--afterbegin-->${p3}<!--beforeend--></span><!--afterend-->`;
				})
			};
		}
		return token.content;
	 };
}