import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {

  constructor(private el : ElementRef) { }

  @HostListener('input',['$event']) onInput(){
    const inputval = this.el.nativeElement.value;
    this.el.nativeElement.value = inputval.replace(/[^0-9]/g,'');
  } 

}
