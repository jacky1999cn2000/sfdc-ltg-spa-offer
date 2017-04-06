public class OfferApexController {

  @AuraEnabled
  public static List<EmailTemplate> getEmailTemplates() {
    List<EmailTemplate> emailTemplateList = [SELECT Id, Name FROM EmailTemplate WHERE Name LIKE '%Offer%'];
    if (emailTemplateList.size() == 0)
      return null;
    return emailTemplateList;
  }

  @AuraEnabled
  public static Candidate__c getCandidate(Id candidateId) {
    List<Candidate__c> candidateList = [SELECT Id,Name,Email__c,Position__c FROM Candidate__c WHERE Id =: candidateId];
    if (candidateList.size() == 0)
      return null;
    return candidateList[0];
  }

  @AuraEnabled
  public static Id createOffer(Id candidateId, Id positionId, Decimal salary, Decimal bonus) {
    // set Filled__c field in Position__c object to TRUE
    Position__c position = [SELECT Id, Filled__c FROM Position__c WHERE Id =: positionId];
    position.Filled__c = true;
    update position;

    // create Offer__c
    Offer__c offer = new Offer__c();
    offer.Base_Salary__c = salary;
    offer.Bonus__c = bonus;
    offer.Candidate__c = candidateId;
    insert offer;
    return offer.Id;
  }

}
