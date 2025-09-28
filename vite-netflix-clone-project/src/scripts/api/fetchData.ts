import dataUrl from "../../data.json?url";
import type { AppData } from "../../types/types";

export async function fetchNetflixData(): Promise<AppData> {
	try {
		const response = await fetch(dataUrl);
		if (!response.ok) {
			throw new Error(`HTTP Error! Status: ${response.status}`);
		}
		const data: AppData = await response.json();
		return data;
	} catch (error) {
		console.error("데이터를 가져오는 데 실패했습니다:", error);
		throw error;
	}
}
