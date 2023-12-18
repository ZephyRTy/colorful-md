import { wordDictionary } from "../util"

export const addToDictionary = (data: string, fileName: string) => {
	if (wordDictionary.has(fileName)) {
		wordDictionary.get(fileName)?.add(data);
		return;
	}
	const set:Set<string> = new Set()
	set.add(data);
	wordDictionary.set(fileName, set);
}