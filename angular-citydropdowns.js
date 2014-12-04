/*
* Author: Jake AuYeung
* Mail: jakeauyeung@Gmail.com
* Date: 2014-11-20
* ngCityDropdowns
* DropDowns directive for AngularJS
 */
'use strict';
var dd = angular.module('ngCityDropdowns', []);

dd.directive('cityDropdownSelect', ['DropdownServiceCity', '$window',
  function (DropdownServiceCity, $window) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        cityDropdownSelect: '=',
        dropdownModel: '=',
        dropdownOnchange: '&'
      },

      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        $scope.labelField = $attrs.dropdownItemLabel || 'text';
        $scope.countField = $attrs.dropdownItemCount || 'text';

        DropdownServiceCity.register($element);


        this.select = function (selected, name, deal_count) {
          selected = {
            'name': selected.name,
            'deal_count': selected.deal_count,
            'circle': {
              'name': name,
              'deal_count': deal_count
            },
            'choose': {
              'name':name
            },
            'distance': {
              'name': ''
            }
          }
          if (selected !== $scope.dropdownModel) {
            angular.copy(selected, $scope.dropdownModel);
          }
          $scope.dropdownOnchange({
            selected: selected
          });
        };


        this.removeClick = function() {
          $($element[0]).removeClass('active');
        }

        $scope.circleAll = function() {
          var selected = {
            'name': '',
            'deal_count': '',
            'circle': {
              'name': '全部商区',
              'deal_count': ''
            },
            'choose': {
              'name': '全部商区'
            },
            'distance': {
              'name': ''
            }
          }
          if (selected !== $scope.dropdownModel) {
            angular.copy(selected, $scope.dropdownModel);
          }
          $scope.dropdownOnchange({
            selected: selected
          });
          $($element[0]).removeClass('active');
        }

        var getDistance = function(dis) {
          var districtJson = window.sessionStorage.getItem('cityChangeSelectData');
          var selected
          if(districtJson) {
            districtJson = JSON.parse(districtJson);
            selected = {
              'name': districtJson.name,
              'circle': {
                'name': districtJson.circle.name,
              },
              'choose': {
                'name': dis
              },
              'distance': {
                'name': dis
              }
            }
          } else {
            selected = {
              'name': '',
              'deal_count': '',
              'circle': {
                'name': '',
                'deal_count': ''
              },
              'choose': {
                'name': dis
              },
              'distance': {
                'name': dis
              }
            }
          }
          if (selected !== $scope.dropdownModel) {
            angular.copy(selected, $scope.dropdownModel);
          }
          $scope.dropdownOnchange({
            selected: selected
          });
          $($element[0]).removeClass('active');
           $('.nore').removeClass('cur')

        }

        $scope.selectItemSprice = function(distance) {
          switch(distance) {
            case '不限距离':
              getDistance(distance);
            break;
            case '500米':
              getDistance(distance);
            break;
            case '1000米':
              getDistance(distance);
            break;
            case '2000米':
              getDistance(distance);
            break;
            case '5000米':
              getDistance(distance);
            break;
          }
        }


        $scope.selectCircleSprice = function(event) {
           $('.sub-right').hide();
           $('.district-list').removeClass('cur');
           $('.all-dist').removeClass('cur');
           $('.nore').addClass('cur').find('.sub-right').show();
        }

        $scope.disList = [{'dis': '不限距离'},{'dis': '500米'},{'dis': '1000米'},{'dis': '2000米'},{'dis': '5000米'}]

        // Does not register touchstart events outside of directive scope
        var $clickEvent = ('click'||'touchstart' in $window);
        $element.bind($clickEvent, function (event) {
          event.stopPropagation();
          DropdownServiceCity.toggleActiveCity($element, $scope.dropdownModel.name, $scope.dropdownModel.circle.name, $scope.dropdownModel.choose.name);
        });

        $scope.$on('$destroy', function () {
          DropdownServiceCity.unregister($element);
        });

        

      }],

      template: [
        '<div class="wrap-dd-select-city">',
          '<div class="nav-mask"></div>',
          '<span class="selected"><span class="selected-item">{{dropdownModel.choose[labelField]}}</span><i class="sarrow"></i>',
          '<div class="dropdown">',
            '<div class="left">',
              '<ul>',
                '<li class="district-list nore">',
                  '<a ng-click="selectCircleSprice()" class="dropdown-item"><i class="drop-list-text">附近</i></a>',
                  '<div class="sub-right">',
                    '<a ng-click="selectItemSprice(distance.dis)" ng-repeat="distance in disList"><b>{{distance.dis}}</b><span class="check icon-check"></span></a>',
                  '</div>',
                '</li>',
                '<li class="all-dist"><a ng-click="circleAll()">全部商区</a></li>',
                '<li ng-repeat="item in cityDropdownSelect"',
                  'dropdown-select-city="item"',
                  'dropdown-item-count="countField"',
                  'dropdown-item-label="labelField">',
                '</li>',
              '</ul>',
            '</div>',
            '<div class="right">',
            '</div>',
          '</div>',
        '</div>'
      ].join('')
    };
  }
]);
dd.directive('dropdownSelectCity', [
  function () {
    return {
      require: '^cityDropdownSelect',
      replace: true,
      scope: {
        dropdownItemLabel: '=',
        dropdownItemCount: '=',
        dropdownSelectCity: '='
      },

      link: function (scope, element, attrs, dropdownSelectCtrl) {
        scope.selectItem = function (name, deal_count) {
          if (scope.dropdownSelectCity.href) {
            return;
          }
          dropdownSelectCtrl.select(scope.dropdownSelectCity, name, deal_count);
          dropdownSelectCtrl.removeClick();
        };
        

        scope.selectCircle = function() {
           $('.sub-right').hide();
           $('.district-list').removeClass('cur');
           $('.all-dist').removeClass('cur');
           $(element[0]).addClass('cur');
           $(element.children()[1]).show()
        }



      },

      template: [
        '<li class="district-list" >',
          '<a href="" class="dropdown-item"',
          ' ng-if="dropdownSelectCity.name"',
          ' ng-href="{{dropdownSelectCity.href}}"',
          ' ng-click="selectCircle()">',
            '<i class="drop-list-text">{{dropdownSelectCity[dropdownItemLabel]}}</i>',
            '<span class="num">{{dropdownSelectCity[dropdownItemCount]}}</span>',
          '</a>',
          '<div class="sub-right" ng-if="dropdownSelectCity.name">',
            '<a ng-click="selectItem(dropdownSelectCity[dropdownItemLabel])">全部<b>{{dropdownSelectCity[dropdownItemLabel]}}</b><span class="check icon-check"></span><span class="num">{{dropdownSelectCity[dropdownItemCount]}}</span></a>',
            '<a ng-repeat="cirle in dropdownSelectCity.circle"',
            'ng-click="selectItem(cirle.name, cirle.deal_count)">',
              '<b>{{cirle.name}}</b>',
              '<span class="check icon-check"></span>',
              '<span class="num">{{cirle.deal_count}}</span>',
            '</a>',
          '</div>',
        '</li>'
      ].join('')
    };
  }
]);
dd.directive('dropdownSelectCircle', [
  function () {
    return {
      require: '^cityDropdownSelect',
      replace: true,
      scope: {
        dropdownCircleLabel: '=',
        dropdownCircleCount: '=',
        dropdownSelectCircle: '='
      },

      link: function (scope, element, attrs, dropdownSelectCtrl) {
        scope.selectItem = function () {
          if (scope.dropdownSelectCircle.href) {
            return;
          }
          dropdownSelectCtrl.select(scope.dropdownSelectCircle);
        };



      },

      template: [
        '<li>',
          '<a href="" class="dropdown-item"',
          ' ng-href="{{dropdownSelectCircle.href}}"',
          ' ng-click="selectItem()">',
            '<i class="drop-list-text">{{dropdownSelectCircle[dropdownCircleLabel]}}</i>',
            '<span class="check icon-check"></span>',
            '<span class="num">{{dropdownSelectCircle[dropdownCircleCount]}}</span>',
          '</a>',
        '</li>'
      ].join('')
    };
  }
]);

