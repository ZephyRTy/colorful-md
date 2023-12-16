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

export const generateDecoration = (color: string, style?: object) => {
	return vscode.window.createTextEditorDecorationType({
		color,
		...style
	});
}
export const initDecoration = (decoration: ColorDecorationWithStyle, color: string) => {

	decoration.bold = {
		decorator: generateDecoration(color, { fontWeight: 'bold' }),
		decorationList: []
	}

	decoration.italic = {
		decorator: generateDecoration(color, { fontStyle: 'italic' }),
		decorationList: []
	}

	decoration.boldItalic = {
		decorator: generateDecoration(color, { fontWeight: 'bold', fontStyle: 'italic' }),
		decorationList: []
	}

	decoration.normal = {
		decorator: generateDecoration(color),
		decorationList: []
	}
}