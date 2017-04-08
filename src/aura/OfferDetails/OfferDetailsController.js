({
    doInit: function(component, event, helper) {
        console.log("OfferDetails Controller.doInit: entered");

        /*
					create a parent component called PromiseLtgCmp, and define promise helper method in it
					make OfferDetails component extend it, and call parent's helper method to handle async calls
				*/
        var action = component.get('c.getEmailTemplates');
        helper._serverSideCall(action, component).then(function(emailTemplates) {
            component.set('v.emailTemplates', emailTemplates);
            action = component.get('c.getCandidate');
            action.setParams({'candidateId': component.get('v.candidateId')});
            return helper._serverSideCall(action, component);
        }).then(function(candidate) {
            component.set('v.candidateName', candidate.Name);
            component.set('v.email', candidate.Email__c);
            component.set('v.positionId', candidate.Position__c);
        }).catch(function(error) {
            console.log('Error: ' + error);
        });

        console.log("OfferDetails Controller.doInit: exit");
    },

    handleNextClick: function(component, event, helper) {
        console.log("OfferDetails Controller.handleNextClick: entered");

        if (helper.validate(component)) {
            console.log('valid');

            console.log('offerId ', component.get('v.offerId'));

            // upsert offer record
            var createOfferAction = component.get('c.upsertOffer');
            createOfferAction.setParams({'offerId': component.get('v.offerId'), 'candidateId': component.get('v.candidateId'), 'salary': component.get('v.salary'), 'bonus': component.get('v.bonus')});
            helper._serverSideCall(createOfferAction, component).then(function(offerId) {
                console.log('created offer Id ', offerId);

                component.set('v.offerId', offerId);

                // get template content
                var getTemplateAction = component.get('c.getTemplate');
                getTemplateAction.setParams({'templateId': component.get('v.templateId'), 'whoId': null, 'whatId': component.get('v.offerId')});
                return helper._serverSideCall(getTemplateAction, component);

            }).then($A.getCallback(function(contentList) {

                console.log('contentList ', contentList);

                // set template text(plain text version), html(html version), subject
                component.set('v.templateText', contentList[0]);
                component.set('v.templateHTML', contentList[1]);
                component.set('v.templateSubject', contentList[2]);

                // fire component-level bubblingEvent (handled by Offer LC to do the navigation)
                helper._fireBubblingEvent('OfferDetails_Next', component);

                // fire application-level appEvent (handled by OfferDetails, OfferTemplate, OfferPreview, OfferConfirm LCs to transfer data between each other)
                helper._fireAppEvent({
                    LCWhoFired: 'OfferDetails.cmp',
                    LCAction: 'Next',
                    offerId: component.get('v.offerId'),
                    templateText: component.get('v.templateText'),
                    templateSubject: component.get('v.templateSubject'),
                    email: component.get('v.email')
                }, component);

            })).catch(function(error) {
                console.log('Error: ' + error);
            });

        }

        console.log("OfferDetails Controller.handleNextClick: exit");
    },

    handleAppEvent: function(component, event, helper) {
        console.log("OfferDetails Controller.handleAppEvent: entered");

        var params = event.getParams();

        if (params.LCWhoFired == 'OfferTemplate.cmp' && params.LCAction == 'Back') {
            console.log('respond to this event: OfferTemplate.cmp - Back');
        }

        console.log("OfferDetails Controller.handleAppEvent: exit");
    }
})
