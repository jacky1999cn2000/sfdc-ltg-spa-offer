public class OfferApexController {

  @AuraEnabled
  public static List<EmailTemplate> getEmailTemplates() {
    List<EmailTemplate> emailTemplateList = [SELECT Id, Name FROM EmailTemplate WHERE Name LIKE '%Offer%'];
    if (emailTemplateList.size() == 0)
      return null;
    return emailTemplateList;
  }

}
