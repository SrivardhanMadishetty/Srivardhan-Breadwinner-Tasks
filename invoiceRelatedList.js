import { LightningElement,api,track,wire } from 'lwc';

import chartjs from '@salesforce/resourceUrl/ChartJs'; 
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getAllOverdueInvoices from '@salesforce/apex/invoiceRelatedListController.getAllOverdueInvoices';

import getAllInvoices from '@salesforce/apex/invoiceRelatedListController.getAllInvoices';

import paidInvoices from '@salesforce/apex/invoiceRelatedListController.paidInvoices';
import CurrentDueInvoices from '@salesforce/apex/invoiceRelatedListController.CurrentDueInvoices';
import totalOverdueInvoices from '@salesforce/apex/invoiceRelatedListController.totalOverdueInvoices';
import TotalReceivables from '@salesforce/apex/invoiceRelatedListController.TotalReceivables';

export default class InvoiceSummary extends LightningElement {
    @api recordId;
    @api allInvoices;
    @api overDueInvoices;
    invdata=[];

   
    columns = [
        {
        label: 'Invoice#',
        fieldName: 'invName',
        type: 'url',
        typeAttributes: {label: { fieldName: 'Name' }, target: '_blank'}
    },
    {
        label: 'Status',
        fieldName: '',
        cellAttributes: { iconName: { fieldName: 'Status__c' }, class: { fieldName: 'variant' }},
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
   
            if(tempInvRec.Status__c.includes("Paid"))
            {
                tempInvRec.Status__c='action:priority';
                tempInvRec.variant='slds-icon-text-success';
            }
            else if(tempInvRec.Status__c.includes("Overdue"))
            {
                tempInvRec.Status__c='action:priority';
                tempInvRec.variant='slds-icon-text-error';
            }
            else
            {
                tempInvRec.Status__c='action:priority';
                tempInvRec.variant='slds-icon-text-warning';
            }

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

@wire(TotalReceivables,  { AccountId:'$recordId' }) sumOfReceivables;

@wire(totalOverdueInvoices,  { AccountId:'$recordId' }) totalOverdueInvoices;

obj=[];
totalcountOverdue = 0;

@wire (getAllOverdueInvoices, { AccountId:'$recordId' }) 
accounts({error,data})
{
   if(data)
   {
      this.obj =data;
      this.totalcountOverdue = this.obj.length;
      
      for(var key in data)
       {
          this.updateChart(data[key].count,data[key].label);
       }
      this.error=undefined;
   }
  else if(error)
  {
     this.error = error;
     this.accounts = undefined;
  }
}
chart;
chartjsInitialized = false;
config={
type : 'doughnut',
data :{
datasets :[
{
data: [
],
backgroundColor :[
    'rgb(255,99,132)',
    'rgb(255,159,64)',
    'rgb(255,205,86)',
    'rgb(75,192,192)',
],
   label:'Dataset 1'
}
],
labels:[]
},
options: {
    responsive : true,
legend : {
    position :'right'
},
animation:{
   animateScale: true,
   animateRotate : true
}
}
};
renderedCallback()
{
   if(this.chartjsInitialized)
  {
   return;
  }
  this.chartjsInitialized = true;
  Promise.all([
   loadScript(this,chartjs)
  ]).then(() =>{
    const ctx = this.template.querySelector('canvas.donut')
    .getContext('2d');
    this.chart = new window.Chart(ctx, this.config);
  })
  .catch(error =>{
    this.dispatchEvent(
    new ShowToastEvent({
    title : 'Error loading ChartJS',
    message : error.message,
    variant : 'error',
   }),
  );
});
}
updateChart(count,label)
{
   this.chart.data.labels.push(label);
   this.chart.data.datasets.forEach((dataset) => {
   dataset.data.push(count);
   });
   this.chart.update();
 }
}
