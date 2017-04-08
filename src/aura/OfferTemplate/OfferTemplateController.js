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
            helper._fireBubblingEvent('OfferTemplate_Next', component);
        }
    },

    handleAppEvent: function(component, event, helper) {
        console.log("OfferTemplate Controller.handleAppEvent: entered");

        var params = event.getParams();

        if (params.LCWhoFired == 'OfferDetails.cmp' && params.LCAction == 'Next') {
            console.log('respond to this event: OfferDetails.cmp - Next');
            component.set('v.templateText', params.templateText);
            component.set('v.templateSubject', params.templateSubject);
        }

        if (params.LCWhoFired == 'OfferPreview.cmp' && params.LCAction == 'Back') {
            console.log('respond to this event: OfferPreview.cmp - Back');
        }

        console.log("OfferTemplate Controller.handleAppEvent: exit");
    }
})
