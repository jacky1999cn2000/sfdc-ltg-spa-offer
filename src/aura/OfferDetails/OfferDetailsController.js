({
    doInit: function(component, event, helper) {
        console.log("OfferDetails Controller.doInit: entered");

        /* traditional way to call server method */

        // var action = component.get('c.getEmailTemplates');
        // action.setCallback(this, function(response) {
        //     var state = response.getState();
        //     if (component.isValid() && state === 'SUCCESS') {
        //         console.log('EmailTemplate successfully retrieved in traditional way');
        //         component.set('v.emailTemplates', response.getReturnValue());
        //     } else if (state === 'ERROR') {
        //         var errors = response.getError();
        //         if (errors) {
        //             if (errors[0] && errors[0].message) {
        //                 console.log('Error message: ', errors[0].message);
        //             }
        //         } else {
        //             console.log('Unknown error');
        //         }
        //     } else {
        //         console.log('Action State returned was: ', state);
        //     }
        // });
        // $A.enqueueAction(action);

        /*
					upload AuraPromise.js to Static Resource, and use promise to handle async calls such as server method

					however, it may happen that during init() method, AuraPromise Static Resource was not loaded yet, so
					(window.)AuraPromise is undefined...
				*/

        // var action = component.get('c.getEmailTemplates');
        // AuraPromise.serverSideCall(action, component).then(function(emailTemplates) {
        //     component.set('v.emailTemplates', emailTemplates);
        // }).catch(function(error) {
        //     console.log('Error: ' + error);
        // });

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
            component.set('v.candidateRecord', candidate);
        }).catch(function(error) {
            console.log('Error: ' + error);
        });

        console.log("OfferDetails Controller.doInit: exit");
    },

    handleNextClick: function(component, event, helper) {
        console.log("OfferDetails Controller.handleNextClick: entered");

        if (helper.validate(component)) {
            console.log('valid');
            var salary = component.get('v.salary');
            var bonus = component.get('v.bonus');
            var templateId = component.get('v.templateId');

            console.log('salary ', salary);
            console.log('bonus ', bonus);
            console.log('templateId ', templateId);

            var cmpEvent = component.getEvent('bubblingEvent');
            cmpEvent.setParams({'ComponentAction': 'OfferDetails_Next'});
            cmpEvent.fire();

            // create offer record
            // var action = component.get('c.createOffer');
            // action.setParams({'candidateId': component.get('v.candidateRecord').Id, 'positionId': component.get('v.candidateRecord').Position__c, 'salary': component.get('v.salary'), 'bonus': component.get('v.bonus')});
            // helper._serverSideCall(action, component).then(function(Id) {
            //     console.log('offer Id ', Id);
            //
            //     var cmpEvent = component.getEvent('bubblingEvent');
            //     cmpEvent.setParams({'ComponentAction': 'OfferDetails_Next'});
            //     cmpEvent.fire();
            //
            // }).catch(function(error) {
            //     console.log('Error: ' + error);
            // });

        }

        console.log("OfferDetails Controller.handleNextClick: exit");
    }
})
