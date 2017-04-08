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
  public static Id upsertOffer(Id offerId, Id candidateId, Decimal salary, Decimal bonus) {
    // set Filled__c field in Position__c object to TRUE
    // Position__c position = [SELECT Id, Filled__c FROM Position__c WHERE Id =: positionId];
    // position.Filled__c = true;
    // update position;

    Offer__c offer;

    if(offerId != null) {
      offer = [SELECT Id, Base_Salary__c, Bonus__c, Candidate__c FROM Offer__c WHERE Id =: offerId];
      offer.Base_Salary__c = salary;
      offer.Bonus__c = bonus;
      offer.Candidate__c = candidateId;
      update offer;
    }else{
      // create Offer__c
      offer = new Offer__c();
      offer.Base_Salary__c = salary;
      offer.Bonus__c = bonus;
      offer.Candidate__c = candidateId;
      insert offer;
    }

    return offer.Id;
  }

  @AuraEnabled
  public static List<String> getTemplate(String templateId, String whoId, String whatId) {
    List<String> returnList = new List<String>();
    Messaging.SingleEmailMessage email = Messaging.renderStoredEmailTemplate(templateId, whoId, whatId);
    returnList.add(email.getPlainTextBody());
    returnList.add(email.getHTMLBody());
    returnList.add(email.getSubject());
    return returnList;
  }

}