dd.directive('dropdownMenu', ['$parse', '$compile', 'DropdownServiceCity', '$window',
  function ($parse, $compile, DropdownServiceCity, $window) {
    return {
      restrict: 'A',
      replace: false,
      scope: {
        dropdownMenu: '=',
        dropdownModel: '=',
        dropdownOnchange: '&'
      },

      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        $scope.labelField = $attrs.dropdownItemLabel || 'text';
        $scope.countField = $attrs.dropdownItemCount || 'text';

        // Does not register touchstart events outside of directive scope.
        var $clickEvent = ('click'||'touchstart'in $window);
        var $template = angular.element([
          '<ul class="dropdown">',
            '<li ng-repeat="item in dropdownMenu"',
            ' class="dropdown-item"',
            ' dropdown-item-label="labelField"',
            ' dropdown-item-count="countField"',
            ' dropdown-menu-item="item">',
            '</li>',
          '</ul>'
        ].join(''));
        // Attach this controller to the element's data
        $template.data('$dropdownMenuController', this);

        var tpl = $compile($template)($scope);
        var $wrap = angular.element('<div class="wrap-dd-menu"></div>');

        $element.replaceWith($wrap);
        $wrap.append($element);
        $wrap.append(tpl);

        DropdownServiceCity.register(tpl);

        this.select = function (selected) {
          if (selected !== $scope.dropdownModel) {
            angular.copy(selected, $scope.dropdownModel);
          }
          $scope.dropdownOnchange({
            selected: selected
          });
        };

        $element.bind($clickEvent, function (event) {
          event.stopPropagation();
          DropdownServiceCity.toggleActiveCity(tpl);
        });

        $scope.$on('$destroy', function () {
          DropdownServiceCity.unregister(tpl);
        });
      }]
    };
  }
]);

