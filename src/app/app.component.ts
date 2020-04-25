import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import tvSeries from './tv-series.json';
import { TvData } from './tv.interface';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    displayedColumns: string[] = ['name', 'season', 'network', 'premiere'];
    dataSource: MatTableDataSource<TvData>;
    optYears = new Set();
    optGenre = new Set();
    formSort: FormGroup;
    isSort: boolean;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private _fb: FormBuilder) {
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(tvSeries);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this._initForm();
    }

    selectOption(optValue: string, key: string) {
        this._preFindValue(key);
        this.dataSource.filter = optValue;
    }

    findByName() {
        const value = this.formSort.controls.name.value;
        if (value) {
            this._preFindValue('name');
            this.dataSource.filter = value.trim().toLowerCase();
        }
    }

    resetFilter() {
        this.isSort = false;
        this.formSort.reset();
        this.dataSource.filter = '';
    }

    setColor(genre: string): string {
        let color;
        switch (genre) {
            case 'horror':
                color = '#4f4f4f';
                break;
            case 'drama':
                color = '#bb6bd9';
                break;
            case 'crime':
                color = '#828282';
                break;
            case 'tragedy':
                color = '#eb5757';
                break;
            case 'dark comedy':
                color = '#828282';
                break;
            default:
                color = '#27e3b4';
                break;
        }
        return color;
    }

    private _preFindValue(key: string) {
        this.isSort = true;
        switch (key) {
            case 'name':
                this.formSort.controls.premiere.reset();
                this.formSort.controls.genre.reset();
                this.dataSource.filterPredicate = (d: TvData, filter: string) => {
                    const textToSearch = d[key] && d[key].toLowerCase() || '';
                    return textToSearch.includes(filter);
                };
                break;
            case 'premiere':
                this.formSort.controls.genre.reset();
                this.formSort.controls.name.reset();
                this.dataSource.filterPredicate = (d: TvData, filter: string) => {
                    return d[key].includes(filter);
                };
                break;
            case 'genre':
                this.formSort.controls.premiere.reset();
                this.formSort.controls.name.reset();
                this.dataSource.filterPredicate = (d: TvData, filter: string) => {
                    return d.genres.includes(filter);
                };
                break;
        }
    }

    private _initForm() {
        this.formSort = this._fb.group({
            name: [''],
            genre: [null],
            premiere: [null],
        });
        if (this.dataSource.filteredData.length) {
            this.dataSource.filteredData
                .forEach(item => {
                    if (item.genres.length) {
                        item.genres.forEach(genre => {
                            this.optGenre.add(genre);
                        });
                    }
                    this.optYears.add(+item.premiere.substring(item.premiere.length - 4));
                });
        }
    }
}
