export interface ContentItem {
	image: string;
	alt: string;
}

export interface Notification extends ContentItem {
	title: string;
	desc: string;
}

export interface Profile {
	name: string;
	avatar: string;
}

export interface CarouselData {
	id: string;
	title: string;
	items: ContentItem[];
}

export interface HeroData {
	rank: string;
	description: string;
	image: string;
}

export interface AppData {
	hero: HeroData;
	notifications: Notification[];
	profiles: Profile[];
	carousels: CarouselData[];
	top10: ContentItem[];
}
