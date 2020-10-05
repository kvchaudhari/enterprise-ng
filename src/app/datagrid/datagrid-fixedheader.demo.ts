import {
  AfterViewChecked,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  ViewChild,
  ViewContainerRef,
  AfterViewInit, OnChanges
} from '@angular/core';
import { SohoDataGridComponent, SohoModalDialogService } from 'ids-enterprise-ng';
import { DataGridPagingIndeterminateDemoService } from './datagrid-paging-indeterminate-demo.service';

@Component({
  selector: 'app-datagrid-fixed-header-demo',
  templateUrl: 'datagrid-fixedheader.demo.html',
  providers: [DataGridPagingIndeterminateDemoService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridFixedHeaderDemoComponent implements OnInit {
  @ViewChild(SohoDataGridComponent) sohoDataGridComponent: SohoDataGridComponent;
  dataToShow: any;
  selectedValues: any;
  SelectedValuesFromGrid: any;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private datagridPagingService: DataGridPagingIndeterminateDemoService,
    private modalService: SohoModalDialogService
  ) { }

  @ViewChild('dialogPlaceholder', { read: ViewContainerRef, static: true })
  placeholder: ViewContainerRef;

  gridOptions: SohoDataGridOptions = undefined;
  selectedRow = 0;
  updateSelectedRow = false;

  ngOnInit() {
    this.gridOptions = this.buildGridOptions();
  }

  // ngAfterViewChecked() {
  //   if (this.sohoDataGridComponent && this.updateSelectedRow) {
  //     this.sohoDataGridComponent.selectRows([this.selectedRow]);
  //     this.updateSelectedRow = false;
  //   }
  // }

  // onSubscriptionSelected(e: SohoDataGridSelectedEvent) {
  //   let a = this.sohoDataGridComponent.getSelectedRows();
  //   this.selectedResults = [];
  //   e.rows.forEach(element => {
  //     this.selectedResults.push(element.data);
  //   });
  // }

  private buildGridOptions(): SohoDataGridOptions {
    return {
      columns: this.datagridPagingService.getColumns(),
      selectable: 'multiple',
      paging: true,
      pagesize: 25,
      pagesizes: [5, 10, 25, 100],
      indeterminate: true,
      rowHeight: 'short', // short, medium or normal
      sortable: false,
      filterable: true,
      source: this.dataGridOptions,
      disableClientSort: true,
      disableClientFilter: true,
      allowSelectAcrossPages: true,
    } as SohoDataGridOptions;
  }

  private dataGridOptions = (request: SohoDataGridSourceRequest, response: SohoDataGridResponseFunction) => {
    this.datagridPagingService.getDataByLocal(request).subscribe((result: any) => {
      // request.firstPage = result.firstPage;
      // request.lastPage = result.lastPage;

      request.total = result.totalRecords;

      response(result.dataList, request);

      // if (this.selectedResults && result.dataList.length > 0 && this.selectedResults.length > 0) {
      //   let rowIndex: Array<number> = [-1];
      //   for (let j = 0; j < this.selectedResults.length; j++) {
      //     rowIndex = this.sohoDataGridComponent.findRowsByValue('productId', this.selectedResults[j]['productId']);
      //     const pgNo = (request.activePage - 1) * request.pagesize;
      //     const rowInd = pgNo + rowIndex[0];
      //     // this.sohoDataGridComponent.selectRows(rowInd);

      //     if (rowIndex) {
      //       this.sohoDataGridComponent.selectRows(rowIndex);
      //     }
      //   }
      // }
      // const selectedRows = this.sohoDataGridComponent ? this.sohoDataGridComponent.selectedRows() : undefined;
      // this.selectedRow = (selectedRows !== undefined && selectedRows.length > 0) ? selectedRows[0].idx : 0;

      // this.ngZone.runOutsideAngular(() => response(result.data, request));

      // this.updateSelectedRow = true;
      // this.changeDetectorRef.markForCheck();
    });
  }

  showSelectedValues() {
    this.dataToShow = this.selectedValues.slice();
  }

  showPopupGrid() {
    const dialogRef = this.modalService.modal<CommonPopupComponent>(CommonPopupComponent, this.placeholder)
      .buttons([
        {
          id: 'close-button',
          text: 'Close',
          click: () => {
            dialogRef.close('CLOSE');
          }
        },
        {
          id: 'save-button',
          text: 'Select',
          click: () => {
            //debugger;
            // this.selectedValues = [];
            // this.selectedValues = dialogRef.componentDialog.selectedResults;
            // this.SelectedValuesFromGrid = JSON.parse(JSON.stringify(dialogRef.componentDialog.selectedResults));
            //this.ngZone.run(() => {
            this.selectedValues = JSON.parse(JSON.stringify(dialogRef.componentDialog.selectedResults));
            //});
            //console.log(this.selectedValues);
            dialogRef.close('CLOSE');
            this.showSelectedValues();
            var ele = document.getElementById('showValueBtn');
            if (ele != undefined) {
              ele.click();
            }
          }
        }
      ])
      .title('Soho Data Grid - Fixed Header')
      .apply(dialogComponent => {
        // dialogComponent.applicationList = JSON.parse(JSON.stringify(this.selectedValues));
        if (this.selectedValues && this.selectedValues.length > 0)
          dialogComponent.applicationList = JSON.parse(JSON.stringify(this.selectedValues));
      })
      .open();
  }
}

///popup component

@Component({
  template: `
        <div>
           <div #popUpGrid soho-datagrid (selected)="onSubscriptionSelected($event)" [gridOptions]="gridOptions">
           </div>
         </div>`,
  providers: [DataGridPagingIndeterminateDemoService],
})
export class CommonPopupComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('popUpGrid', { static: true })
  sohoDataGrid: SohoDataGridComponent;

  applicationList: any;
  selectedResults: any[];
  rowcount: number;
  gridOptions: SohoDataGridOptions = undefined;

  constructor(private datagridPagingService: DataGridPagingIndeterminateDemoService, private ngZone: NgZone) {
    //this.selectedResults = this.applicationList;
  }

  onSubscriptionSelected(e: SohoDataGridSelectedEvent) {
    let a = this.sohoDataGrid.selectedRows();
    console.log(a);
    this.selectedResults = [];
    a.forEach(element => {
      this.selectedResults.push(element.data);
    });
  }

  ngOnChanges() {

  }

  ngOnInit() {
    this.gridOptions = this.buildGridOptions();
  }

  ngAfterViewInit() {
    //this.gridOptions = this.buildGridOptions();
  }

  private buildGridOptions(): SohoDataGridOptions {
    return {
      columns: this.datagridPagingService.getColumns(),
      columnIds: ['selectionCheckbox', 'productId'], // two or more any columns used in grid
      selectable: 'multiple',
      paging: true,
      pagesize: 25,
      pagesizes: [5, 10, 25, 100],
      indeterminate: true,
      rowHeight: 'short', // short, medium or normal
      sortable: false,
      filterable: true,
      source: this.dataGridOptionsPopup,
      disableClientSort: true,
      disableClientFilter: true,
      allowSelectAcrossPages: true,
    } as SohoDataGridOptions;
  }

  private dataGridOptionsPopup = (request: SohoDataGridSourceRequest, response: SohoDataGridResponseFunction) => {
    //this.datagridPagingService.getDataByLocal(request).subscribe((result: any) => {
    this.datagridPagingService.getDataByLocalOther(request).then((returnData) => {
      if (returnData) {
        var result = returnData.returnData;
        request.total = result.totalRecords;
        response(result.dataList, request);
        //debugger;
        if (typeof (this.sohoDataGrid) != 'undefined') {
          //this.sohoDataGrid.Setdatagrid(1);
          if (this.applicationList && result.dataList.length > 0 && this.applicationList.length > 0) {
            let rowIndex: Array<number> = [-1];
            for (let j = 0; j < this.applicationList.length; j++) {
              try {
                rowIndex = this.sohoDataGrid.findRowsByValue('productId', this.applicationList[j]['productId']);
              } catch (error) {
                console.log(error);
              }
              const pgNo = (request.activePage - 1) * request.pagesize;
              const rowInd = pgNo + rowIndex[0];
              //this.sohoDataGrid.selectRows(rowInd);
              if (rowIndex) {
                try {
                  this.sohoDataGrid.selectRows(rowIndex);
                } catch (error) {
                  console.log(error);
                }
              }
            }
          }
        }
      }
    });
    //});
  }
}
