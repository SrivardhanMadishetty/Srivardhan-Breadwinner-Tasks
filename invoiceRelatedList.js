import { LightningElement,api,track,wire } from 'lwc';
import getAllInvoices from '@salesforce/apex/ListOfAllInvoicesController.getAllInvoices';
import PaidInvoices from '@salesforce/apex/ListOfAllInvoicesController.PaidInvoices';
import CurrentDueInvoices from '@salesforce/apex/ListOfAllInvoicesController.CurrentDueInvoices';
import OverdueInvoices from '@salesforce/apex/ListOfAllInvoicesController.OverdueInvoices';
import TotalReceivables from '@salesforce/apex/ListOfAllInvoicesController.TotalReceivables';
import Red from '@salesforce/resourceUrl/Red';
export default class InvoiceSummary extends LightningElement {
    @api recordId;
    @api allInvoices;
    invdata=[];

   
    @track columns = [
        {
        label: 'Invoice#',
        fieldName: 'invName',
        type: 'url',
        sortable: true,
        typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}
    },
    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'image',
        sortable: true
    },
    {
        label: 'Inoice Date',
        fieldName: 'Invoice_Date__c',
        type: 'Date',
        sortable: true
    },
    {
        label: 'Due Date',
        fieldName: 'Due_Date__c',
        type: 'Date',
        sortable: true
    },
    {
        label: 'Amount Paid',
        fieldName: 'Amount_Paid__c',
        type: 'currency',
        sortable: true
    },
    {
        label: 'Amount Due',
        fieldName: 'Amount_Due__c',
        type: 'currency',
        sortable: true
    },
    {
        label: 'Days Overdue',
        fieldName: 'Days_Overdue__c',
        type: 'number',
        sortable: true
    },
    { 
        label: 'Total',
        fieldName: 'Total__c',
        type: 'currency',
        sortable: true
    }
    
];


@wire(getAllInvoices ,  { AccountId:'$recordId' })
wiredInvoices({ error, data }) 
{
    if (data) 
    {
        let tempinvList = []; 
        
        data.forEach((record) => {
            let tempInvRec = Object.assign({}, record);  
            tempInvRec.invName = '/' + tempInvRec.Id;
            tempinvList.push(tempInvRec);
            
        });
        
        this.invdata = tempinvList;
        
        this.error = undefined;
        console.log('invdata'+this.invdata);

    } 
    else if (error) {
        this.error = result.error;
    }
}


@wire(PaidInvoices,  { AccountId:'$recordId' }) totalPaidInvoices;

@wire(CurrentDueInvoices,  { AccountId:'$recordId' }) totalDueInvoices;

@wire(OverdueInvoices,  { AccountId:'$recordId' }) totoverDueInvoices;
/*wiredInvoice({ error, data })
{
    if (data) 
    {
        console.log(data.status__c);
        let totoverDueInvoices;
        if(data>=1 && data<=30)
        {
            this.totoverDueInvoices = '1-30';
        }
              
    }
    else if (error) 
    {
        this.error = result.error;
    }
} */

@wire(TotalReceivables,  { AccountId:'$recordId' }) sumOfReceivables;

}
