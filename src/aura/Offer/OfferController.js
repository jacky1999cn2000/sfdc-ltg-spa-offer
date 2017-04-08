({
    doInit: function(component, event, helper) {
        console.log("Offer Controller.doInit: entered");

        var toggleDiv = component.find("templateDiv");
        $A.util.addClass(toggleDiv, 'toggle');

        toggleDiv = component.find("previewDiv");
        $A.util.addClass(toggleDiv, 'toggle');

        toggleDiv = component.find("confirmDiv");
        $A.util.addClass(toggleDiv, 'toggle');

        console.log("Offer Controller.doInit: exit");
    },

    handleBubblingEvent: function(component, event) {
        console.log("Offer Controller.handleBubbling: entered");

        console.log('Event Name ', event.getName());

        var params = event.getParams();
        var navigateAction = params.ComponentAction;
        console.log('navigateAction ', navigateAction);

        switch (navigateAction) {
            case 'OfferDetails_Next':
                // hide OfferDetails child LC
                var offerDetailsLC = component.find('detailsDiv');
                $A.util.addClass(offerDetailsLC, 'toggle');

                // unhide OfferTemplate child LC
                var offerTemplateLC = component.find('templateDiv');
                $A.util.removeClass(offerTemplateLC, 'toggle');

                // mark Progress Bar OfferDetails LC indicator as Complete
                var toggleIndicatorCurrent = component.find('detailsIndicator');
                $A.util.removeClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-complete');

                // mark Progress Bar OfferTemplate LC indicator as Current
                var toggleIndicatorNext = component.find('templateIndicator');
                $A.util.removeClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-incomplete');
                $A.util.addClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-current');

                break;

            case 'OfferTemplate_Back':
                // unhide OfferDetails child LC
                var offerDetailsLC = component.find('detailsDiv');
                $A.util.removeClass(offerDetailsLC, 'toggle');

                // hide OfferTemplate child LC
                var offerTemplateLC = component.find('templateDiv');
                $A.util.addClass(offerTemplateLC, 'toggle');

                // mark Progress Bar OfferDetails LC indicator as Current
                var toggleIndicatorCurrent = component.find('detailsIndicator');
                $A.util.removeClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-complete');
                $A.util.addClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-current');

                // mark Progress Bar OfferTemplate LC indicator as Incomplete
                var toggleIndicatorNext = component.find('templateIndicator');
                $A.util.removeClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-incomplete');

                break;

            case 'OfferTemplate_Next':
                // hide OfferTemplate child LC
                var offerTemplateLC = component.find('templateDiv');
                $A.util.addClass(offerTemplateLC, 'toggle');

                // unhide OfferPreview child LC
                var offerPreviewLC = component.find('previewDiv');
                $A.util.removeClass(offerPreviewLC, 'toggle');

                // mark Progress Bar OfferTemplate LC indicator as Complete
                var toggleIndicatorCurrent = component.find('templateIndicator');
                $A.util.removeClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-complete');

                // mark Progress Bar OfferTemplate LC indicator as Current
                var toggleIndicatorNext = component.find('previewIndicator');
                $A.util.removeClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-incomplete');
                $A.util.addClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-current');

                break;

            case 'OfferPreview_Back':
                // unhide OfferTemplate child LC
                var offerTemplateLC = component.find('templateDiv');
                $A.util.removeClass(offerTemplateLC, 'toggle');

                // hide OfferPreview child LC
                var offerTemplateLC = component.find('previewDiv');
                $A.util.addClass(offerTemplateLC, 'toggle');

                // mark Progress Bar OfferTemplate LC indicator as Current
                var toggleIndicatorCurrent = component.find('templateIndicator');
                $A.util.removeClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-complete');
                $A.util.addClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-current');

                // mark Progress Bar OfferPreview LC indicator as Incomplete
                var toggleIndicatorNext = component.find('previewIndicator');
                $A.util.removeClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-incomplete');

                break;

            case 'OfferPreview_Next':
                // hide OfferPreview child LC
                var offerPreviewLC = component.find('previewDiv');
                $A.util.addClass(offerPreviewLC, 'toggle');

                // unhide OfferConfirm child LC
                var offerConfirmLC = component.find('confirmDiv');
                $A.util.removeClass(offerConfirmLC, 'toggle');

                // mark Progress Bar OfferPreview LC indicator as Complete
                var toggleIndicatorCurrent = component.find('previewIndicator');
                $A.util.removeClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-complete');

                // mark Progress Bar OfferConfirm LC indicator as Current
                var toggleIndicatorNext = component.find('confirmIndicator');
                $A.util.removeClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-incomplete');
                $A.util.addClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-current');

                break;
            default:

        }
        console.log("Offer Controller.handleBubbling: exit");
    }
})
