import dataUrl from "../data.json?url";

export async function checkFetch() {
	try {
		const response = await fetch(dataUrl);
		if (!response.ok) {
			throw new Error(`HTTP 에러! 상태: ${response.status}`);
		}
		const data = await response.json();

		console.log("fetch 성공!", data);

		return data;
	} catch (error) {
		console.error("fetch 실패!", error);
	}
}
