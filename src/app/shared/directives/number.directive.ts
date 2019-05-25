import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import { NgControl } from "@angular/forms";

@Directive({
    selector: '[numeric]'
})

export class NumericDirective implements OnInit{

    private desktopKeyCode = {
        Backspace: 8,
        Enter: 13
    };
    private mobileKeyCode = {
        Backspace: 229,
        Enter: 13
    };

    @Input('numericType') numericType: string; // number | decimal
    private cntKeyPress: number = 0;

    private regex = {
        number: new RegExp(/^\d+$/),
        decimal: new RegExp(/^\d*\.?\d{0,2}$/g)
        // decimal: new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g)
    };

    private specialKeys = {
        number: [ 'Backspace', 'Enter', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight' ],
        decimal: [ 'Backspace', 'Enter', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight' ],
    };

    constructor(
        private el: ElementRef,
        private control : NgControl
    ) { }

    ngOnInit(){
        this.el.nativeElement.value = '0.00';
    }

    @HostListener('keydown', [ '$event' ])
    onKeyDown(event: KeyboardEvent) {
        var temp;
        var keyTemp = String(event.key);
        if(event.keyCode == this.desktopKeyCode.Enter || event.keyCode == this.mobileKeyCode.Enter){
            return;
        }
        else if(event.keyCode == this.desktopKeyCode.Backspace || event.keyCode == this.mobileKeyCode.Backspace){
            setTimeout(() => {
                temp = (Math.floor(Number(this.el.nativeElement.value) * 10)/100).toFixed(2);
                this.control.control.setValue(temp);
            }, 100);
        }
        else if(keyTemp.match(new RegExp(/^[a-zA-Z]*\d+$/)) != null){
            temp = ((Number(this.el.nativeElement.value) * 1000 + Number(keyTemp)) / 100).toFixed(2);
            this.control.control.setValue(temp);
        }
        event.preventDefault();
        // }
        // else{
        //     if (this.specialKeys[this.numericType].indexOf(event.key) !== -1) {
        //         return;
        //     }
        //     // Do not use event.keycode this is deprecated.
        //     // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        //     let current: string = this.el.nativeElement.value;
        //     let next: string = current.concat(event.key);
        //     if (next && !(next).match(this.regex[this.numericType])) {
        //         event.preventDefault();
        //     }
        // }
    }
}