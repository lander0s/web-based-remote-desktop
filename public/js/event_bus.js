
const EventBus = (() => {
  const subscriptions = {};

  function on(eventType, callback) {
    if(!subscriptions.hasOwnProperty(eventType)) {
      subscriptions[eventType] = [];
    }
    subscriptions[eventType].push(callback);
    return {
      eventType: eventType,
      index: subscriptions[eventType].length - 1,
    };
  }

  function trigger(eventType, eventArgs) {
    if(subscriptions.hasOwnProperty(eventType)) {
      subscriptions[eventType].forEach((callback) => {
        callback(eventArgs);
      });      
    }
  }

  function endSubscription(subscription) {
    if(subscriptions.hasOwnProperty(subscription.eventType)) {
      if (subscriptions[subscription.eventType].length > subscription.index) {
        subscriptions[subscription.eventType].splice(subscription.index, 1);
      }    
    }
  }

  return {
    on: on,
    trigger: trigger,
    endSubscription: endSubscription,
  };
})();
