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

  public class SendResult {
    @AuraEnabled
    public Boolean success;
    @AuraEnabled
    public String message;
  }

  @AuraEnabled
  public static SendResult sendEmail(String email, String subject, String content) {
    SendResult sendResult = new SendResult();
    // Messaging.reserveSingleEmailCapacity(2);
    Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
    String[] toAddresses = new String[] {email};
    mail.setToAddresses(toAddresses);
    mail.setReplyTo('hr@jzsolution.com');
    mail.setSenderDisplayName('JZ Solution HR');
    mail.setSubject(subject);
    mail.setUseSignature(false);
    mail.setPlainTextBody(content);
    try {
      Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    } catch(Exception ex){
      sendResult.success = false;
      sendResult.message = 'Your offer letter was not sent successfully by email to ' + email + ', and the error was ' + ex.getMessage();
      return sendResult;
    }
    sendResult.success = true;
    sendResult.message = 'Your offer letter was sent successfully by email to ' + email;
    return sendResult;
  }

}
