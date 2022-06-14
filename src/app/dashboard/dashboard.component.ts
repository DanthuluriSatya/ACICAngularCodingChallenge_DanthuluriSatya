import { Component, OnInit } from '@angular/core';
import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import {InMemoryDataService} from '../in-memory-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];
  popularLinesOfBusiness: LineOfBusiness[] = [];

  constructor(private lineOfBusinessService: LineOfBusinessService, private inMemoryService: InMemoryDataService) { }

  ngOnInit() {
    this.getLinesOfBusiness();
    this.getPopularLineOFBusiness();
  }

  getLinesOfBusiness(): void {
    this.lineOfBusinessService.getLinesOfBusiness()
      .subscribe(linesOfBusiness => this.linesOfBusiness = linesOfBusiness.slice(1, 4));
  }

  getPopularLineOFBusiness() {
    const lobs = this.inMemoryService.createDb();
    const self = this;
    // @ts-ignore
    const quoteCounts = lobs.recentQuotes.reduce((a, {lineOfBusiness}) => (a[lineOfBusiness] = (a[lineOfBusiness] || 0) + 1, a), {});
    console.log("2222", self.popularLinesOfBusiness)
    lobs.linesOfBusiness.forEach(function(lob){
      if (self.popularLinesOfBusiness.length === 0){
        // inserting directly into empty list in first iteration
        self.popularLinesOfBusiness.push(lob);
      }else if (self.popularLinesOfBusiness.length === 1){
        // comparing 2nd iteration with existing element at index 0.
        // @ts-ignore
        if (quoteCounts[self.popularLinesOfBusiness[0].id] > quoteCounts[lob.id]){
          self.popularLinesOfBusiness.push(lob);
        }else {
          self.popularLinesOfBusiness.splice(0,0, lob);
        }
      }else {
        // comparing both existing elements from 3rd iteration
        // @ts-ignore
        if(quoteCounts[self.popularLinesOfBusiness[0].id] < quoteCounts[lob.id]){
          self.popularLinesOfBusiness[1] = self.popularLinesOfBusiness[0];
          self.popularLinesOfBusiness[0] = lob;
        }else { // @ts-ignore
          if (quoteCounts[self.popularLinesOfBusiness[1].id] < quoteCounts[lob.id]) {
                    self.popularLinesOfBusiness[1] = lob;
                  }
        }
      }
    });
    console.log("popular lobs", quoteCounts, self.popularLinesOfBusiness);
  }
}
