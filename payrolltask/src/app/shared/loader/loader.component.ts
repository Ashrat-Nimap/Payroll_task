import { AfterViewInit, Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent implements AfterViewInit {
  isLoading = false;
  constructor(private loaderService: LoaderService) { }

  ngAfterViewInit() {
    this.loaderService.isLoading.subscribe(val => {
      this.isLoading = val;
    });
  }
}
