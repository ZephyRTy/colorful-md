import * as vscode from 'vscode';
import { ColorConfig, ColorDecorationWithStyle, colorSyntaxRegExp, generateDecoration } from '../util';

const isSame = (a: ColorConfig, b: ColorConfig) => {
	const aKey = Object.keys(a).join(',');
	const bKey = Object.keys(b).join(',');
	if (aKey !== bKey) {
		return false;
	}
	const aColor = Object.keys(a).map(e => a[e].color).join(',');
	const bColor = Object.keys(b).map(e => b[e].color).join(',');
	return aColor === bColor;
}

export const highlight = (context: vscode.ExtensionContext) => {
		
	let timeout: NodeJS.Timer | undefined = undefined;

	let activeEditor = vscode.window.activeTextEditor;

	let configMap = vscode.workspace.getConfiguration().get('colorful-markdown.fontColorMap') as ColorConfig;
	let decoratorMap = {} as {[key: string]: ColorDecorationWithStyle};
	Object.keys(configMap).forEach(e => {
		decoratorMap[e] = {
			bold: {
				decorator: generateDecoration(configMap[e].color, { fontWeight: 'bold' }),
				decorationList: []
			},

			italic: {
				decorator: generateDecoration(configMap[e].color, { fontStyle: 'italic' }),
				decorationList: []
			},
			boldItalic: {
				decorator: generateDecoration(configMap[e].color, { fontWeight: 'bold', fontStyle: 'italic'}),
				decorationList: []
			},
			normal: {
				decorator: generateDecoration(configMap[e].color),
				decorationList: []
			},

		}
	})
	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const curConfigMap = vscode.workspace.getConfiguration().get('colorful-markdown.fontColorMap') as ColorConfig;
		if (!isSame(curConfigMap, configMap)) {
			configMap = curConfigMap;
			decoratorMap = {};
			Object.keys(configMap).forEach(e => {
				decoratorMap[e] = {
					bold: {
						decorator: generateDecoration(configMap[e].color, { fontWeight: 'bold' }),
						decorationList: []
					},
					italic: {
						decorator: generateDecoration(configMap[e].color, { fontStyle: 'italic' }),
						decorationList: []
					},
					boldItalic: {
						decorator: generateDecoration(configMap[e].color, { fontWeight: 'bold', fontStyle: 'italic'}),
						decorationList: []
					},
					normal: {
						decorator: generateDecoration(configMap[e].color),
						decorationList: []
					},
		
				}
			})
		}
		const text = activeEditor.document.getText();
		let match;

		while ((match = colorSyntaxRegExp.exec(text))) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);
			const styleVar = match[2];
			const colorName = match[1];
			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: match[3] || '' };
			let style = 'normal' as keyof ColorDecorationWithStyle;
			switch (styleVar) {
				case '|':
					style = 'italic';
					break;
				case '|-':
					style = 'bold';
					break;
				case '|=':
					style = 'boldItalic';
					break;
				default:
					style = 'normal';
			}
			decoratorMap[colorName]?.[style].decorationList.push(decoration);
		}
		Object.keys(decoratorMap).forEach(e => {
			for (const i in decoratorMap[e]) {
				const key = i as keyof ColorDecorationWithStyle
				const ele = decoratorMap[e][key]
				activeEditor!.setDecorations(ele.decorator, ele.decorationList);
				decoratorMap[e][key].decorationList = [];
			}
		})
	}

	function triggerUpdateDecorations(throttle = false) {
		if (timeout) {
			clearTimeout(timeout as any);
			timeout = undefined;
		}
		if (throttle) {
			timeout = setTimeout(updateDecorations, 500);
		} else {
			updateDecorations();
		}
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations(true);
		}
	}, null, context.subscriptions);
}