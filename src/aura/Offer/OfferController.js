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
    }
})
