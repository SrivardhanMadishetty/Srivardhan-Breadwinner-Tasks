import { LightningElement,api,track,wire } from 'lwc';
import getAllInvoices from '@salesforce/apex/ListOfAllInvoicesController.getAllInvoices';
import paidInvoices from '@salesforce/apex/ListOfAllInvoicesController.paidInvoices';
import CurrentDueInvoices from '@salesforce/apex/ListOfAllInvoicesController.CurrentDueInvoices';
import OverdueInvoices from '@salesforce/apex/ListOfAllInvoicesController.OverdueInvoices';
import TotalReceivables from '@salesforce/apex/ListOfAllInvoicesController.TotalReceivables';
export default class InvoiceSummary extends LightningElement {
    @api recordId;
    @api allInvoices;
    @api overDueInvoices;
    invdata=[];

   
    @track columns = [
        {
        label: 'Invoice#',
        fieldName: 'invName',
        type: 'url',
        typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}
    },
    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'image',
    },
    {
        label: 'Inoice Date',
        fieldName: 'Invoice_Date__c',
        type: 'Date',
    },
    {
        label: 'Due Date',
        fieldName: 'Due_Date__c',
        type: 'Date',
    },
    {
        label: 'Amount Paid',
        fieldName: 'Amount_Paid__c',
        type: 'currency',
    },
    {
        label: 'Amount Due',
        fieldName: 'Amount_Due__c',
        type: 'currency',
    },
    {
        label: 'Days Overdue',
        fieldName: 'Days_Overdue__c',
        type: 'number',
    },
    { 
        label: 'Total',
        fieldName: 'Total__c',
        type: 'currency',
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


@wire(paidInvoices,  { AccountId:'$recordId' }) totalPaidInvoices;

@wire(CurrentDueInvoices,  { AccountId:'$recordId' }) totalDueInvoices;

 obj=[];
 countOverdue1to30 = 0;
 countOverdue31to60 = 0;
 countOverdue61to90 = 0;
 countOverdue90Above = 0;
 totalcountOverdue = 0;

@wire(OverdueInvoices,  { AccountId:'$recordId' })
wiredInvoice({ error, data })
{
    if (data) 
    {

    this.obj=data;
    
       for(let i=0; i<this.obj.length; i++)   
       {
         if(this.obj[i].Days_Overdue__c >=1 && this.obj[i].Days_Overdue__c <= 30)
         {
                this.countOverdue1to30 = this.countOverdue1to30 + 1;
         }
         else if(this.obj[i].Days_Overdue__c >=31 && this.obj[i].Days_Overdue__c <= 60)
         {
            this.countOverdue31to60 = this.countOverdue31to60 + 1;
         }
         else if(this.obj[i].Days_Overdue__c >=61 && this.obj[i].Days_Overdue__c <= 90)
         {
            this.countOverdue61to90 = this.countOverdue61to90 + 1;
         }
         else if(this.obj[i].Days_Overdue__c >=91)
         {
            this.countOverdue90Above = this.countOverdue90Above + 1;
         }
       }
       
    this.totalcountOverdue = this.obj.length;

    }
    else if (error) 
    {
        this.error = result.error;
    }
} 

@wire(TotalReceivables,  { AccountId:'$recordId' }) sumOfReceivables;

}
