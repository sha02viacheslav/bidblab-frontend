import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class FormValidationService {
	isBlank(control: FormControl) {
		return control && control.value && control.value.trim()
			? null
			: { blank: true };
	}

	isAdault(control: FormControl) {
		if (control && control.value) {
			var nowDate = new Date();
			var birthDate = control.value;
			var yearDif = nowDate.getFullYear() - birthDate.getFullYear();
			if (yearDif < 18) {
				return { notAdault: true };
			} else if (yearDif == 18) {
				var monthDif = nowDate.getMonth() - birthDate.getMonth();
				if (monthDif < 0) {
					return { notAdault: true };
				} else if (monthDif == 0) {
					var dayDif = nowDate.getDate() - birthDate.getDate();
					if (dayDif < 0) {
						return { notAdault: true };
					}
				}
			}
			return false;
		}
		return { notAdault: true };
	}

	arePasswordsMismatching(control: FormControl) {
		return control.value &&
			control.parent &&
			control.value === control.parent.get('password').value
			? null
			: {
				passwordsMismatch: true
			};
	}

	checkError(form, field, error) {
		if (Array.isArray(error)) {
			return error.some(
				err =>
					form.get(field).hasError(err) &&
					(form.get(field).dirty || form.get(field).touched)
			);
		} else {
			return (
				form.get(field).hasError(error) &&
				(form.get(field).dirty || form.get(field).touched)
			);
		}
	}
}
