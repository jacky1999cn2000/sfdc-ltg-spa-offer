({
    validate: function(component) {
        var allValid = component.find('field').reduce(function(validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.get('v.validity').valid;
        }, true);

        return allValid;
    }
})
