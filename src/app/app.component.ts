import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from '@swimlane/ngx-datatable';
import { map, Observable } from 'rxjs';
import { Stock } from './models/stock.model';
import { StockValue } from './models/stockValue.model';
import { StockService } from './stock.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'stocks';
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  downloadUrl: any;
  isGenerated: boolean | undefined;;
  readonly stocks$: Observable<Stock[]> = this.stockService.getStocks();
  @ViewChild(DatatableComponent) table!: DatatableComponent ;

  rows: any[] = [];
  tempRows: any[] = [];
  selected: any[] = [];
  columns: any[] = [
    { prop: 'stock' },
    { prop: 'industry' },
    { prop: 'sector' },
    { prop: 'currencyCode' },
  ];

  rowsValue: any[] = [];
  columnsValue: any[] = [
    { prop: 'stock' },
    { prop: 'date' },
    { prop: 'value' },
  ];

  constructor(private stockService: StockService,
    private sanitizer: DomSanitizer) {
    this.stocks$
      .pipe(
        map((stockItems: any[]) =>
          stockItems.map((stock) => {
            return {
              id: stock.id,
              stock: stock.stock,
              industry: stock.industry,
              sector: stock.sector,
              currencyCode: stock.currency_code,
            };
          })
        )
      )
      .subscribe((stocks: any[]) => {
        this.tempRows = [...stocks];
        this.rows = stocks;
      });
  }
  onSelect(selected: any) {
    this.stockService
      .getStockValues(this.selected[0].id)
      .pipe(
        map((stockItems: any[]) =>
          stockItems.map((stock) => {
            return {
              id: stock.stock_id,
              stock: this.selected[0].stock,
              date: stock.date,
              value: stock.value,
            };
          })
        )
      )
      .subscribe((stocks: any[]) => {
        console.log(stocks);
        this.rowsValue = stocks;
        this.isGenerated = true;
      });
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempRows.filter(function (d) {
      return d.stock.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }


  generateUrl() {
    let JsonObject = JSON.stringify(this.rowsValue)
    var blob = new Blob([JsonObject], {type:   "data:text/json;charset=UTF-8,"});
    saveAs(blob, "myfile.json")
  }
}
