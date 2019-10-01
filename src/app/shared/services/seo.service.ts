import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
	providedIn: 'root'
})
export class SeoService {
	constructor(
		private title: Title,
		private meta: Meta,
		@Inject(DOCUMENT) private doc) {
	}
	setPageTitle(title: string) {
		this.title.setTitle(title);
	}
	getPageTitle() {
		return this.title.getTitle();
	}
	updateMetaDescription(content: string) {
		this.meta.updateTag({ name: 'description', content: content });
	}
	createLinkForCanonicalURL() {
		let links = this.doc.querySelectorAll("link[rel='canonical']");
		if(links.length) {
			links[0].setAttribute('href', this.doc.URL);
		} else {
			let link: HTMLLinkElement = this.doc.createElement('link');
			link.setAttribute('rel', 'canonical');
			this.doc.head.appendChild(link);
			link.setAttribute('href', this.doc.URL);
		}
	}
} 