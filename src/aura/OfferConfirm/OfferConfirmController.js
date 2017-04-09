({
    navigateToRecord: function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({"recordId": component.get('v.offerId')});
        navEvt.fire();
    },

    handleAppEvent: function(component, event, helper) {
        console.log("OfferConfirm Controller.handleAppEvent: entered");

        var params = event.getParams();

        if (params.LCWhoFired == 'OfferPreview.cmp') {
            console.log('respond to this event: OfferPreview.cmp');
            component.set('v.templateText', params.templateText);
            component.set('v.templateSubject', params.templateSubject);
            component.set('v.offerId', params.offerId);
            component.set('v.email', params.email);

            // send email
            var action = component.get('c.sendEmail');
            action.setParams({'email': component.get('v.email'), 'subject': component.get('v.templateSubject'), 'content': component.get('v.templateText')});
            helper._serverSideCall(action, component).then(function(sendResult) {
                component.set('v.result', sendResult);
                console.log('sendResult ', sendResult);

                // dynamically chose which icon to display based on the result
                var iconToShow;
                if (sendResult.success) {
                    iconToShow = "action:approval";
                } else {
                    iconToShow = "action:close";
                }

                return helper._createComponent("lightning:icon", {
                    "aura:id": "resultIcon",
                    "iconName": iconToShow,
                    "size": "medium"
                });
            }).then(function(result) {
                console.log('result ', result);
                if (result.status == 'SUCCESS') {
                    var body = component.get('v.body');
                    body.push(result.newIcon);
                    component.set('v.body', body);
                } else {
                    console.log('error ', result.errorMessage);
                }
            }).catch(function(error) {
                console.log('Error: ' + error);
            });
        }

        console.log("OfferConfirm Controller.handleAppEvent: exit");
    }
})
