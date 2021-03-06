({
    _getErrorDescription: function(errors) {
        if (errors) {
            if (errors[0] && errors[0].message) {
                return errors[0].message;
            }
        } else {
            return "Unknown error";
        }
    },

    _serverSideCall: function(action, component) {
        return new Promise(function(resolve, reject) {
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (component.isValid() && state === "SUCCESS") {
                    resolve(response.getReturnValue());
                } else if (component.isValid() && state === "ERROR") {
                    reject(new Error(_getErrorDescription(response.getError())));
                }
            });
            $A.enqueueAction(action);
        });
    },

    _createComponent: function(icon, params) {
        return new Promise(function(resolve, reject) {
            $A.createComponent(icon, params, function(newIcon, status, errorMessage) {
                if (status == 'SUCCESS') {
                    resolve({status: status, newIcon: newIcon, errorMessage: null});
                } else if (status == 'INCOMPLETE') {
                    reject({status: status, newIcon: null, errorMessage: 'No response from server or client is offline'});
                } else if (status == 'ERROR') {
                    reject({status: status, newIcon: null, errorMessage: errorMessage});
                }
            });
        });
    },

    _fireBubblingEvent: function(actionName, component) {
        var cmpEvent = component.getEvent('bubblingEvent');
        cmpEvent.setParams({'ComponentAction': actionName});
        cmpEvent.fire();
    },

    _fireAppEvent: function(params, component) {
        var appEvent = $A.get("e.c:OfferDataEvent");
        appEvent.setParams({
            'LCWhoFired': params.LCWhoFired,
            'LCAction': params.LCAction,
            'offerId': params.offerId,
            'templateText': params.templateText,
            'templateSubject': params.templateSubject,
            'email': params.email
        });
        appEvent.fire();
    }
})
