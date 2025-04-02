import { Component } from '@angular/core';
import { AuthserviceService } from '../../services/authservice.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mytask',
  templateUrl: './mytask.component.html',
  styleUrl: './mytask.component.scss'
})
export class MytaskComponent {
  Username: any

  constructor(private authService: AuthserviceService){}

  ngOnInit(): void {
    this.Username = this.authService.getUsername(); 
  }
}
