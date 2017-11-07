(function(){
  var app = angular.module('globalApp', ['ui.bootstrap', 'mathFilters', 'csDirectives'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('%%');
    $interpolateProvider.endSymbol('%%');
  });

  app.controller('CountryListController', ['$http', function($http) {
    var _self = this;
    // Data.
    this.countries = [];
    
    setupCommonCountryListMethods(_self);
    // Set sort.
    this.sortExpScoreField = '-score[0].value';
    this.setSortExpression('score[0].value');

    var url = CS.domain + '/' + CS.lang + '/api/countries.json';
    $http.get(url).success(function(data) {
      // Filter countries if region is set on the url.
      var region = getQueryString().region;
      if (region) {
        _self.countries = data.filter(function(o) {
          return o.region.id === region;
        });
      } else {
        _self.countries = data;
      }
    });
    
  }]);
})();