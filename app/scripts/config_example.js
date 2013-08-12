(function(global) {
  var CONFIG = {
    address: '//pejs:4000',
    port: 4000,
    timers: {
      startup: 5000
    },

    messages: {
      welcome_message: 'Waiting to start..'
    }
  };

  global.SNOOKER_CONFIG = CONFIG;
})(typeof global === "undefined" ? window : exports);