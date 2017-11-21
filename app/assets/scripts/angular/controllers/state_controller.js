(function(){
  var app = angular.module('stateApp', ['ngRoute', 'ui.bootstrap', 'mathFilters', 'csDirectives'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('%%');
    $interpolateProvider.endSymbol('%%');
  });

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/enabling-framework', {
        templateUrl: 'enabling-framework.html',
        controller: 'EnablingFrameworkTabController',
        controllerAs: 'detailsCtrl',
        activeTab: 'enabling-framework'
      })
      .when('/financing-investments', {
        templateUrl: 'financing-investments.html',
        controller: 'FinancingInvestmentsTabController',
        controllerAs: 'detailsCtrl',
        activeTab: 'financing-investments'
      })
      .when('/value-chains', {
        templateUrl: 'value-chains.html',
        controller: 'ValueChainsTabController',
        controllerAs: 'detailsCtrl',
        activeTab: 'value-chains'
      })
      .when('/ghg-management', {
        templateUrl: 'ghg-management.html',
        controller: 'GhgManagementTabController',
        controllerAs: 'detailsCtrl',
        activeTab: 'ghg-management'
      })
      .otherwise({
        redirectTo: '/enabling-framework'
      });
  }]);

  // Controller for the navigation to activate the right tab.
  app.controller('StateTabsController', ['$http', '$route', function($http, $route) {
    this.isActive = function(name) {
      return ($route.current) ? $route.current.activeTab == name : false;
    };
  }]);

  // Service to provide data. Uses a simple cache to avoid making
  // several requests.
  app.factory('StateData', ['$http', function($http) {
    var cache;
    this.get = function(cb) {
      if (cache) {
        cb(cache);
      }
      else {
        var url = CS.domain + '/' + CS.lang + '/api/countries/' + CS.stateId + '.json';
        $http.get(url).success(function(data) {
          cache = data;
          cb(data);
        });
      }
    };
    return this;
  }]);

  app.controller('DescriptionController', [function() {
    var fakeScope = {};
    // We only want to get a single method out of this.
    setupCommonParamDetailTableMethods(fakeScope);
    this.toggleExpandable = fakeScope.toggleExpandable;

    // Note: This is not the angular way of doing things.
    // However moving everything to a directive would prove to be to great
    // of an effort.
    this.checkExpandable = function(target) {
      var $target = $(target);
      var $targetInner = $('.expandable-wrapper', $target);
      var height = $targetInner.height();
      var max = $target.css('max-height').replace('px', '');
      if (height <= max) {
        $target.addClass('revealed');
        $('.prose-copy-actions .bttn').remove();
      }
    };
  }]);

  app.controller('EnablingFrameworkTabController', ['$http', '$route', 'StateData', function($http, $route, StateData) {
    var _self = this;
    // Data.
    this.parameters = [];
    this.chartData = {
      'installed-capacity': null,
      'price-attractiveness-electricity': null,
      'price-attractiveness-fuel': null,

      'power-sector-1': null,
      'power-sector-2': null,
      'power-sector-3': null,
      'power-sector-4': null
    }

    setupCommonParamDetailTableMethods(_self);

    StateData.get(function(data) {
      _self.parameters = [data.parameters[0]];
    });

    // The following lines load the data for each of the charts.
    // Some of the data needs to be processed before being sent to the chart.
    // This is done by calling the prepareData(). This function is implemented
    // on each of the chart's files.
    var url = null;
    url = CS.domain + '/' + CS.lang + '/api/auxiliary/installed-capacity/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      // Data for this chart requires preparation.
      chart__installed_capacity.prepareData(data);
      _self.chartData['installed-capacity'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/price-attractiveness-electricity/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['price-attractiveness-electricity'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/price-attractiveness-fuel/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['price-attractiveness-fuel'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/power-sector-1/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['power-sector-1'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/power-sector-2/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['power-sector-2'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/power-sector-3/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['power-sector-3'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/power-sector-4/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['power-sector-4'] = data;
    });
  }]);

  app.controller('FinancingInvestmentsTabController', ['$http', '$route', 'StateData', function($http, $route, StateData) {
    var _self = this;
    // Data.
    this.parameters = [];
    this.chartData = {
      'clean-energy-investments': null
    }

    setupCommonParamDetailTableMethods(_self);

    StateData.get(function(data) {
      _self.parameters = [data.parameters[1]];
    });

    // The following lines load the data for each of the charts.
    // Some of the data needs to be processed before being sent to the chart.
    // This is done by calling the prepareData(). This function is implemented
    // on each of the chart's files.
    var url = null;
    url = CS.domain + '/' + CS.lang + '/api/auxiliary/clean-energy-investments/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      // Data for this chart requires preparation.
      chart__clean_energy_investments.prepareData(data);
      _self.chartData['clean-energy-investments'] = data;
    });
  }]);

  app.controller('ValueChainsTabController', ['$http', '$route', 'StateData', function($http, $route, StateData) {
    var _self = this;
    // Data.
    this.parameters = [];
    this.chartData = {
      'value-chains': null
    }

    setupCommonParamDetailTableMethods(_self);

    StateData.get(function(data) {
      _self.parameters = [data.parameters[2]];
    });

    // The following lines load the data for each of the charts.
    // Some of the data needs to be processed before being sent to the chart.
    // This is done by calling the prepareData(). This function is implemented
    // on each of the chart's files.
    var url = null;
    url = CS.domain + '/' + CS.lang + '/api/auxiliary/value-chains/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['value-chains'] = data;
    });
  }]);

  app.controller('GhgManagementTabController', ['$http', '$route', 'StateData', function($http, $route, StateData) {
    var _self = this;
    // Data.
    this.parameters = [];
    this.chartData = {
      'carbon-offset': null
    }

    setupCommonParamDetailTableMethods(_self);

    StateData.get(function(data) {
      _self.parameters = [data.parameters[3]];
    });

    // The following lines load the data for each of the charts.
    // Some of the data needs to be processed before being sent to the chart.
    // This is done by calling the prepareData(). This function is implemented
    // on each of the chart's files.
    var url = null;
    url = CS.domain + '/' + CS.lang + '/api/auxiliary/carbon-offset-projects/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['carbon-offset'] = data;
    });
  }]);

  app.controller('ProfileController', ['$http', function($http) {
    var _self = this;
    // Data.
    this.data = {};
    
    this.getIndicatorValue = function(indicator) {
      var value = formatThousands(indicator.value) + indicator.unit;
      return value;
    };

    var url = CS.domain + '/' + CS.lang + '/api/countries-profile/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      _self.data = data;
    });

  }]);

  app.controller('StatsController', ['$http', function($http) {
    var _self = this;
    // Data.
    this.stateStats = {};

    setupPolicyStatsVizMethods(this);

    var url = CS.policyProxy + '/policy?state=' + CS.stateId.toUpperCase();
    $http.get(url).success(function(data) {
      _self.countPolicyTypes(data.listData);
      _self.policyCount = data.metaData.totalResults;
    });
    
    var url = CS.domain + '/' + CS.lang + '/api/countries/' + CS.stateId + '.json';
    $http.get(url).success(function(data) {
      _self.stateStats = data.score[0];
    });

  }]);

  app.controller('ActionsMenuController', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {
    $rootScope.$on('$locationChangeSuccess', function() {
      var currentPath = $location.url();
      $scope.getUrl = function (baseUrl) {
        return encodeURIComponent(baseUrl + '#' + currentPath);
      }
      // Update language switcher url.
      updateLangSwitcherUrl(currentPath);
    });
  }]);
})();
