import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  constructor(private router: Router){}


  ngOnInit(){

  }

  doSearch(keyWord:string){
    console.log(`value = ${keyWord}`);
    this.router.navigateByUrl(`/search/${keyWord}`)
  }
}
