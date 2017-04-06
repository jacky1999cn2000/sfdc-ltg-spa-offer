({
    handleBackClick: function(component, event, helper) {

        var cmpEvent = component.getEvent('bubblingEvent');
        cmpEvent.setParams({'ComponentAction': 'OfferTemplate_Back'});
        cmpEvent.fire();

    },

    handleNextClick: function(component, event, helper) {

        var cmpEvent = component.getEvent('bubblingEvent');
        cmpEvent.setParams({'ComponentAction': 'OfferTemplate_Next'});
        cmpEvent.fire();

    }
})
