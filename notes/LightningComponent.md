# Lightning Component

* Lightning Base Component
  * [lightning:input](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/aura_compref_lightning_input.htm)
  * [lightning:select](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/aura_compref_lightning_select.htm)
  * Since lightning base component will eventually be rendered as html (with SLDS styling), so we can provide custom css based on the eventually rendered html, see this example below
  ```
  /* OfferTemplate.cmp */
  <lightning:textarea name="Body" label="Your Name" value="{!v.templateText}" messageWhenValueMissing="This field is required." required="true"/>

  /* rendered HTML */
  <div class="slds-form-element__control" data-aura-rendered-by="219:793;a">
    <textarea class="slds-textarea" id="211:793;a" data-aura-rendered-by="220:793;a" name="Body" required="" aria-describedby="211:793;a-desc"></textarea>
  </div>

  /* OfferTemplate.css */
  .THIS .slds-form-element__control>textarea {
      height: 126px;
      background-color: red;
  }
  ```
  * ![css](/screenshots/css.png)

* aura attributes
  * [Supported aura:attribute Types](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/ref_aura_attribute.htm)

* Dynamically Creating Components
  * [Documentation](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/js_cb_dynamic_cmp_async.htm?search_text=dynamically)
  * Promisify it
  ```
  /* in parent component's helper */

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

  /* in child component's controller */

  helper._serverSideCall(action, component).then(function(sendResult) {

      ...
      // handle previous promise returned value "sendResult"
      ...

      // create component (via promise)
      return helper._createComponent("lightning:icon", {
          "aura:id": "resultIcon",
          "iconName": iconToShow,
          "size": "medium"
      });
  }).then(function(result) {
      if (result.status == 'SUCCESS') {
          var body = component.get('v.body');
          body.push(newIcon);
          component.set('v.body', body);
      } else {
          console.log('error ', result.errorMessage);
      }
  })
  ```

* Component Event vs Application Event
  * Please pay attention these 2 events required different syntax to fire
  ```
  /* component-level event */
  var cmpEvent = component.getEvent('bubblingEvent');
  cmpEvent.setParams({...});
  cmpEvent.fire();

  /* application-level event */
  var appEvent = $A.get("e.c:OfferDataEvent");
  appEvent.setParams({...});
  appEvent.fire();
  ```

* Modifying Components Outside the Framework Lifecycle
  * This is a tricky problem - based on the code below, in the `then()` block after we call `_serverSideCall` (a method defined in parent component's helper to return a promise for async apex server call), it worked fine when we tried to create/fire component-level event, but it would throw an error (appEvent is undefined) when we tried to create/fire a application-level event.
  ```
  helper._serverSideCall(action, component).then(function(offerId) {

      component.set('v.offerId', offerId);

      // fire component-level bubblingEvent
      var cmpEvent = component.getEvent('bubblingEvent');
      cmpEvent.setParams({'ComponentAction': actionName});
      cmpEvent.fire();

      // fire application-level appEvent
      var appEvent = $A.get("e.c:OfferDataEvent");
      appEvent.setParams({'LCWhoFired': 'OfferDetails.cmp'});
      appEvent.fire();

  }).catch(function(error) {
      console.log('Error: ' + error);
  });
  ```

  * The reason for this, is that component-level event was bundled with component, so as long as `component` was valid, we can retrieve the event successfully; however, application-level event was retrieved differently (via $A.get('...')), so it required the code to be run in Lightning context. Unfortunately, code in `.then()` is outside the Lightning event/action lifecycle, and required the use of `$A.getCallback()` to re-establish the context.
  ```
  helper._serverSideCall(action, component).then($A.getCallback(function(offerId) {
    component.set('v.offerId', offerId);

    // fire component-level bubblingEvent
    var cmpEvent = component.getEvent('bubblingEvent');
    cmpEvent.setParams({'ComponentAction': actionName});
    cmpEvent.fire();

    // fire application-level appEvent
    var appEvent = $A.get("e.c:OfferDataEvent");
    appEvent.setParams({'LCWhoFired': 'OfferDetails.cmp'});
    appEvent.fire();

  })).catch(function(error) {
      console.log('Error: ' + error);
  });
  ```
  * In the actual code, I encapsulated event firing logic in parent's helper
  * [Documentation](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/js_cb_mod_ext_js.htm)
  * [$A.get("application-event") is undefined](http://salesforce.stackexchange.com/questions/158422/a-get-for-application-event-is-undefined-or-can-only-fire-once)
