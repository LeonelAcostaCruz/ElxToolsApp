import { Component, inject, Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {


  @Input() title!: string;
  @Input() backButton: string;
  @Input() isModal!: boolean;
  @Input() showMenu!: boolean;

  utilSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {}

    dismissModal(){
      this.utilSvc.dismissModal();
    }
}
