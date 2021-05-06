import { Component } from '@angular/core';
import { backend } from './backend';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  title = 'frontend';
  async signin() {
    try {
      let response = await backend.post("/signin", {
        username: "john", password: "doe"
      })
      alert(`${response.status}\n${response.data}`)
    } catch (error) {
      alert(error)
    }
  }
}
