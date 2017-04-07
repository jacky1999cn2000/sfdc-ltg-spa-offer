# Lightning Component

* Lightning Base Component
  * [lightning:input](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/aura_compref_lightning_input.htm)
  * [lightning:select](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/aura_compref_lightning_select.htm)

* aura attributes
  * [Supported aura:attribute Types](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/ref_aura_attribute.htm)

* Component Event vs Application Event
  *

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
  * [Documentation](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/js_cb_mod_ext_js.htm)
  * [$A.get("application-event") is undefined](http://salesforce.stackexchange.com/questions/158422/a-get-for-application-event-is-undefined-or-can-only-fire-once)
