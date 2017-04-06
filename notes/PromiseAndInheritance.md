# Promise & Inheritance

* Refer to this project for basic usages of Promises & Inheritance in Lightning Component
  * [sfdc-ltg-promise-inheritance](https://github.com/jacky1999cn2000/sfdc-ltg-promise-inheritance)

* Based on the project above, we can upload AuraPromise.js to Static Resource, and use promise to handle async calls such as server method
  * however, it may happen that during init() method, AuraPromise Static Resource was not loaded yet, so
(window.)AuraPromise is undefined...
  * [ltng:require may have a way to deal with it but I haven't tried](http://salesforce.stackexchange.com/questions/106495/initializing-javascript-plugin-after-loading-data-in-lightning-component)
  * Or we can use another way...

* Since ES6-Promise is an object under Window object (which means we have direct access to it), so we could implement the same logic of AuraPromise.js in a component's controller
  * ![window object](/screenshots/windowobject.png)

* Create a parent component and define Promise methods in its helper.js, and create child components that extend it
  * parent component - `PromiseLtgCmp`
    * PromiseLtgCmp.cmp*
    ```
      <aura:component extensible="true">{!v.body}</aura:component>
    ```

    * PromiseLtgCmpHelper.js*
    ```
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
    ```
  * child components - `OfferDetails, OfferTemplate, OfferPreview, OfferConfirm`
    * [ChildComponent]Controller.js
    ```
      var action = component.get('c.getEmailTemplates');
      helper._serverSideCall(action, component).then(function(emailTemplates) {
          component.set('v.emailTemplates', emailTemplates);
      }).catch(function(error) {
          console.log('Error: ' + error);
      });
    ```
