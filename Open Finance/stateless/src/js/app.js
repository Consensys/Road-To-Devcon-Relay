App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load profiles.
    $.getJSON('../profiles.json', function(data) {
      var profilesRow = $('#profilesRow');
      var profileTemplate = $('#profileTemplate');

      for (i = 0; i < data.length; i ++) {
        profileTemplate.find('.panel-title').text(data[i].name);
        profileTemplate.find('img').attr('src', data[i].picture);
        profileTemplate.find('.human-from').text(data[i].from);
        profileTemplate.find('.human-age').text(data[i].age);
        profileTemplate.find('.human-location').text(data[i].location);
        profileTemplate.find('.btn-verify').attr('data-id', data[i].id);

        profilesRow.append(profileTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {

    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Stateless.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var StatelessArtifact = data;
      App.contracts.Stateless = TruffleContract(StatelessArtifact);

      // Set the provider for our contract
      App.contracts.Stateless.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the verified profiles
      return App.markVerified();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-verify', App.handleVerify);
  },

  markVerified: function(verifiers, account) {
    var verificationInstance;

    App.contracts.Stateless.deployed().then(function(instance) {
      verificationInstance = instance;

      return verificationInstance.getVerifiers.call();
    }).then(function(verifiers) {
      for (i = 0; i < verifiers.length; i++) {
        if (verifiers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-profile').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleVerify: function(event) {
    event.preventDefault();

    var humanId = parseInt($(event.target).data('id'));

    var verificationInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Stateless.deployed().then(function(instance) {
        verificationInstance = instance;

        // Execute verify as a transaction by sending account
        return verificationInstance.verify(humanId, {from: account});
      }).then(function(result) {
        return App.markVerified();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
