import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'onboardly';

  constructor(private router: Router) {}

  onSidebarEmit(event: any): void{

    if (event.detail?.item?.label) {
      const label = event.detail.item.label;
      console.log("Detail item label:", label);

      // Define las rutas para cada microfrontend
      const sidebarRoutes: { [key: string]: string } = {
        'Colaboradores': '/collaborators',
        'Dashboard': '/dashboard',
        'Calendario': '/calendar'
      };

      if (label in sidebarRoutes) {
        this.router.navigate([sidebarRoutes[label]]);
      } else {
        console.error(`No route found for label: ${label}`);
      }
    }
  }
}
