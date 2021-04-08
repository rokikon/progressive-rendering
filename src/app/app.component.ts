import {Component} from '@angular/core';

interface TableItem {
    index: number;
    first: string;
    last: string;
    nickname: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    title = 'progressive-rendering';
    items = [];

    constructor() {
        this.generateMoreData();
    }

    private generateMoreData(amount: number = 10): void {
        for (let i = 0; i < amount; i++) {
            const index = this.items.length ? this.items.length : i;
            this.items.push({ index, first: 'Michael', last: 'Bay', nickname: '@mbay' });
        }
    }
}
