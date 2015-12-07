var _ = require('underscore'),
    Class = require('class.extend');

/**
 * Updates topics when prompted to do so.
 */
module.exports = Class.extend({

   init: function(channel, topicRetriever) {
      this._channels = _.isArray(channel) ? channel : [ channel ];
      this._retriever = topicRetriever;
   },

   extension: function() {
      return function(client, IBF) {
         this._client = client;
         // TODO: IBF itself needs to be parsing commands, not plugins
         client.on('directmessage', function(sender, channel, msg, data) {
            if (msg.replace(new RegExp(client.nick() + ':?\\s+'), '') == 'update-topic' && _.contains(this._channels, channel)) {
               this.doUpdate(channel);
            }
         }.bind(this));
      }.bind(this);
   },

   doUpdate: function(channel) {
      this._client.send('topic', channel, this._retriever());
   },

});
