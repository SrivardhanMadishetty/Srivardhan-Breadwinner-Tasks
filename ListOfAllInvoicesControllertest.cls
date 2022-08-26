@istest
public class ListOfAllInvoicesControllertest
{
	@istest
    public static void test()
    {                     
        Invoice__c newinv = New Invoice__c();
        
        newinv.Amount_Paid__c=100;
        newinv.Due_Date__c=system.today();
        newinv.Invoice_Date__c=system.today();
        newinv.Total__c=100;

        INSERT newinv;
        
        test.startTest();
       
        
        PageReference pageRef = Page.ListOfAllInvoices;
        test.setCurrentPageReference(pageRef);
        pageRef.getParameters().put('id',newinv.id);
        
      /*  pageRef.getParameters().put('editinvoice',newinv.id);
          pageRef.getParameters().put('deleteinvoice',newinv.id); */
        
        ApexPages.StandardController controller = new ApexPages.StandardController(newinv);
        ListOfAllInvoicesController controllerclass = new ListOfAllInvoicesController(controller);
        ApexPages.Pagereference openView = controllerclass.viewPage(); 
        
        controllerclass.editselectedId = newinv.id;
        controllerclass.deleteselectedId = newinv.id;
        
  	    controllerclass.closePopup();
        controllerclass.showPopup();
        controllerclass.saveInvoice();
        controllerclass.editInvoice();
        controllerclass.deleteInvoice();
        controllerclass.InvoiceListView();
        controllerclass.tableSort();      
        
        test.stopTest();
	}
}
