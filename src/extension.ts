// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { mdPlugin } from './plugin/colorful-md';
import MarkdownIt from 'markdown-it/lib';
import { ColorConfig, initDictionary, wordDictionary } from './util';
import { highlight } from './plugin/highlight';
import { commandDispose } from './plugin/changeColorTag';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
const LANGUAGES = ['markdown', 'md', 'mdx'];
export function activate(context: vscode.ExtensionContext) {
	const triggers = ['{'];
	initDictionary();
	const completionProvider = vscode.languages.registerCompletionItemProvider(LANGUAGES, {
		async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			const fontColorMap = vscode.workspace.getConfiguration().get('colorful-markdown.fontColorMap') as ColorConfig;
			const completionItemList: vscode.CompletionItem[] = Object.keys(fontColorMap).map(e=>({
				label: e,
				detail: fontColorMap[e].desc
			}))
			const wordItemSet: Set<string> = new Set();
			for (let i of [...wordDictionary.values()]) {
				for (let j of [...i]) {
					wordItemSet.add(j);
				}
			}
			const wordItemList: vscode.CompletionItem[] = []
			wordItemSet.forEach(e=>{
				wordItemList.push({
					label: e
				})
			})
			return [...completionItemList, ...wordItemList];
		}
	}, ...triggers);
	context.subscriptions.push(completionProvider);
	context.subscriptions.push(commandDispose);
	highlight(context);

	return {
		extendMarkdownIt(md: MarkdownIt) {
		  return md.use(mdPlugin)
		}
	}
}
// This method is called when your extension is deactivated
export function deactivate() {}
