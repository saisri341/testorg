public with sharing class AccountDataController {

    @AuraEnabled( cacheable = true )
    public static List<Account> fetchAccounts() {
     
        List<Account> lstAcc = [SELECT Id, Name, Owner.Name, 
                                Phone, Website, 
                                AnnualRevenue 
                                FROM Account 
                                WHERE Industry='Financial Services'
                                LIMIT 49999];
        return lstAcc;
         
    }
}