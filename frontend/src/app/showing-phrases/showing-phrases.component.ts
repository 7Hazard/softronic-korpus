import { Component, OnInit } from '@angular/core';
import { backend } from 'src/backend';

@Component({
  selector: 'app-showing-phrases',
  templateUrl: './showing-phrases.component.html',
  styleUrls: ['./showing-phrases.component.styl']
})
export class ShowingPhrasesComponent implements OnInit {

  async ngOnInit() {
    try {
      let response = await backend.get("/phrases")
      if(response.status != 200)
        alert(response.data)
      else {
        this.phrases = response.data
      }
    } catch (error) {
      alert(error)
    }
  }

  phrases = [];

}
