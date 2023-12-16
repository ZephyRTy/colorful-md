import * as vscode from 'vscode';

export const colorSyntaxRegExp = /\|(\.{0,3})([a-zA-Z]+):(.*?)\|/g;
export interface ConfigItem {
	color: string;
	desc?: string;
}

export type ColorConfig = Record<string, ConfigItem>;

export interface ColorDecoration {
	decorator: vscode.TextEditorDecorationType,
	decorationList: vscode.DecorationOptions[]
}

export interface ColorDecorationWithStyle {
	bold: ColorDecoration,
	italic: ColorDecoration,
	boldItalic: ColorDecoration,
	normal: ColorDecoration
}

export const generateDecoration = (color: string, style: object = {}) => {
	return vscode.window.createTextEditorDecorationType({
		color,
		...style
	});
}