dd.directive('dropdownMenuItem', [
  function () {
    return {
      require: '^dropdownMenu',
      replace: true,
      scope: {
        dropdownMenuItem: '=',
        dropdownItemLabel: '=',
        dropdownItemCount: '='
      },

      link: function (scope, element, attrs, dropdownMenuCtrl) {
        scope.selectItem = function () {
          if (scope.dropdownMenuItem.href) {
            return;
          }
          dropdownMenuCtrl.select(scope.dropdownMenuItem);
        };
      },

      template: [
        '<li>',
          '<a href="" class="dropdown-item"',
          ' ng-click="selectItem()">',
            '{{dropdownMenuItem[dropdownItemLabel]}}',
          '</a>',
        '</li>'
      ].join('')
    };
  }
]);

dd.factory('DropdownServiceCity', ['$document',
  function ($document) {
    var body = $document.find('body'),
        service = {},
        _dropdowns = [];
    body.bind('click', function () {
      angular.forEach(_dropdowns, function (el) {
        el.removeClass('active');
      });
    });

    service.register = function (ddEl) {
      _dropdowns.push(ddEl);
    };

    

    service.unregister = function (ddEl) {
      var index;
      index = _dropdowns.indexOf(ddEl);
      if (index > -1) {
        _dropdowns.splice(index, 1);
      }
    };

    service.toggleActiveCity = function (ddEl, sessionStore, sessionStoreCirle, sessionStoreDistance) {
      $('.wrap-dd-select').removeClass('active');
      angular.forEach(_dropdowns, function (el) {
        if (el !== ddEl) {
          el.removeClass('active');
        }
      });

      var dropText = ddEl.find('i');
      var cirleText = ddEl.find('b');

      if(sessionStoreCirle === '全部商区') {
        $('.all-dist').addClass('cur')
      }

      




      angular.forEach(dropText, function(i,v) {
          var dropTextCell = $(i).text();
          if(sessionStore === dropTextCell) {
            $(i).parents('li').addClass('cur');
          }else {
            $(i).parents('li').removeClass('cur');
          }

      })


      angular.forEach(cirleText, function(i,v) {
          var dropCirleCell = $(i).text();
          if(sessionStoreCirle === dropCirleCell || sessionStoreDistance === dropCirleCell) {
            $(i).parents('a').addClass('current');
            $(i).parents('.sub-right').show();
          }else {
            $(i).parents('a').removeClass('current');
          }

      })

      var changeCur = function() {
        $('.all-dist').removeClass('cur');
        $('.district-list').removeClass('cur');
        $('.nore').addClass('cur');
      }

      switch(sessionStoreDistance) {
        case '不限距离':
        changeCur();
        break;
        case '500米':
        changeCur();
        break;
        case '1000米':
        changeCur();
        break;
        case '2000米':
        changeCur();
        break;
        case '5000米':
        changeCur();
        break;
      }

      ddEl.find('a').bind('click', function(event) {
        event.stopPropagation();
        // ddEl.addClass('active');
      })

      ddEl.toggleClass('active');
    };

    return service;
  }
]);
