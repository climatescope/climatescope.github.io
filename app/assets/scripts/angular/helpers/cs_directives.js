(function(){
  
  var directives = angular.module('csDirectives', ['i18nFilters']);
  
  directives.directive("initChart", function() {
    return {
      restrict: 'A',
      scope: {
        chart_to_load: '@initChart',
        chartData: '='
      },
      link: function (scope, element, attr) {
        var chart = null;
        var dataCopy = angular.copy(scope.chartData);
        // Initialise the chart and return an object that
        // has a draw method. This will be used to redraw
        // the chart on window resize.
        switch(scope.chart_to_load) {
          case 'installed_capacity':
            chart = chart__installed_capacity(element[0], dataCopy);
          break;
          case 'clean_energy_investments':
            chart = chart__clean_energy_investments(element[0], dataCopy);
          break;
          case 'carbon_offset':
            chart = chart__carbon_offset(element[0], dataCopy);
          break;
          case 'trendline':
            chart = chart__trendline(element[0], dataCopy);
          break;
          case 'price_attractiveness_electricity':
            chart = chart__price_attractiveness_electricity(element[0], scope.chartData);
          break;
        }

        if (chart) {
          var resize_func = debounce(function() {
            chart.draw();
          }, 100);

          $(window).on('resize', resize_func);
          
          scope.$on("$destroy", function(event) {
             $(window).off('resize', resize_func);
          });

          scope.$watch('chartData', function(value){
            chart.setData(angular.copy(value));
          });
        }
      }
    };
  });

  directives.directive("powerChart", function() {
    return {
      restrict: 'A',
      scope: {
        data: '=powerChart'
      },
      template: function() {
        var t = [
        '<table>',
          '<thead>',
            '<tr>',
              '<th><span class="visually-hidden">%% \'Question\' | translate %%</span></th>',
              '<th ng-repeat="key in data.meta[\'label-x\']">%% key %%</th>',
            '</tr>',
          '</thead>',
          '<tbody>',
            '<tr ng-repeat="question in data.data">',
              '<td>%% question.name %%</td>',
              '<td ng-repeat="key in data.meta[\'label-x\']" ng-init="isActive = question.values[0].value == $index" ng-class="{active: isActive}"><span ng-if="isActive">x</span></td>',
            '</tr>',
          '</tbody>',
        '</table>'
        ].join('');

        return t;
      }
    };
  });
})();