({
    handleBackClick: function(component, event, helper) {
        if (helper.validate(component)) {
            console.log('valid');
            helper._fireBubblingEvent('OfferTemplate_Back', component);
        }
    },

    handleNextClick: function(component, event, helper) {
        if (helper.validate(component)) {
            console.log('valid');

            // fire component-level bubblingEvent (handled by Offer LC to do the navigation)
            helper._fireBubblingEvent('OfferTemplate_Next', component);

            // fire application-level appEvent (handled by OfferDetails, OfferTemplate, OfferPreview, OfferConfirm LCs to transfer data between each other)
            helper._fireAppEvent({
                LCWhoFired: 'OfferTemplate.cmp',
                offerId: component.get('v.offerId'),
                templateText: component.get('v.templateText'),
                templateSubject: component.get('v.templateSubject'),
                email: component.get('v.email')
            }, component);
        }
    },

    handleAppEvent: function(component, event, helper) {
        console.log("OfferTemplate Controller.handleAppEvent: entered");

        var params = event.getParams();

        if (params.LCWhoFired == 'OfferDetails.cmp') {
            console.log('respond to this event: OfferDetails.cmp');
            component.set('v.templateText', params.templateText);
            component.set('v.templateSubject', params.templateSubject);
            component.set('v.offerId', params.offerId);
            component.set('v.email', params.email);
        }

        console.log("OfferTemplate Controller.handleAppEvent: exit");
    }
})
