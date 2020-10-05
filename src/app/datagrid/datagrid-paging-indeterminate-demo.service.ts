
import {
  of,
  Observable
} from 'rxjs';

import { Injectable } from '@angular/core';

import { SohoDataGridService } from 'ids-enterprise-ng';

import {
  PAGING_DATA,
  PAGING_COLUMNS
} from './datagrid-paging-data';
import { HttpClient } from '@angular/common/http';

declare var Formatters: any;

@Injectable()
export class DataGridPagingIndeterminateDemoService extends SohoDataGridService {
  private columns: SohoDataGridColumn[] = [];
  private data: Array<any>;
  private beginIndex: number;
  private endIndex: number;

  constructor(private http: HttpClient) {
    super();
  }

  getColumns(): SohoDataGridColumn[] {
    if (this.columns.length === 0) {
      // init
      this.columns = PAGING_COLUMNS;
      this.data = PAGING_DATA;
    }
    return this.columns;
  }

  getData(req: SohoDataGridSourceRequest): Observable<any> {
    debugger;
    switch (req.type) {
      case 'initial': this.beginIndex = 0; break;
      case 'first': this.beginIndex = 0; break;
      case 'last': this.beginIndex = this.data.length - req.pagesize; break;
      case 'next': this.beginIndex = this.beginIndex + req.pagesize; break;
      case 'prev': this.beginIndex = this.beginIndex - req.pagesize; break;

      case 'sorted': console.log('sorted stub called - implement me'); break;
      case 'filtered':
        let data: any;
        if (req.filterExpr && req.filterExpr[0].value) {
          data = this.data.filter(dt => dt.productId == req.filterExpr[0].value);
        }
        else {
          data = this.data;
        }
        const result: any = {
          data: data,
          firstPage: this.beginIndex === 0,
          lastPage: this.endIndex >= this.data.length - 1
        };

        return of(result);
    }

    this.endIndex = this.beginIndex + req.pagesize;

    const result: any = {
      data: this.data.slice(this.beginIndex, this.endIndex),
      firstPage: this.beginIndex === 0,
      lastPage: this.endIndex >= this.data.length - 1
    };

    return of(result);
  }

  getDataByLocal(req: SohoDataGridSourceRequest): Observable<any> {
    let data;
    let returnData: any = {};
    if (req && req.filterExpr && req.filterExpr.length > 0) {
      data = this.data.filter(dt => (dt.productId + '').includes(req.filterExpr[0].value));
    }
    else {
      data = this.data;
    }

    if (data) {
      let startIndex: number, endIndex: number;
      startIndex = (req.pagesize * (req.activePage - 1));
      endIndex = (req.pagesize * req.activePage);

      returnData.totalRecords = data.length;
      returnData.dataList = data.slice(startIndex, endIndex);
    }
    else {
      returnData.totalRecords = 0;
      returnData.dataList = null;
    }

    this.delay(5000).then(() => {

    });
    return of(returnData, returnData);
  }

  getDataByLocalOther(req: SohoDataGridSourceRequest): Promise<any> {

    return new Promise((resolve) => {
      let data;
      let returnData: any = {};
      if (req && req.filterExpr && req.filterExpr.length > 0) {
        data = this.data.filter(dt => (dt.productId + '').includes(req.filterExpr[0].value));
      }
      else {
        data = this.data;
      }

      if (data) {
        let startIndex: number, endIndex: number;
        startIndex = (req.pagesize * (req.activePage - 1));
        endIndex = (req.pagesize * req.activePage);

        returnData.totalRecords = data.length;
        returnData.dataList = data.slice(startIndex, endIndex);
      }
      else {
        returnData.totalRecords = 0;
        returnData.dataList = null;
      }

      setTimeout(() => {
        resolve({
          returnData: returnData
        });
      }, 1000);
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getDataByMicroservice(req: SohoDataGridSourceRequest): Observable<any> {
    const commonList = {
      currentPage: req.activePage,
      pageSize: req.pagesize,
      sortColumn: req.sortId === undefined ? 'id' : req.sortId.toString(),
      sortDirection:
        req.sortAsc === undefined || req.sortAsc ? 'ASC' : 'DESC',
      reqFilterExpression: req.filterExpr
    };

    return this.http.post('https://localhost:44329/api/Member/grid', commonList);
  }
}
