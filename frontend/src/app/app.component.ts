import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { setCookie } from 'src/cookies';
import { backend } from 'src/backend';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  // loginForm = this.formBuilder.group({

  // })
  loginForm: FormGroup

  constructor(formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      username: "",
      password: ""
    })
  }

  async signin() {
    if(!this.loginForm.valid) return
    try {
      let response = await backend.post("/signin", {
        username: this.loginForm.get("username").value,
        password: this.loginForm.get("password").value
      })
      alert(`${response.status}\n${JSON.stringify(response.data)}`)
      if(response.status == 200)
      {
        setCookie("token", response.data.token, 1)
      }
    } catch (error) {
      alert(error)
    }
  }
}
