({
    handleBackClick: function(component, event, helper) {

        var cmpEvent = component.getEvent('bubblingEvent');
        cmpEvent.setParams({'ComponentAction': 'OfferPreview_Back'});
        cmpEvent.fire();

    },

    handleNextClick: function(component, event, helper) {

        var cmpEvent = component.getEvent('bubblingEvent');
        cmpEvent.setParams({'ComponentAction': 'OfferPreview_Next'});
        cmpEvent.fire();

    }
})
