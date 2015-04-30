/**
 * Created by wangxufeng on 2015/4/27.
 */
(function () {

    angular
        .module('games')
        .controller('UserController', [
            'userService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$scope', '$mdDialog',
            UserController
        ]);

    /**
     * Main Controller for the Angular Material Starter App
     * @param $scope
     * @param $mdSidenav
     * @param avatarsService
     * @constructor
     */
    function UserController(userService, $mdSidenav, $mdBottomSheet, $log, $q, $scope, $mdDialog) {
        var self = this;

        self.selected = null;
        self.users = [];
        self.selectUser = selectUser;
        self.toggleList = toggleUsersList;
        self.toggleUserCtrl = toggleUserCtrl;
        self.share = share;
        self.toggleTimePanel = toggleTimePanel;
		self.rangeSelectOptions = [/*{
				label: "最近1周",
				range: moment().range(
					moment().startOf("week").startOf("day"),
					moment().endOf("day").startOf("day")
				)
			}, {
				label: "最近1月",
				range: moment().range(
					moment().startOf("month").startOf("day"),
					moment().endOf("month").startOf("day")
				)
			}*/];
		self.timeItems = [
			{name: '实时', el_pc_id: 'btn-realtime', el_id: 'btn-btm-realtime', icon: 'clock', icon_url: 'assets/svg/clock.svg', primary: true, showDatePicker: false},
			{name: '日', el_pc_id: 'btn-daily', el_id: 'btn-btm-daily', icon: 'clock', icon_url: 'assets/svg/clock.svg', primary: false, showDatePicker: false},
			{name: '周', el_pc_id: 'btn-weekly', el_id: 'btn-btm-weekly', icon: 'clock', icon_url: 'assets/svg/clock.svg', primary: false, showDatePicker: false},
			{name: '月', el_pc_id: 'btn-monthly', el_id: 'btn-btm-monthly', icon: 'clock', icon_url: 'assets/svg/clock.svg', primary: false, showDatePicker: false},
			{name: '季度', el_pc_id: 'btn-quarterly', el_id: 'btn-btm-quarterly', icon: 'clock', icon_url: 'assets/svg/clock.svg', primary: false, showDatePicker: false},
			{name: '自定义', el_pc_id: 'btn-timediy', el_id: 'btn-btm-timediy', icon: 'clock', icon_url: 'assets/svg/clock.svg', primary: false, showDatePicker: true}
		];
		self.performAction = performAction;
		self.showPcDateRangePicker = false;

		self.showTrend = showTrend;
        self.showDist = showDist;
		
		self.selectTotal = selectTotal;
		
		
		function performAction (item) {
			for (key in self.timeItems) {
				self.timeItems[key].primary = false;
			}
			item.primary = true;
			
			if ('btn-timediy' == item.el_pc_id) {
				this.showPcDateRangePicker = true;
			} else {
				this.showPcDateRangePicker = false;
			}
		};


        // Load all registered users

        userService
            .loadAllUsers()
            .then(function (users) {
                self.users = [].concat(users);
                //self.selected = users[0];
            });

        // *********************************
        // Internal methods
        // *********************************

        /**
         * First hide the bottomsheet IF visible, then
         * hide or Show the 'left' sideNav area
         */
        function toggleUsersList() {
            var pending = $mdBottomSheet.hide() || $q.when(true);

            pending.then(function () {
                $mdSidenav('left').toggle();
            });
        }

        function toggleUserCtrl() {
            //............
        }

        /**
         * Select the current avatars
         * @param menuId
         */
        function selectUser(user) {
            self.selected = angular.isNumber(user) ? $scope.users[user] : user;
            self.toggleList();
        }
		
		function selectTotal() {
			self.selected = false;
		}

        /**
         * Show the bottom sheet
         */
        function share($event) {
            var user = self.selected;

            $mdBottomSheet.show({
                parent: angular.element(document.getElementById('content')),
                templateUrl: 'src/users/view/contactSheet.html',
                controller: ['$mdBottomSheet', UserSheetController],
                controllerAs: "vm",
                bindToController: true,
                targetEvent: $event
            }).then(function (clickedItem) {
                clickedItem && $log.debug(clickedItem.name + ' clicked!');
            });

            /**
             * Bottom Sheet controller for the Avatar Actions
             */
            function UserSheetController($mdBottomSheet) {
                this.user = user;
                this.items = [
                    {name: 'Phone', icon: 'phone', icon_url: 'assets/svg/phone.svg'},
                    {name: 'Twitter', icon: 'twitter', icon_url: 'assets/svg/twitter.svg'},
                    {name: 'Google+', icon: 'google_plus', icon_url: 'assets/svg/google_plus.svg'},
                    {name: 'Hangout', icon: 'hangouts', icon_url: 'assets/svg/hangouts.svg'}
                ];
                this.performAction = function (action) {
                    $mdBottomSheet.hide(action);
                };
            }
        }

        function toggleTimePanel($event) {
            $mdBottomSheet.show({
                parent: angular.element(document.getElementById("content")),
                templateUrl: 'template/timeSelSheet.html',
                controller: ['$mdBottomSheet', '$scope', TimeSelSheetController],
                controllerAs: "ts",
                bindToController: true,
                targetEvent: $event
            }).then(function (clickedItem) {
                clickedItem && $log.debug(clickedItem + ' clicked!');
            });

            function TimeSelSheetController($mdBottomSheet, $scope) {
				this.showDateRangePicker = false;
				
                this.items = self.timeItems;
				
                this.performAction = function (item) {
					for (key in this.items) {
						this.items[key].primary = false;
					}
					item.primary = true;
					
					if ('btn-btm-timediy' == item.el_id) {
						this.showDateRangePicker = true;
					} else {
						this.showDateRangePicker = false;
					}
                };
				
            }
        }

		function toggleTimeDiyPanel($event) {
			$mdBottomSheet.show({
				parent: angular.element(document.getElementById("content")),
				templateUrl: 'template/timeDiySelSheet.html',
				controller: ['$mdBottomSheet', TimeDiySelSheetController],
				controllerAs: 'tsdiy',
				bindToController: true,
				targetEvent: $event
			}).then(function (clickedItem) {
				console.log('time diy clicked!');
			});
			
			function TimeDiySelSheetController($mdBottomSheet) {
				this.chooseDiyTs = function () {
					$mdBottomSheet.hide(action);
					toggleTimePanel($event);
				}
			}
		}
		
		
		function showTrend($event) {
			$mdDialog.show({
				controller: TrendDialogController,
				templateUrl: 'template/trendChartTpl.html',
				targetEvent: $event,
			})
			.then(function(answer) {
				console.log('You said the information was "' + answer + '".');
			}, function() {
				console.log('You cancelled the dialog.');
			});
			
			
			function TrendDialogController($scope, $mdDialog) {
				$scope.hide = function() {
					$mdDialog.hide();
				};
				$scope.cancel = function() {
					$mdDialog.cancel();
				};
				$scope.answer = function(answer) {
					$mdDialog.hide(answer);
				};
				$scope.games = self.users;
			}
		}
		
		function showDist($event) {
			$mdDialog.show({
				controller: DistDialogController,
				templateUrl: 'template/distChartTpl.html',
				targetEvent: $event,
			})
			.then(function(answer) {
				console.log('You said the information was "' + answer + '".');
			}, function() {
				console.log('You cancelled the dialog.');
			});
			
			
			function DistDialogController($scope, $mdDialog) {
				$scope.hide = function() {
					$mdDialog.hide();
				};
				$scope.cancel = function() {
					$mdDialog.cancel();
				};
				$scope.answer = function(answer) {
					$mdDialog.hide(answer);
				};
				$scope.games = self.users;
			}
		}
  };
})();