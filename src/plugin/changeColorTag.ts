import * as vscode from 'vscode';
import { ColorConfig } from '../util';

const changeColorTag = () => {
	// console.log(123);
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage('请打开文件');
		return;
	}
	const selection = editor.selection;
	const text = editor.document.getText(selection);
	vscode.window.showInputBox({
		ignoreFocusOut: true, // 当焦点移动到编辑器的另一部分或另一个窗口时, 保持输入框打开
		password: false, // 为 true 就表示是密码类型
		prompt: "请输入文本", // 文本输入提示
		value: text, // 默认值, 默认全部选中
		valueSelection: [6, -1],  // 指定选中的范围
	})
}

export const commandDispose = vscode.commands.registerCommand('colorful-markdown.changeColorTag', changeColorTag);