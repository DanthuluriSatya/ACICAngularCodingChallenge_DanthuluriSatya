import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import {InMemoryDataService} from "../in-memory-data.service";

@Component({
  selector: 'app-lineOfBusiness-detail',
  templateUrl: './lineOfBusiness-detail.component.html',
  styleUrls: [ './lineOfBusiness-detail.component.css' ]
})
export class LineOfBusinessDetailComponent implements OnInit {
  lineOfBusiness: LineOfBusiness | undefined;
  quoteCounts = 0 ;

  constructor(
    private route: ActivatedRoute,
    private lineOfBusinessService: LineOfBusinessService,
    private location: Location,
    private inMemoryService: InMemoryDataService
  ) {}

  ngOnInit(): void {
    this.getLineOfBusiness();
  }

  getLineOfBusiness(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.lineOfBusinessService.getLineOfBusiness(id)
      .subscribe(lineOfBusiness => this.lineOfBusiness = lineOfBusiness);
    this.getQuoteCount(id);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.lineOfBusiness) {
      this.lineOfBusinessService.updateLineOfBusiness(this.lineOfBusiness)
        .subscribe(() => this.goBack());
    }
  }

  getQuoteCount(id: number) {
    const lobs = this.inMemoryService.createDb();
    // @ts-ignore
    // tslint:disable-next-line:max-line-length
    this.quoteCounts = lobs.recentQuotes.filter(quote => quote.lineOfBusiness === id).reduce((a, {lineOfBusiness}) => (a[lineOfBusiness] = (a[lineOfBusiness] || 0) + 1, a), {})[id];
    console.log('123', this.quoteCounts);
  }
}
