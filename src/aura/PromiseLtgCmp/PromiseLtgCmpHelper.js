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
    }
})
