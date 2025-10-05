import dataUrl from "../../data.json?url";
import type { AppData } from "../../types/types";

export async function fetchNetflixData(): Promise<AppData> {
	// Previous code fetching data from the frontend
	/*
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
	*/

	// Fetching data from the Express server
	const res = await fetch("http://localhost:3000/api/app-data");
	if (!res.ok) throw new Error(`HTTP ${res.status}`);

	const data: AppData = await res.json();
	return data;
}
