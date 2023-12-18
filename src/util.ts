import * as vscode from 'vscode';
import fs from 'fs';
import path from 'path';

export const colorSyntaxRegExp = /{([a-zA-Z0-9]+)( |\|[-=]?)(.*?)}/g;
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

export const wordDictionary:Map<string, Set<string>> = new Map();

export const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

// 判断一个路径是否是文件夹
const isDirectory = (path: string) => {
	try {
		return fs.lstatSync(path).isDirectory();
	}
	catch (e) {
		return false;
	}
}

export const getAllMarkdownFiles = (dirname: string) => {
	const files = fs.readdirSync(dirname);
	let res:string[] = [];
	for (const file of files) {
		if (file === 'node_modules') {
			continue;
		}
		if (isDirectory(path.join(dirname, file))) {
			res = res.concat(getAllMarkdownFiles(path.join(dirname, file)));
		}
		else {
			if (file.endsWith('.md') || file.endsWith('.mdx')) {
				res.push(path.join(dirname, file));
			}
		}
	}
	return res;
}

export const initDictionary = () => {
	if (!root) {
		return;
	}
	const files = getAllMarkdownFiles(root);
	files.forEach(e => {
		const data = fs.readFileSync(e, 'utf-8');
		const fileName = e;
		const set:Set<string> = new Set();
		const reg = colorSyntaxRegExp;
		let match = data.matchAll(reg);
		for (let i of match) {
			set.add(`${i[1]}${i[2]}${i[3]}`);
		}
		wordDictionary.set(fileName, set);
	})
}
