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
    if(control && control.value){
      var ageDifMs = Date.now() - control.value.getTime();
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      var age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if( age >= 18){
        return null;
      }
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
