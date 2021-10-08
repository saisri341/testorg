import {LightningElement, wire, track} from 'lwc';

import fetchAccounts from '@salesforce/apex/AccountDataController.fetchAccounts';

const columns = [ { label: 'Name', fieldName: 'Name', sortable: "true", type: 'url', typeAttributes: { label: { fieldName: 'Name' }, target: '_blank' } } ,
                  { label: 'Account Owner', fieldName: 'Owner.Name', sortable: "true"},
                  { label: 'Phone', fieldName: 'Phone', type: 'phone'},
                  { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'number'},
                  { label: 'Website', fieldName: 'Website', type: 'url' },];

export default class FinancialServiceAccountsDataController extends LightningElement {
    @track data;
    @track columns = columns;
    @track sortBy;
    @track sortDirection;
 
    @wire(fetchAccounts)
    wiredAccount(result) {
        if (result.data) {
            this.data = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }

    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.data));
        let keyValue = (a) => {
            return a[fieldname];
        };
        let isReverse = direction === 'asc' ? 1: -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.data = parseData;
    }    

    navigateToRecordDetailPage(event) {
        this.record = event.detail.row;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.record.Id,
                actionName: 'view'
            }
        });
    }

    handleKeyChange( event ) {  
          
        const searchKey = event.target.value.toLowerCase();  
        console.log( 'Search Key is ',searchKey );
 
        if ( searchKey ) {  

            this.records = this.data;
 
             if ( this.records ) {

                let recs = [];
                for ( let rec of this.records ) {

                    let valuesArray = Object.values( rec );
                    for ( let val of valuesArray ) {
                        
                        if ( val ) {

                            if ( val.toLowerCase().includes( searchKey ) ) {

                                recs.push( rec );
                                break;
                        
                            }

                        }

                    }
                    
                }

                
                this.records = recs;

             }
 
        }  else {

            this.records = this.data;

        }
 
    }  
}