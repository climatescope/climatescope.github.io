(function(){
  var app = angular.module('countryApp', ['ngRoute', 'countryAppControllers', 'ui.bootstrap', 'mathFilters', 'csDirectives'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('%%');
    $interpolateProvider.endSymbol('%%');
  });

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/details', {
        templateUrl: 'in_detail.html',
        controller: 'DetailsTabController',
        controllerAs: 'detailsCtrl',
        activeTab: 'details'
      })
      .when('/states', {
        templateUrl: 'states.html',
        controller: 'StatesTabController',
        controllerAs: 'statesCtrl',
        activeTab: 'states'
      })
     // .when('/case-study', {
     //   templateUrl: 'case_study.html',
     //   controller: 'CaseStudyTabController',
     //   controllerAs: 'caseStudyCtrl',
     //   activeTab: 'case_study'
     // })
      .otherwise({
        redirectTo: '/details'
      });
  }]);

  // Service to provide data. Uses a simple cache to avoid making
  // several requests.
  app.factory('CountryData', ['$http', function($http) {
    var cache;
    this.get = function(cb) {
      if (cache) {
        cb(cache);
      }
      else {
        var url = CS.domain + '/' + CS.lang + '/api/countries/' + CS.countryId + '.json';
        $http.get(url).success(function(data) {
          cache = data;
          cb(data);
        });
      }
    };
    return this;
  }]);

  // Module
  var countryAppControllers = angular.module('countryAppControllers', []);
  
  countryAppControllers.controller('DescriptionController', [function() {
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
  
  countryAppControllers.controller('ProfileController', ['$http', function($http) {
    var _self = this;
    // Data.
    this.data = {};
    
    this.getIndicatorValue = function(indicator) {
      var value = formatThousands(indicator.value) + indicator.unit;
      return value;
    };

    var url = CS.domain + '/' + CS.lang + '/api/countries-profile/' + CS.countryId + '.json';
    $http.get(url).success(function(data) {
      _self.data = data;
    });

  }]);

  countryAppControllers.controller('StatsController', ['$http', 'CountryData', function($http, CountryData) {
    var _self = this;
    // Data.
    this.countryStats = {};

    setupPolicyStatsVizMethods(this);

    // Requests.
    var url = CS.policyProxy + '/policy?country=' + CS.countryId.toUpperCase();
    $http.get(url).success(function(data) {
      _self.countPolicyTypes(data.listData);
      _self.policyCount = data.metaData.totalResults;
    });
    
    // Temporarily use country data on the sidebar.
    CountryData.get(function(data) {
      _self.countryStats = data.score[0];
    });

  }]);

  // Controller for the navigation to activate the right tab.
  countryAppControllers.controller('CountryTabsController', ['$http', '$route', function($http, $route) {
    this.isActive = function(name) {
      return ($route.current) ? $route.current.activeTab == name : false;
    };
  }]);
  
  // Controller for the DETAILS TAB
  countryAppControllers.controller('DetailsTabController', ['$http', '$route', 'CountryData', function($http, $route, CountryData) {
    var _self = this;
    // Data.
    this.parameters = [];
    this.chartData = {
      'clean-energy-investments': null,
      'installed-capacity': null,
      'carbon-offset': null,
      'price-attractiveness-electricity': null,
      'price-attractiveness-fuel': null,
      'value-chains': null,

      'power-sector-1': null,
      'power-sector-2': null,
      'power-sector-3': null,
      'power-sector-4': null
    };

    setupCommonParamDetailTableMethods(_self);

    CountryData.get(function(data) {
      _self.parameters = data.parameters;
    });

    // The following lines load the data for each of the charts.
    // Some of the data needs to be processed before being sent to the chart.
    // This is done by calling the prepareData(). This function is implemented
    // on each of the chart's files.
    var url = null;
    url = CS.domain + '/' + CS.lang + '/api/auxiliary/clean-energy-investments/' + CS.countryId + '.json';
    $http.get(url).success(function(data) {
      // Data for this chart requires preparation.
      chart__clean_energy_investments.prepareData(data);
      _self.chartData['clean-energy-investments'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/installed-capacity/' + CS.countryId + '.json';
    $http.get(url).success(function(data) {
      // Data for this chart requires preparation.
      chart__installed_capacity.prepareData(data);
      _self.chartData['installed-capacity'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/carbon-offset-projects/' + CS.countryId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['carbon-offset'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/price-attractiveness-electricity/' + CS.countryId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['price-attractiveness-electricity'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/price-attractiveness-fuel/' + CS.countryId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['price-attractiveness-fuel'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/value-chains/' + CS.countryId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['value-chains'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/power-sector-1/' + CS.countryId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['power-sector-1'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/power-sector-2/' + CS.countryId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['power-sector-2'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/power-sector-3/' + CS.countryId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['power-sector-3'] = data;
    });

    url = CS.domain + '/' + CS.lang + '/api/auxiliary/power-sector-4/' + CS.countryId + '.json';
    $http.get(url).success(function(data) {
      _self.chartData['power-sector-4'] = data;
    });

  }]);
  
  // Controller for the STATES TAB
  countryAppControllers.controller('StatesTabController', ['$http', '$route', '$location', 'CountryData', function($http, $route, $location, CountryData) {
    var _self = this;
    // Data
    this.states = [];
    this.countryId = CS.countryId;
    // If there are no states for the country redirect.
    if (!CS.countryHasStates) {
      $location.path('/details');
    }

    setupCommonCountryListMethods(_self);
    // Set sort.
    this.setSort('score[0].value');

    CountryData.get(function(data) {
      _self.states = data.states;
    });

  }]);
  
  // Controller for the CASE STUDY TAB
  countryAppControllers.controller('CaseStudyTabController', ['$http', '$route', function($http, $route) {
    // code;
  }]);


})();
