// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { mdPlugin } from './plugin/colorful-md';
import MarkdownIt from 'markdown-it/lib';
import { ColorConfig, ConfigItem } from './util';
import { highlight } from './plugin/highlight';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
const LANGUAGES = ['markdown', 'md', 'mdx'];
export function activate(context: vscode.ExtensionContext) {
	const triggers = ['|', '|.', '|..', '|...'];
	const completionProvider = vscode.languages.registerCompletionItemProvider(LANGUAGES, {
		async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			const fontColorMap = vscode.workspace.getConfiguration().get('colorful-markdown.fontColorMap') as ColorConfig;
			const range = new vscode.Range(new vscode.Position(position.line, 0), position);
			const text = document.getText(range);
			const completionItemList: vscode.CompletionItem[] = Object.keys(fontColorMap).map(e=>({
				label: e,
				detail: fontColorMap[e].desc
			}))
			return completionItemList;
		}
	}, ...triggers);

	context.subscriptions.push(completionProvider);
	highlight(context);

	return {
		extendMarkdownIt(md: MarkdownIt) {
		  return md.use(mdPlugin)
		}
	}
}
// This method is called when your extension is deactivated
export function deactivate() {}
